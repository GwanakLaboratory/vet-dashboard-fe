import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileText, FlaskConical, Image as ImageIcon, ClipboardList, ExternalLink, FileCheck, Calendar as CalendarIcon } from "lucide-react";
import { mockVisitTimeline, type VisitTimelineItem } from "@/lib/mock-dashboard-data";
import { format, parseISO, isSameDay } from "date-fns";

interface VisitTimelineProps {
    onNavigateToDocument?: (docId: string) => void;
    onNavigateToLab?: () => void;
    onNavigateToImaging?: () => void;
}

export function VisitTimeline({ onNavigateToDocument, onNavigateToLab, onNavigateToImaging }: VisitTimelineProps) {
    const [selectedVisitDate, setSelectedVisitDate] = useState<Date | undefined>(parseISO(mockVisitTimeline[0].date));

    // Find visit data for the selected date
    const selectedVisit = selectedVisitDate
        ? mockVisitTimeline.find((visit) => isSameDay(parseISO(visit.date), selectedVisitDate))
        : undefined;

    // Dates with visits for calendar modifiers
    const visitDates = mockVisitTimeline.map((visit) => parseISO(visit.date));

    const getDataIcon = (type: string) => {
        switch (type) {
            case 'questionnaire': return <ClipboardList className="w-4 h-4" />;
            case 'lab': return <FlaskConical className="w-4 h-4" />;
            case 'imaging': return <ImageIcon className="w-4 h-4" />;
            case 'referral': return <ExternalLink className="w-4 h-4" />;
            case 'report': return <FileCheck className="w-4 h-4" />;
            case 'document': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getDataColor = (type: string) => {
        switch (type) {
            case 'questionnaire': return "text-orange-600 bg-orange-50 border-orange-200";
            case 'lab': return "text-blue-600 bg-blue-50 border-blue-200";
            case 'imaging': return "text-purple-600 bg-purple-50 border-purple-200";
            case 'referral': return "text-green-600 bg-green-50 border-green-200";
            case 'report': return "text-indigo-600 bg-indigo-50 border-indigo-200";
            case 'document': return "text-gray-600 bg-gray-50 border-gray-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const handleDataClick = (item: VisitTimelineItem['dataAvailable'][0]) => {
        if (item.documentId) {
            onNavigateToDocument?.(item.documentId);
        } else if (item.type === 'lab') {
            onNavigateToLab?.();
        } else if (item.type === 'imaging') {
            onNavigateToImaging?.();
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">방문 기록</h2>
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
                                selected={selectedVisitDate}
                                onSelect={setSelectedVisitDate}
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
                                        <p className="text-xs text-muted-foreground">{selectedVisit.description}</p>
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
                                        className={`w-[200px] shrink-0 p-4 border rounded-lg cursor-pointer transition-colors ${selectedVisit?.date === visit.date ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                                            }`}
                                        onClick={() => setSelectedVisitDate(parseISO(visit.date))}
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
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                            {visit.description}
                                        </p>

                                        {/* Data count badges */}
                                        <div className="flex flex-wrap gap-1">
                                            {visit.dataAvailable.map((data, idx) => (
                                                <Badge key={idx} variant="outline" className="text-[9px] px-1 py-0">
                                                    {data.type === 'questionnaire' && '문진'}
                                                    {data.type === 'lab' && '검사'}
                                                    {data.type === 'imaging' && '영상'}
                                                    {data.type === 'referral' && '의뢰'}
                                                    {data.type === 'report' && '결과'}
                                                    {data.type === 'document' && '문서'}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        {/* Selected Visit Detail - Data Timeline */}
                        {selectedVisit && (
                            <div className="mt-6 space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    데이터 타임라인 ({format(parseISO(selectedVisit.date), "yy.MM.dd")} 방문)
                                </h3>

                                <div className="space-y-2">
                                    {selectedVisit.dataAvailable.map((data, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-3 p-3 border rounded-md transition-colors ${data.documentId || data.type === 'lab' || data.type === 'imaging'
                                                    ? 'cursor-pointer hover:bg-muted/50'
                                                    : ''
                                                } ${getDataColor(data.type)}`}
                                            onClick={() => handleDataClick(data)}
                                        >
                                            <div className="shrink-0 p-2 bg-white rounded-md border">
                                                {getDataIcon(data.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{data.label}</span>
                                                    {(data.documentId || data.type === 'lab' || data.type === 'imaging') && (
                                                        <Badge variant="outline" className="text-[9px]">클릭하여 보기</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(parseISO(data.date), "yyyy년 M월 d일")}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
