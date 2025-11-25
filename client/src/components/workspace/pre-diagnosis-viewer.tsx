import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PreDiagnosisViewer() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Timeline List */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">문진 이력</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                        <div className="flex flex-col">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-semibold text-sm">보호자 작성</span>
                                        <span className="text-xs text-muted-foreground">24.05.{22 - i}</span>
                                    </div>
                                    <p className="text-sm line-clamp-2 text-muted-foreground">
                                        최근에 밥을 잘 안 먹고 기운이 없어 보여요. 산책도 가기 싫어합니다.
                                    </p>
                                    <div className="mt-2 flex gap-1">
                                        <Badge variant="secondary" className="text-[10px]">식욕부진</Badge>
                                        <Badge variant="secondary" className="text-[10px]">활력저하</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Detail View */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg">문진 상세 (24.05.21)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">원본 내용</h4>
                        <div className="p-4 bg-muted/30 rounded-md text-sm leading-relaxed">
                            "어제부터 사료를 거의 안 먹고 물만 조금 마셔요. 좋아하는 간식을 줘도 냄새만 맡고 안 먹네요.
                            그리고 평소보다 잠을 많이 자고 산책 나가자고 해도 현관에서 안 움직이려고 해요.
                            구토나 설사는 아직 없었습니다."
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">요약 및 키워드</h4>
                        <div className="space-y-4">
                            <div className="p-3 border rounded-md">
                                <span className="text-sm font-semibold block mb-1">주호소 (Chief Complaint)</span>
                                <p className="text-sm">식욕 부진, 활력 저하, 운동 불내성</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <span className="text-sm font-semibold block mb-1">특이사항</span>
                                <p className="text-sm">소화기 증상(구토/설사) 없음</p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold block mb-2">추출 키워드</span>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>식욕부진</Badge>
                                    <Badge>기력저하</Badge>
                                    <Badge variant="outline">구토없음</Badge>
                                    <Badge variant="outline">설사없음</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
