import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileText, Activity, AlertCircle, CheckCircle2, FlaskConical, Image as ImageIcon } from "lucide-react";
import { mockVisitTimeline } from "@/lib/mock-dashboard-data";
import { format, parseISO, isSameDay } from "date-fns";

export function VisitTimeline() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Find visit data for the selected date
    const selectedVisit = date
        ? mockVisitTimeline.find((visit) => isSameDay(parseISO(visit.date), date))
        : undefined;

    // Dates with visits for calendar modifiers
    const visitDates = mockVisitTimeline.map((visit) => parseISO(visit.date));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">방문 캘린더</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow-sm"
                            modifiers={{
                                hasVisit: visitDates,
                            }}
                            modifiersStyles={{
                                hasVisit: {
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    color: "var(--primary)",
                                },
                            }}
                        />
                    </div>
                    <div className="mt-4 space-y-2 min-h-[100px]">
                        {selectedVisit ? (
                            <>
                                <div className="text-sm font-medium">
                                    {format(parseISO(selectedVisit.date), "yyyy년 M월 d일")} 방문
                                </div>
                                <div className="p-3 border rounded-md bg-muted/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{selectedVisit.title}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {selectedVisit.status === "completed" ? "진료 완료" : "예약됨"}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        {selectedVisit.hasLab && (
                                            <span className="flex items-center gap-1" title="검사 결과 있음">
                                                <FlaskConical className="w-3 h-3" /> 검사
                                            </span>
                                        )}
                                        {selectedVisit.hasImaging && (
                                            <span className="flex items-center gap-1" title="영상 자료 있음">
                                                <ImageIcon className="w-3 h-3" /> 영상
                                            </span>
                                        )}
                                        {selectedVisit.hasDocument && (
                                            <span className="flex items-center gap-1" title="문서 있음">
                                                <FileText className="w-3 h-3" /> 문서
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                선택한 날짜에 방문 기록이 없습니다.
                            </div>
                        )}
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
                            {mockVisitTimeline.map((visit, i) => (
                                <div
                                    key={i}
                                    className="w-[180px] shrink-0 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => setDate(parseISO(visit.date))}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-sm">
                                            {format(parseISO(visit.date), "yy.MM.dd")}
                                        </span>
                                        <Badge variant={i === 0 ? "default" : "secondary"} className="text-[10px]">
                                            {i === 0 ? "최근" : "완료"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium mb-2 truncate" title={visit.title}>
                                        {visit.title}
                                    </p>

                                    {/* Simplified Data Checks */}
                                    <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                                        <div className={`flex items-center gap-1 ${visit.hasLab ? "text-primary" : "opacity-20"}`}>
                                            <FlaskConical className="w-3.5 h-3.5" />
                                        </div>
                                        <div className={`flex items-center gap-1 ${visit.hasImaging ? "text-primary" : "opacity-20"}`}>
                                            <ImageIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className={`flex items-center gap-1 ${visit.hasDocument ? "text-primary" : "opacity-20"}`}>
                                            <FileText className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* Selected Visit Detail Preview */}
                    {selectedVisit && (
                        <div className="mt-6 border rounded-lg p-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                진료 메모 ({format(parseISO(selectedVisit.date), "yy.MM.dd")})
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedVisit.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
