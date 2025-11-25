import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockPatient, mockTestResults } from "@/lib/mock-dashboard-data";
import { Dog, Calendar, AlertTriangle, Activity, User, Weight, Clock } from "lucide-react";
import { format } from "date-fns";

export function OverviewTab() {
    const abnormalResults = mockTestResults.filter((r) => r.status !== "Normal");

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Left Column: Basic Info & Visit History (3 cols) */}
            <div className="col-span-3 space-y-4">
                {/* Basic Info Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Dog className="w-5 h-5 text-primary" />
                            기본 정보
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">이름/번호</p>
                                <p className="font-medium">{mockPatient.name} ({mockPatient.animalNumber})</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">보호자</p>
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span className="font-medium">{mockPatient.owner}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">품종</p>
                                <p className="font-medium">{mockPatient.breed}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">성별/나이</p>
                                <p className="font-medium">{mockPatient.gender} / {mockPatient.age}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">체중</p>
                                <div className="flex items-center gap-1">
                                    <Weight className="w-3 h-3" />
                                    <span className="font-medium">{mockPatient.weight}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Visit History */}
                <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5 text-primary" />
                            최근 방문 이력
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-4">
                                {mockPatient.visitHistory.map((visit, i) => (
                                    <div key={i} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                                        <div className="w-24 shrink-0 text-sm text-muted-foreground font-medium">
                                            {visit.date}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{visit.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Clinical Summary & Alerts (4 cols) */}
            <div className="col-span-4 space-y-4">
                {/* Clinical Summary */}
                <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-primary" />
                            임상 요약
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-1 text-muted-foreground">주호소 (Chief Complaint)</h4>
                            <p className="text-sm bg-background p-3 rounded-md border">{mockPatient.chiefComplaint}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-1 text-muted-foreground">추정 진단 (Diagnosis)</h4>
                            <p className="text-sm bg-background p-3 rounded-md border font-medium text-primary">
                                {mockPatient.diagnosis}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Abnormal Alerts */}
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            이상 검사 항목 ({abnormalResults.length})
                        </CardTitle>
                        <CardDescription>
                            최근 검사 결과 중 기준치를 벗어난 항목입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {abnormalResults.map((result) => (
                                <div key={result.id} className="flex items-center justify-between bg-background p-3 rounded-md border shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{result.name}</span>
                                        <span className="text-xs text-muted-foreground">{result.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`font-bold ${result.status === 'High' ? 'text-red-600' : 'text-blue-600'}`}>
                                                {result.result}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{result.unit}</span>
                                        </div>
                                        <Badge variant={result.status === 'High' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                                            {result.status === 'High' ? '높음' : '낮음'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
