import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Send,
    Bot,
    Loader2,
    BarChart2,
    Table as TableIcon,
    Download,
    Sparkles,
    Key
} from "lucide-react";
import OpenAI from "openai";
import { mockResearchData, columnDefinitions } from "@/lib/mock-dashboard-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChartBuilder } from "./chart-builder";
import { PatientTable } from "./patient-table";

// 메시지 타입 정의
interface Message {
    role: "user" | "assistant";
    content: string;
    type?: "text" | "data";
    data?: any;
}

/**
 * ResearchAgentInterface 컴포넌트
 * 
 * 이 컴포넌트는 사용자가 자연어로 질문하면 AI가 데이터를 분석하여 
 * 텍스트 답변이나 차트/테이블 형태의 데이터 시각화를 제공하는 대화형 인터페이스입니다.
 * 
 * [작동 원리]
 * 1. 사용자의 질문(Prompt)과 현재 데이터의 스키마(컬럼 정의) 및 샘플 데이터를 OpenAI API에 전송합니다.
 * 2. 시스템 프롬프트(System Prompt)는 AI에게 "수의학 연구 보조원"이라는 역할을 부여하고,
 *    사용자의 질문 의도에 따라 적절한 JSON 형식으로 응답하도록 지시합니다.
 * 3. AI가 데이터 분석이 필요하다고 판단하면 'data' 타입의 응답을 생성하며, 
 *    여기에는 필터링된 환자 리스트와 추천 차트 설정(Chart Config)이 포함됩니다.
 * 4. 클라이언트는 이 응답을 파싱하여:
 *    - 텍스트 답변은 말풍선으로 표시하고,
 *    - 데이터 응답은 'DataResultCard' 컴포넌트를 통해 테이블(PatientTable)과 차트(ChartBuilder)로 렌더링합니다.
 */
export function ResearchAgentInterface() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // 데모용 기본 API 키 (실제 배포 시에는 환경 변수나 보안 저장소를 사용해야 함)
    const [apiKey, setApiKey] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "안녕하세요! Groq 기반 연구 데이터 분석 도우미입니다. 원하시는 데이터나 분석 내용을 말씀해주세요.\n예: '7살 이상 말티즈 중 심장질환이 있는 환자 리스트 보여줘' 또는 '나이와 체중의 상관관계를 보여줘'",
            type: "text"
        }
    ]);

    // 메시지 전송 핸들러
    const handleSend = async () => {
        if (!prompt.trim()) return;
        if (!apiKey) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "API Key가 설정되지 않았습니다. 우측 상단의 열쇠 아이콘을 눌러 Groq API Key를 입력해주세요.",
                type: "text"
            }]);
            return;
        }

        // 사용자 메시지 추가
        const userMsg: Message = { role: "user", content: prompt };
        setMessages(prev => [...prev, userMsg]);
        setPrompt("");
        setIsLoading(true);

        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                baseURL: "https://api.groq.com/openai/v1",
                dangerouslyAllowBrowser: true // 클라이언트 사이드 데모를 위해 허용 (보안 주의)
            });

            // 컨텍스트 데이터 준비
            // 토큰 제한을 고려하여 전체 데이터 대신 스키마와 일부 샘플 데이터만 전송합니다.
            // 실제 프로덕션 환경에서는 RAG(Retrieval-Augmented Generation) 등을 사용하여 관련성 높은 데이터만 추출해야 합니다.
            const contextData = {
                columns: columnDefinitions.map(c => ({ key: c.key, label: c.label, type: c.type })),
                patients: mockResearchData.patients.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    breed: p.breed,
                    age: p.age,
                    weight: p.weight,
                    diagnosis: p.diagnosis,
                    gender: p.gender,
                    // 주요 바이오마커 추가 (분석 가능성 확장)
                    "c.NT-proBNP": p["CM001"],
                    "Creatinine": p["BC009"],
                    "ALT": p["BC001"],
                    "BUN": p["BC008"]
                }))
            };

            // Groq API 호출
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a veterinary research assistant. You have access to patient data.
                        
                        Data Schema:
                        ${JSON.stringify(contextData.columns)}

                        Sample Data (first 50 patients):
                        ${JSON.stringify(contextData.patients)}
                        
                        [Instructions]
                        1. Analyze the user's request.
                        2. If the user asks for a list, filter the data accordingly.
                        3. If the user asks for a chart or correlation, suggest a chart configuration.
                        
                        [Response Format]
                        If the user asks for a list or data analysis, return a JSON object with the following structure:
                        {
                            "type": "data",
                            "content": "Brief summary text explaining the result in Korean",
                            "data": {
                                "title": "Title of the data view",
                                "count": number of items,
                                "list": [array of matching patient objects. IMPORTANT: Include ALL relevant columns requested or needed for the chart],
                                "relevantColumns": [array of column keys to display in the table, e.g. ["id", "name", "age", "weight", "diagnosis"]],
                                "chartConfig": {
                                    "id": "chart-1",
                                    "type": "scatter" | "line" | "bar",
                                    "xAxisKey": "column key for X axis",
                                    "yAxisKeys": ["column key for Y axis 1", "column key for Y axis 2"],
                                    "title": "Chart title"
                                } (Optional: only if a chart is appropriate for the request)
                            }
                        }

                        If the user asks a general question, return a JSON object with:
                        {
                            "type": "text",
                            "content": "The answer text in Korean"
                        }

                        ALWAYS return valid JSON.`
                    },
                    { role: "user", content: userMsg.content }
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });

            const responseContent = completion.choices[0].message.content;
            if (responseContent) {
                const parsed = JSON.parse(responseContent);
                console.log("AI Response:", parsed);

                if (parsed.type === "data") {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: parsed.content,
                        type: "data",
                        data: parsed.data
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: parsed.content,
                        type: "text"
                    }]);
                }
            }
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `오류가 발생했습니다: ${error.message}`,
                type: "text"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-4 relative">
            {/* API Key 설정 버튼 */}
            <div className="absolute top-2 right-2 z-10">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 hover:opacity-100">
                            <Key className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Groq API Key</h4>
                            <p className="text-sm text-muted-foreground">
                                Enter your Groq API key to enable real AI analysis.
                            </p>
                            <Input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="gsk_..."
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* 채팅 영역 */}
            <ScrollArea className="flex-1 p-4 border rounded-lg bg-muted/5">
                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            )}

                            <div className={`max-w-[90%] space-y-2`}>
                                {/* 텍스트 말풍선 */}
                                <div className={`p-3 rounded-lg text-sm ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border shadow-sm"
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* 데이터 시각화 카드 (어시스턴트 전용) */}
                                {msg.type === "data" && msg.data && (
                                    <DataResultCard data={msg.data} />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* 로딩 인디케이터 */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-card border shadow-sm p-3 rounded-lg flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">데이터 분석 중...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* 입력 영역 */}
            <div className="p-4 bg-background">
                <div className="max-w-3xl mx-auto relative">
                    <div className="relative flex items-center w-full p-1 rounded-full bg-muted/20 border border-transparent focus-within:border-primary shadow-sm transition-colors">
                        <Input
                            placeholder="질문이나 분석 요청을 입력하세요"
                            className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-4 h-12 text-base"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-full mr-1 shrink-0"
                            onClick={handleSend}
                            disabled={isLoading || !prompt.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        AI가 자연어 질문을 이해하고 데이터베이스에서 적절한 결과를 추출합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * DataResultCard 서브 컴포넌트
 * 
 * AI 분석 결과를 테이블과 차트 탭으로 보여주는 카드 컴포넌트입니다.
 * 재사용 가능한 'PatientTable'과 'ChartBuilder' 컴포넌트를 활용합니다.
 */
function DataResultCard({ data }: { data: any }) {
    // AI가 제안한 컬럼 또는 기본 컬럼 사용
    const initialColumns = data.relevantColumns || ['id', 'name', 'age', 'weight', 'diagnosis'];
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(initialColumns);

    return (
        <Card className="w-full mt-2 overflow-hidden border-primary/20">
            <CardHeader className="bg-muted/30 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    {data.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue={data.chartConfig ? "chart" : "table"} className="w-full">
                    <div className="flex items-center justify-between p-2 border-b bg-background">
                        <TabsList className="h-8">
                            <TabsTrigger value="table" className="h-7 text-xs"><TableIcon className="w-3 h-3 mr-1" />테이블</TabsTrigger>
                            <TabsTrigger value="chart" className="h-7 text-xs" disabled={!data.chartConfig}>
                                <BarChart2 className="w-3 h-3 mr-1" />차트
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <Download className="w-3 h-3" /> CSV 저장
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="table" className="p-0 m-0">
                        <div className="h-[300px] overflow-hidden flex flex-col">
                            {/* PatientTable 컴포넌트 재사용 */}
                            <PatientTable
                                data={data.list || []}
                                columns={columnDefinitions}
                                initialSelectedColumns={visibleColumnKeys}
                                onSelectionChange={setVisibleColumnKeys}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="chart" className="p-4 m-0 h-[400px] bg-muted/5">
                        {data.chartConfig ? (
                            // ChartBuilder 컴포넌트 재사용 (AI가 제안한 설정으로 초기화)
                            <ChartBuilder
                                data={data.list || []}
                                columnDefinitions={columnDefinitions}
                                initialCharts={[data.chartConfig]}
                                mode="compact" // 채팅 인터페이스용 컴팩트 모드 적용
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p className="text-sm">차트 데이터가 없습니다.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
