import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockQuestionnaire } from "@/lib/mock-dashboard-data";
import { format, parseISO } from "date-fns";

export function PreDiagnosisViewer() {
    const { history, selectedDetail } = mockQuestionnaire;

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
                            {history.map((item, i) => (
                                <div key={i} className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-semibold text-sm">{item.author}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(parseISO(item.date), "yy.MM.dd")}
                                        </span>
                                    </div>
                                    <p className="text-sm line-clamp-2 text-muted-foreground">
                                        {item.text}
                                    </p>
                                    <div className="mt-2 flex gap-1 flex-wrap">
                                        {item.tags.map((tag, j) => (
                                            <Badge key={j} variant="secondary" className="text-[10px]">{tag}</Badge>
                                        ))}
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
                    <CardTitle className="text-lg">
                        문진 상세 ({format(parseISO(selectedDetail.date), "yy.MM.dd")})
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">원본 내용</h4>
                        <div className="p-4 bg-muted/30 rounded-md text-sm leading-relaxed whitespace-pre-line">
                            {selectedDetail.originalText}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">요약 및 키워드</h4>
                        <div className="space-y-4">
                            <div className="p-3 border rounded-md">
                                <span className="text-sm font-semibold block mb-1">주호소 (Chief Complaint)</span>
                                <p className="text-sm">{selectedDetail.chiefComplaint}</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <span className="text-sm font-semibold block mb-1">특이사항</span>
                                <p className="text-sm">{selectedDetail.specialNote}</p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold block mb-2">추출 키워드</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDetail.keywords.map((keyword, i) => (
                                        <Badge key={i} variant={keyword.type === "outline" ? "outline" : "default"}>
                                            {keyword.text}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
