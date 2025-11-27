import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileText, Activity, AlertCircle, CheckCircle2, FlaskConical, Image as ImageIcon, ClipboardList, Stethoscope, ArrowRight } from "lucide-react";
import { mockVisitTimeline, mockDocuments } from "@/lib/mock-dashboard-data";
import { format, parseISO, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface VisitTimelineProps {
    onNavigateToDocument?: (docId: string) => void;
    onNavigateToQuestionnaire?: () => void;
    onNavigateToLab?: () => void;
    onNavigateToImaging?: () => void;
}

export function VisitTimeline({ onNavigateToDocument, onNavigateToQuestionnaire, onNavigateToLab, onNavigateToImaging }: VisitTimelineProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Find visit data for the selected date
    const selectedVisit = date
        ? mockVisitTimeline.find((visit) => isSameDay(parseISO(visit.date), date))
        : undefined;

    // Dates with visits for calendar modifiers
    const visitDates = mockVisitTimeline.map((visit) => parseISO(visit.date));

    const getDocIcon = (type: string) => {
        switch (type) {
            case '검진결과': return <FlaskConical className="w-4 h-4 text-blue-500" />;
            case '문진표': return <ClipboardList className="w-4 h-4 text-orange-500" />;
            case '문진결과': return <FileText className="w-4 h-4 text-green-500" />;
            case '소견서': return <Stethoscope className="w-4 h-4 text-purple-500" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

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
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        {selectedVisit.hasLab && (
                                            <Badge variant="secondary" className="font-normal">
                                                <FlaskConical className="w-3 h-3 mr-1" /> 검사
                                            </Badge>
                                        )}
                                        {selectedVisit.hasImaging && (
                                            <Badge variant="secondary" className="font-normal">
                                                <ImageIcon className="w-3 h-3 mr-1" /> 영상
                                            </Badge>
                                        )}
                                        {selectedVisit.hasDocument && (
                                            <Badge variant="secondary" className="font-normal">
                                                <FileText className="w-3 h-3 mr-1" /> 문서
                                            </Badge>
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

                    {/* Selected Visit Detail Preview - Navigation Hub */}
                    {selectedVisit && (
                        <div className="mt-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                진료 데이터 바로가기 ({format(parseISO(selectedVisit.date), "yy.MM.dd")})
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* 1. Quantitative Results */}
                                {selectedVisit.hasLab && (
                                    <div
                                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center h-32"
                                        onClick={onNavigateToLab}
                                    >
                                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                            <FlaskConical className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium">정량 검진 결과</span>
                                    </div>
                                )}

                                {/* 2. Imaging */}
                                {selectedVisit.hasImaging && (
                                    <div
                                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center h-32"
                                        onClick={onNavigateToImaging}
                                    >
                                        <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium">영상 및 소견</span>
                                    </div>
                                )}
                            </div>

                            {/* 3. Documents */}
                            {mockDocuments.filter(doc => isSameDay(parseISO(doc.date), parseISO(selectedVisit.date))).length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        관련 문서 (PDF)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {mockDocuments
                                            .filter(doc => isSameDay(parseISO(doc.date), parseISO(selectedVisit.date)))
                                            .map(doc => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center gap-2 p-3 border rounded-md bg-muted/20 text-sm hover:bg-muted/50 cursor-pointer transition-colors group"
                                                    onClick={() => onNavigateToDocument?.(doc.id)}
                                                >
                                                    <div className="shrink-0 p-1.5 bg-background rounded-md border">
                                                        {getDocIcon(doc.type)}
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="truncate font-medium group-hover:text-primary transition-colors">{doc.name}</span>
                                                        <span className="text-xs text-muted-foreground">{doc.type}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
