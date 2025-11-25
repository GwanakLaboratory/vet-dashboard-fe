import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, FileText, ImageIcon, ClipboardList } from "lucide-react";

export function PatientOverview() {
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
                                <div className="text-2xl font-bold">초코</div>
                                <div className="text-sm text-muted-foreground">Poodle / 5살 / 여아 (중성화)</div>
                            </div>
                            <Badge>주의 환자</Badge>
                        </div>
                        <div className="mt-4 text-sm">
                            <p><span className="font-semibold">보호자:</span> 이영희 (010-1234-5678)</p>
                            <p><span className="font-semibold">주치의:</span> 김철수</p>
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
                                <span className="font-bold">4.2 kg <span className="text-green-500 text-xs">(-0.1)</span></span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>심박수</span>
                                <span className="font-bold">110 bpm</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>주요 질환</span>
                                <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">슬개골 탈구</Badge>
                                    <Badge variant="outline" className="text-xs">피부염</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
