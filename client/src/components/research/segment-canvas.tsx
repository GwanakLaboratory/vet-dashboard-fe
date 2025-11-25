import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SegmentCanvas() {
    return (
        <div className="h-full overflow-x-auto">
            <div className="flex gap-6 h-full min-w-max pb-4">
                {/* Column 1: Candidates */}
                <div className="w-[300px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">후보군 (Candidates)</h3>
                        <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex-1 bg-muted/10 rounded-lg p-2 space-y-3 border border-dashed">
                        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                                <span className="font-bold text-sm">Segment A</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="w-3 h-3" /></Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-muted-foreground mb-2">노령견 + 심장질환</p>
                                <div className="flex gap-1">
                                    <Badge variant="outline" className="text-[10px]">n=142</Badge>
                                    <Badge variant="outline" className="text-[10px]">High Risk</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                                <span className="font-bold text-sm">Segment B</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="w-3 h-3" /></Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-muted-foreground mb-2">비만 고양이 (7kg+)</p>
                                <div className="flex gap-1">
                                    <Badge variant="outline" className="text-[10px]">n=56</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Column 2: Analysis */}
                <div className="w-[300px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">분석 중 (Analyzing)</h3>
                        <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex-1 bg-muted/10 rounded-lg p-2 space-y-3 border border-dashed">
                        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-primary/50 bg-primary/5">
                            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                                <span className="font-bold text-sm">Target Group Alpha</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="w-3 h-3" /></Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-muted-foreground mb-2">신약 임상 대상군</p>
                                <div className="flex gap-1">
                                    <Badge variant="default" className="text-[10px]">Active</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Column 3: Published */}
                <div className="w-[300px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">발행됨 (Published)</h3>
                        <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex-1 bg-muted/10 rounded-lg p-2 space-y-3 border border-dashed">
                        {/* Empty State */}
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                            드래그하여 완료 처리
                        </div>
                    </div>
                </div>

                {/* Add Column */}
                <div className="w-[50px] pt-10">
                    <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-muted/80">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
