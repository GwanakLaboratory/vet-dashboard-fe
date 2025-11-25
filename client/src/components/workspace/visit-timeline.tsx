import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileText, Activity, AlertCircle } from "lucide-react";

export function VisitTimeline() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">방문 캘린더</CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                    <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium">2024년 5월 21일 방문</div>
                        <div className="p-3 border rounded-md bg-muted/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">정기 검진</Badge>
                                <span className="text-xs text-muted-foreground">김철수 수의사</span>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> 검사 3건</span>
                                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> 문서 1건</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline View */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg">방문 타임라인</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-[200px] shrink-0 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold">24.05.{20 - i}</span>
                                        <Badge variant={i === 1 ? "default" : "secondary"}>
                                            {i === 1 ? "최근" : "완료"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium mb-1">피부염 치료</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        <Badge variant="outline" className="text-[10px] px-1">ALT ↑</Badge>
                                        <Badge variant="outline" className="text-[10px] px-1">소견서</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* Selected Visit Detail Preview */}
                    <div className="mt-6 border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" /> 주요 이상 소견 (24.05.19)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            ALT 수치가 지난 방문 대비 15% 상승했습니다. 식이 알러지 반응이 의심되며, 처방 사료 변경을 권장했습니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
