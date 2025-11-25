import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGroupStats } from "@/lib/mock-dashboard-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Info } from "lucide-react";

export function StatisticsTab() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Left: Distribution Chart */}
            <Card className="col-span-2 lg:col-span-1">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>검사 항목별 집단 분포</CardTitle>
                        <Select defaultValue="BUN">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="항목 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUN">BUN</SelectItem>
                                <SelectItem value="Creatinine">Creatinine</SelectItem>
                                <SelectItem value="ALT">ALT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <CardDescription>
                        동일 품종/연령대 집단 내에서의 분포 위치를 확인합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockGroupStats.distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                Range
                                                            </span>
                                                            <span className="font-bold text-muted-foreground">
                                                                {payload[0].payload.range}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                Count
                                                            </span>
                                                            <span className="font-bold">
                                                                {payload[0].value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                                    {mockGroupStats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                                    ))}
                                </Bar>
                                {/* Mocking "My Value" indicator */}
                                <ReferenceLine x="20-30" stroke="red" label={{ position: 'top', value: 'My Value', fill: 'red', fontSize: 12 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-sm" />
                            <span>내 위치 (구간)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-muted rounded-sm" />
                            <span>전체 분포</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right: Z-Score & Analysis */}
            <Card className="col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>통계 분석 상세</CardTitle>
                    <CardDescription>
                        평균 대비 편차(Z-Score) 및 상위 그룹 비교
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Z-Score Visualization */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Z-Score</span>
                            <span className="font-bold">{mockGroupStats.zScore}</span>
                        </div>
                        <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden">
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/20 z-10" /> {/* Center line */}
                            <div
                                className="absolute top-0 bottom-0 bg-primary transition-all duration-500"
                                style={{
                                    left: '50%',
                                    width: `${(mockGroupStats.zScore / 3) * 50}%`, // Mock calculation
                                    opacity: 0.8
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>-3σ</span>
                            <span>Avg (0)</span>
                            <span>+3σ</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            * Z-Score가 1.5로, 평균보다 다소 높은 편입니다. 상위 15%에 해당합니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">내 수치</p>
                            <p className="text-2xl font-bold">{mockGroupStats.myValue}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">집단 평균</p>
                            <p className="text-2xl font-bold text-muted-foreground">{mockGroupStats.averageValue}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3 items-start">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">A등급(건강) 그룹 비교</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                동일 연령대 건강 그룹의 평균 수치는 <strong>22.5</strong>입니다. 현재 수치는 건강 그룹 대비 <strong>+42%</strong> 높습니다.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
