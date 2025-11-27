import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, PawPrint, User, Phone, Stethoscope, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { mockPatient, mockVisitTimeline } from "@/lib/mock-dashboard-data";
import { format, parseISO } from "date-fns";

export function PatientOverview() {
    const {
        animalNumber,
        name,
        species,
        breed,
        age,
        birthDate,
        gender,
        tags,
        owner,
        phone,
        weight,
        weightTrend,
        visitHistory,
        registrationDate,
        chiefComplaint,
        diagnosis
    } = mockPatient;

    const totalVisits = visitHistory.length;
    const lastVisit = visitHistory[0];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">개체 Overview</h2>
            <div className="space-y-4">
                {/* Main Info Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Patient Identity */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <PawPrint className="w-5 h-5 text-primary" />
                                        <span className="text-sm text-muted-foreground">환자 정보</span>
                                    </div>
                                    <div className="text-3xl font-bold">{name}</div>
                                    <div className="text-sm text-muted-foreground mt-1">ID: {animalNumber}</div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {tags.map((tag, i) => (
                                        <Badge key={i} variant="destructive">{tag}</Badge>
                                    ))}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">보호자:</span>
                                        <span>{owner}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Species & Physical Info */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-3">기본 정보</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">종</span>
                                            <span className="font-semibold">{species}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">품종</span>
                                            <span className="font-semibold text-sm">{breed}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">성별</span>
                                            <span className="font-semibold text-sm">{gender}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">나이</span>
                                            <span className="font-semibold">{age}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">체중</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{weight}</span>
                                                {weightTrend !== 0 && (
                                                    <span className={`flex items-center text-xs ${weightTrend < 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                                        {weightTrend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                                                        {Math.abs(weightTrend)}kg
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Visit Statistics */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">검진 이력</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                                            <div className="text-xs text-muted-foreground mb-1">총 방문 횟수</div>
                                            <div className="text-2xl font-bold text-primary">{totalVisits}회</div>
                                        </div>

                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">최근 방문</div>
                                            <div className="font-semibold">{format(parseISO(lastVisit.date), "yyyy년 M월 d일")}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{lastVisit.reason}</div>
                                        </div>

                                        <div className="p-3 bg-muted/30 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">등록일</div>
                                            <div className="font-semibold">{format(parseISO(registrationDate), "yyyy년 M월 d일")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Clinical Summary Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            임상 요약
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">주 증상 (Chief Complaint)</div>
                                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                    <p className="text-sm">{chiefComplaint}</p>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">진단 소견 (Diagnosis)</div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm font-semibold text-blue-900">{diagnosis}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
