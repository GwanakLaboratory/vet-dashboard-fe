import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Activity, Users } from "lucide-react";

export function ComparisonBoard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">비교 분석 보드</h2>
                <Tabs defaultValue="charts" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="charts"><BarChart className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="stats"><Activity className="w-4 h-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">평균 생존 기간</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.2년</div>
                        <p className="text-xs text-muted-foreground">+1.1년 (대조군 대비)</p>
                    </CardContent>
                </Card>
                {/* Stat Card 2 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">재발률</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5%</div>
                        <p className="text-xs text-muted-foreground">-5.2% (대조군 대비)</p>
                    </CardContent>
                </Card>
                {/* Stat Card 3 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 대상 개체수</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">전체 데이터의 15%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart Area */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>주요 지표 추이 비교</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full bg-muted/10 rounded-lg flex items-center justify-center border border-dashed">
                        <p className="text-muted-foreground">차트 영역 (Recharts / Visx)</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
