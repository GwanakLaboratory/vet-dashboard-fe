import { useMemo } from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { format, parseISO, isWithinInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestResult, Medication } from "@shared/schema";

interface IntegratedTimelineProps {
    testResults: TestResult[];
    medications: Medication[];
    examCode: string; // The specific test to correlate with
}

export function IntegratedTimeline({
    testResults,
    medications,
    examCode,
}: IntegratedTimelineProps) {
    // Filter results for the specific exam code and sort by date
    const filteredResults = useMemo(() => {
        return testResults
            .filter((r) => r.examCode === examCode && r.value !== null)
            .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
    }, [testResults, examCode]);

    // Create a combined dataset for the chart
    const chartData = useMemo(() => {
        if (filteredResults.length === 0) return [];

        // Get date range from test results
        const startDate = new Date(filteredResults[0].testDate);
        const endDate = new Date(filteredResults[filteredResults.length - 1].testDate);

        // Map test results to chart points
        const points = filteredResults.map((r) => ({
            date: r.testDate,
            value: r.value,
            type: "test",
            details: r,
        }));

        // Add medication active periods
        // For visualization, we'll add medication bars. 
        // Since Recharts is tricky with Gantt-like bars on ComposedChart, 
        // we will use a dummy value for the bar height (e.g., max test value / 2) 
        // and use custom tooltips to show medication info.

        // Find max value to scale medication bars
        const maxValue = Math.max(...filteredResults.map(r => r.value || 0));

        // We need to align medications to the same X-axis (dates)
        // This is a simplified approach: we map medications to the nearest test dates or add new points
        // For a cleaner view, let's just overlay medications as background bars or separate lines if possible.
        // A better approach for Recharts: Use ReferenceArea or custom shapes.
        // But for simplicity in this iteration, let's stick to plotting test values 
        // and listing active medications in the tooltip for each point.

        return points.map(point => {
            const pointDate = new Date(point.date);
            const activeMeds = medications.filter(med => {
                const start = new Date(med.startDate);
                const end = med.endDate ? new Date(med.endDate) : new Date(); // Assume ongoing if no end date
                return isWithinInterval(pointDate, { start, end });
            });

            return {
                ...point,
                activeMedications: activeMeds.map(m => m.name).join(", "),
                medicationCount: activeMeds.length, // Can be used for a secondary bar
            };
        });
    }, [filteredResults, medications]);

    if (filteredResults.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>통합 타임라인 ({examCode})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        데이터가 없습니다.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>통합 타임라인: {examCode} & 약물 처방</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => format(parseISO(date), "MM/dd")}
                            />
                            <YAxis yAxisId="left" label={{ value: '검사 수치', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: '투약 수', angle: 90, position: 'insideRight' }} />
                            <Tooltip
                                labelFormatter={(date) => format(parseISO(date as string), "yyyy년 MM월 dd일")}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background border rounded p-2 shadow-md text-sm">
                                                <p className="font-bold">{format(parseISO(label as string), "yyyy-MM-dd")}</p>
                                                <p className="text-primary">검사 결과: {data.value}</p>
                                                {data.activeMedications && (
                                                    <div className="mt-2">
                                                        <p className="font-semibold text-muted-foreground">투여 중인 약물:</p>
                                                        <p className="text-xs">{data.activeMedications}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="value"
                                stroke="#2563eb"
                                name="검사 결과"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="medicationCount"
                                barSize={20}
                                fill="#82ca9d"
                                opacity={0.5}
                                name="투약 중인 약물 수"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
