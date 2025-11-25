import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Search, Filter } from "lucide-react";

export function SegmentBuilder() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>세그먼트 빌더</span>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Plus className="w-3.5 h-3.5" /> 새 필터
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-6">
                {/* Active Filters */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">활성 필터</h4>
                    <div className="p-3 border rounded-lg bg-muted/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">종 (Species)</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><X className="w-3 h-3" /></Button>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">Dog</Badge>
                            <Badge variant="outline" className="text-muted-foreground border-dashed">Cat</Badge>
                        </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-muted/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">나이 (Age)</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><X className="w-3 h-3" /></Button>
                        </div>
                        <div className="px-2">
                            <Slider defaultValue={[5, 12]} max={20} step={1} className="my-4" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>5살</span>
                                <span>12살</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-muted/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">진단명 (Diagnosis)</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><X className="w-3 h-3" /></Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input placeholder="진단명 검색..." className="h-8 pl-7 text-xs" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            <Badge>심부전 (Heart Failure)</Badge>
                        </div>
                    </div>
                </div>

                {/* Saved Segments */}
                <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">저장된 세그먼트</h4>
                    <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8 px-2">
                            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                            노령견 심장질환 그룹 (n=142)
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8 px-2">
                            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                            비만 고양이 관리군 (n=56)
                        </Button>
                    </div>
                </div>
            </CardContent>
            <div className="p-4 border-t mt-auto">
                <Button className="w-full">
                    세그먼트 생성 (128건)
                </Button>
            </div>
        </Card>
    );
}
