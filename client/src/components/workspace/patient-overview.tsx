import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, FileText, ImageIcon, ClipboardList } from "lucide-react";
import { mockPatient } from "@/lib/mock-dashboard-data";
import { MedicalResultPopup } from "@/components/medical/medical-result-popup";

export function PatientOverview() {
    const { name, breed, age, gender, tags, owner, phone, primaryVet, weight, weightTrend, heartRate, majorDiseases } = mockPatient;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">기본 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-2xl font-bold">{name}</div>
                                <div className="text-sm text-muted-foreground">{breed} / {age} / {gender}</div>
                            </div>
                            <div className="flex gap-1">
                                {tags.map((tag, i) => (
                                    <Badge key={i}>{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 text-sm">
                            <p><span className="font-semibold">보호자:</span> {owner} ({phone})</p>
                            <p><span className="font-semibold">주치의:</span> {primaryVet}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">최근 상태 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>체중</span>
                                <span className="font-bold">
                                    {weight}
                                    <span className={weightTrend < 0 ? "text-green-500 text-xs ml-1" : "text-red-500 text-xs ml-1"}>
                                        ({weightTrend > 0 ? "+" : ""}{weightTrend})
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>심박수</span>
                                <span className="font-bold">{heartRate} bpm</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>주요 질환</span>
                                <div className="flex gap-1">
                                    {majorDiseases.map((disease, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">{disease}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card id="section-quantitative">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4" /> 정량 검진 결과 (최근)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Vitals */}
                        <MedicalResultPopup columnKey="hr" value={heartRate} referenceRange={{ min: 70, max: 160 }}>
                            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <div className="text-xs text-muted-foreground mb-1">심박수 (HR)</div>
                                <div className="text-lg font-bold">{heartRate} <span className="text-xs font-normal text-muted-foreground">bpm</span></div>
                            </div>
                        </MedicalResultPopup>

                        <MedicalResultPopup columnKey="rr" value={24} referenceRange={{ min: 10, max: 30 }}>
                            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <div className="text-xs text-muted-foreground mb-1">호흡수 (RR)</div>
                                <div className="text-lg font-bold">24 <span className="text-xs font-normal text-muted-foreground">bpm</span></div>
                            </div>
                        </MedicalResultPopup>

                        <MedicalResultPopup columnKey="temp" value={38.5} referenceRange={{ min: 37.5, max: 39.2 }}>
                            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <div className="text-xs text-muted-foreground mb-1">체온 (Temp)</div>
                                <div className="text-lg font-bold">38.5 <span className="text-xs font-normal text-muted-foreground">°C</span></div>
                            </div>
                        </MedicalResultPopup>

                        {/* Key Labs (Mock values for overview) */}
                        <MedicalResultPopup columnKey="bun" value={32} referenceRange={{ min: 7, max: 27 }}>
                            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-red-200 bg-red-50/50">
                                <div className="text-xs text-muted-foreground mb-1">BUN</div>
                                <div className="text-lg font-bold text-red-600">32 <span className="text-xs font-normal text-muted-foreground">mg/dL</span></div>
                            </div>
                        </MedicalResultPopup>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Navigation Chips */}
            <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => document.getElementById('section-quantitative')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Activity className="w-4 h-4" /> 정량 검진 결과
                </Button>
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => document.getElementById('section-pre-diagnosis')?.scrollIntoView({ behavior: 'smooth' })}>
                    <ClipboardList className="w-4 h-4" /> 문진 뷰어
                </Button>
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => document.getElementById('section-imaging')?.scrollIntoView({ behavior: 'smooth' })}>
                    <ImageIcon className="w-4 h-4" /> 영상 및 소견
                </Button>
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => document.getElementById('section-documents')?.scrollIntoView({ behavior: 'smooth' })}>
                    <FileText className="w-4 h-4" /> 문서(PDF)
                </Button>
            </div>
        </div>
    );
}
