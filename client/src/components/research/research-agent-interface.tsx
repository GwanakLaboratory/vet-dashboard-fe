import { useState } from "react";
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
    Sparkles
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Message {
    role: "user" | "assistant";
    content: string;
    type?: "text" | "data";
    data?: any;
}

export function ResearchAgentInterface() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "안녕하세요! 연구 데이터 분석 도우미입니다. 원하시는 데이터나 분석 내용을 말씀해주세요.\n예: '7살 이상 말티즈 중 심장질환이 있는 환자 리스트 보여줘'",
            type: "text"
        }
    ]);

    const handleSend = () => {
        if (!prompt.trim()) return;

        const userMsg: Message = { role: "user", content: prompt };
        setMessages(prev => [...prev, userMsg]);
        setPrompt("");
        setIsLoading(true);

        // Mock AI Response
        setTimeout(() => {
            const responseMsg: Message = {
                role: "assistant",
                content: `요청하신 '${userMsg.content}'에 대한 분석 결과입니다. 총 142마리의 환자가 검색되었습니다.`,
                type: "data",
                data: {
                    title: "7세 이상 말티즈 심장질환 환자군",
                    count: 142,
                    stats: {
                        avgAge: 9.2,
                        avgWeight: 3.4,
                        genderRatio: "M: 45%, F: 55%"
                    }
                }
            };
            setMessages(prev => [...prev, responseMsg]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4 border rounded-lg bg-muted/5">
                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            )}

                            <div className={`max-w-[80%] space-y-2`}>
                                {/* Text Bubble */}
                                <div className={`p-3 rounded-lg text-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border shadow-sm"
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Data View (Assistant Only) */}
                                {msg.type === "data" && msg.data && (
                                    <Card className="w-full mt-2 overflow-hidden border-primary/20">
                                        <CardHeader className="bg-muted/30 pb-2">
                                            <CardTitle className="text-sm flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                                {msg.data.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Tabs defaultValue="table" className="w-full">
                                                <div className="flex items-center justify-between p-2 border-b bg-background">
                                                    <TabsList className="h-8">
                                                        <TabsTrigger value="table" className="h-7 text-xs"><TableIcon className="w-3 h-3 mr-1" />테이블</TabsTrigger>
                                                        <TabsTrigger value="chart" className="h-7 text-xs"><BarChart2 className="w-3 h-3 mr-1" />차트</TabsTrigger>
                                                    </TabsList>
                                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                                        <Download className="w-3 h-3" /> CSV 저장
                                                    </Button>
                                                </div>

                                                <TabsContent value="table" className="p-0 m-0">
                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="text-xs">ID</TableHead>
                                                                    <TableHead className="text-xs">이름</TableHead>
                                                                    <TableHead className="text-xs">나이</TableHead>
                                                                    <TableHead className="text-xs">체중</TableHead>
                                                                    <TableHead className="text-xs">진단명</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <TableRow key={i}>
                                                                        <TableCell className="text-xs font-medium">P-{2024000 + i}</TableCell>
                                                                        <TableCell className="text-xs">초코{i}</TableCell>
                                                                        <TableCell className="text-xs">{8 + i}세</TableCell>
                                                                        <TableCell className="text-xs">3.{i}kg</TableCell>
                                                                        <TableCell className="text-xs">MMVD (B2)</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="chart" className="p-4 m-0 min-h-[200px] flex items-center justify-center bg-muted/5">
                                                    <div className="text-center text-muted-foreground">
                                                        <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                        <p className="text-sm">데이터 시각화 영역</p>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    ))}

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

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <div className="max-w-3xl mx-auto relative">
                    <Input
                        placeholder="질문이나 분석 요청을 입력하세요..."
                        className="pr-12 h-12 text-base shadow-sm"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10"
                        onClick={handleSend}
                        disabled={isLoading || !prompt.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                    AI가 자연어 질문을 이해하고 데이터베이스에서 적절한 결과를 추출합니다.
                </p>
            </div>
        </div>
    );
}
