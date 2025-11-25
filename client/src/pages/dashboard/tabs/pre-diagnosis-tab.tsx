import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockQuestionnaire } from "@/lib/mock-dashboard-data";
import { MessageSquare, Clock, CheckCircle2, User } from "lucide-react";

export function PreDiagnosisTab() {
    return (
        <div className="grid gap-4 md:grid-cols-12">
            {/* Left: Symptom Normalization (4 cols) */}
            <div className="md:col-span-4 space-y-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            정규화된 증상 키워드
                        </CardTitle>
                        <CardDescription>
                            보호자 문진 텍스트에서 자동 추출된 핵심 증상입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {mockQuestionnaire.normalizedSymptoms.map((symptom, i) => (
                                <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                                    {symptom}
                                </Badge>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                            <p className="font-medium mb-2 text-muted-foreground">연관 질환 추천</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>심장 질환 (MMVD)</li>
                                <li>호흡기 감염</li>
                                <li>노령성 변화</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right: History Timeline (8 cols) */}
            <div className="md:col-span-8 space-y-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            문진 이력 타임라인
                        </CardTitle>
                        <CardDescription>
                            과거 방문 시 기록된 사전 문진 내용의 변화를 추적합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="relative border-l border-muted ml-3 space-y-8 pb-8">
                                {mockQuestionnaire.history.map((item, i) => (
                                    <div key={i} className="ml-6 relative">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />

                                        <div className="flex flex-col gap-1 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{item.date}</span>
                                                <Badge variant="outline" className="text-[10px]">정기 검진</Badge>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <User className="w-3 h-3" />
                                                <span>작성자: 주보호자 (어머니)</span>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-4 rounded-lg border text-sm leading-relaxed">
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
