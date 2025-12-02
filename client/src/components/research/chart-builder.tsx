import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
} from "recharts";
import { Plus, Trash2, BarChart2, LineChart as LineChartIcon, ScatterChart as ScatterChartIcon, Info } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChartBuilderProps {
    data: any[];
    columnDefinitions: any[];
    initialCharts?: ChartConfig[];
    mode?: 'dashboard' | 'compact'; // 'compact' mode for chat interface
}

export interface ChartConfig {
    id: string;
    type: 'scatter' | 'line' | 'bar';
    xAxisKey: string;
    yAxisKeys: string[]; // Changed to array for multiple Y-axes
    groupKey?: string;
    title: string;
}

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"
];

export function ChartBuilder({ data, columnDefinitions, initialCharts, mode = 'dashboard' }: ChartBuilderProps) {
    const [charts, setCharts] = useState<ChartConfig[]>(initialCharts || [
        {
            id: 'default-1',
            type: 'scatter',
            xAxisKey: 'age',
            yAxisKeys: ['BC009'], // Creatinine
            groupKey: 'diagnosis',
            title: 'Age vs Creatinine by Diagnosis'
        }
    ]);

    const numericColumns = useMemo(() =>
        columnDefinitions.filter(col => col.type === 'number'),
        [columnDefinitions]);

    const categoricalColumns = useMemo(() =>
        columnDefinitions.filter(col => col.type === 'select' || col.key === 'diagnosis' || col.key === 'diseaseStage' || col.key === 'gender'),
        [columnDefinitions]);

    const addChart = () => {
        setCharts([
            ...charts,
            {
                id: `chart-${Date.now()}`,
                type: 'scatter',
                xAxisKey: 'age',
                yAxisKeys: ['weight'],
                title: 'New Chart'
            }
        ]);
    };

    const removeChart = (id: string) => {
        setCharts(charts.filter(c => c.id !== id));
    };

    const updateChart = (id: string, updates: Partial<ChartConfig>) => {
        setCharts(charts.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const getColumnLabel = (key: string) => {
        return columnDefinitions.find(c => c.key === key)?.label || key;
    };

    return (
        <div className={`space-y-6 ${mode === 'dashboard' ? 'p-4' : 'p-0'}`}>
            {mode === 'dashboard' && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">차트 생성</h2>
                    </div>
                    <Button onClick={addChart} className="gap-2">
                        <Plus className="w-4 h-4" /> 차트 추가
                    </Button>
                </div>
            )}

            <div className={`grid gap-6 ${mode === 'dashboard' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {charts.map((chart) => (
                    <Card key={chart.id} className={`flex flex-col ${mode === 'compact' ? 'border-0 shadow-none' : ''}`}>
                        {mode === 'dashboard' && (
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium">
                                        {chart.title}
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" onClick={() => removeChart(chart.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                        )}

                        <CardContent className={`flex-1 ${mode === 'compact' ? 'p-0' : ''}`}>
                            {/* Controls */}
                            <div className="mb-4 space-y-4 p-4 bg-muted/10 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">차트 유형</span>
                                        <div className="flex gap-1">
                                            <Button
                                                variant={chart.type === 'scatter' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'scatter' })}
                                                title="산점도"
                                            >
                                                <ScatterChartIcon className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant={chart.type === 'line' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'line' })}
                                                title="선 그래프"
                                            >
                                                <LineChartIcon className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant={chart.type === 'bar' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'bar' })}
                                                title="막대 그래프"
                                            >
                                                <BarChart2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium">그룹화 기준</span>
                                            <TooltipProvider>
                                                <UITooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-3 h-3 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>데이터를 색상으로 구분하여 표시합니다.</p>
                                                    </TooltipContent>
                                                </UITooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={chart.groupKey || "none"}
                                            onValueChange={(val) => updateChart(chart.id, { groupKey: val === "none" ? undefined : val })}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="없음" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">없음</SelectItem>
                                                {categoricalColumns.map(col => (
                                                    <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">X축 (가로)</span>
                                        <Select
                                            value={chart.xAxisKey}
                                            onValueChange={(val) => updateChart(chart.id, { xAxisKey: val })}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {numericColumns.map(col => (
                                                    <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">Y축 (세로 - 다중 선택 가능)</span>
                                        <MultiSelect
                                            options={numericColumns.map(col => ({ label: col.label, value: col.key }))}
                                            selected={chart.yAxisKeys || []}
                                            onChange={(selected) => updateChart(chart.id, { yAxisKeys: selected })}
                                            placeholder="항목 선택..."
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Chart Rendering */}
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chart.type === 'scatter' ? (
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid />
                                            <XAxis
                                                type="number"
                                                dataKey={chart.xAxisKey}
                                                name={getColumnLabel(chart.xAxisKey)}
                                                label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }}
                                                domain={['auto', 'auto']}
                                            />
                                            <YAxis
                                                type="number"
                                                label={{ value: chart.yAxisKeys?.map(k => getColumnLabel(k)).join(', '), angle: -90, position: 'left' }}
                                                domain={['auto', 'auto']}
                                            />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                            <Legend />
                                            {chart.groupKey ? (
                                                // Grouped Scatter (Only supports first Y-axis key for now in grouped mode for simplicity)
                                                Array.from(new Set(data.map(d => d[chart.groupKey!]))).map((group, index) => (
                                                    <Scatter
                                                        key={String(group)}
                                                        name={String(group)}
                                                        data={data.filter(d => d[chart.groupKey!] === group)}
                                                        dataKey={chart.yAxisKeys?.[0]}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))
                                            ) : (
                                                // Multiple Y-axes Scatter
                                                <>
                                                    {chart.yAxisKeys?.map((key, index) => (
                                                        <Scatter
                                                            key={key}
                                                            name={getColumnLabel(key)}
                                                            data={data}
                                                            dataKey={key}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </ScatterChart>
                                    ) : chart.type === 'line' ? (
                                        <LineChart data={data.sort((a, b) => Number(a[chart.xAxisKey]) - Number(b[chart.xAxisKey]))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey={chart.xAxisKey}
                                                label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }}
                                                domain={['auto', 'auto']}
                                            />
                                            <YAxis
                                                label={{ value: chart.yAxisKeys?.map(k => getColumnLabel(k)).join(', '), angle: -90, position: 'left' }}
                                                domain={['auto', 'auto']}
                                            />
                                            <Tooltip />
                                            <Legend />
                                            {chart.yAxisKeys?.map((key, index) => (
                                                <Line
                                                    key={key}
                                                    type="monotone"
                                                    dataKey={key}
                                                    name={getColumnLabel(key)}
                                                    stroke={COLORS[index % COLORS.length]}
                                                    dot={false}
                                                />
                                            ))}
                                        </LineChart>
                                    ) : (
                                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey={chart.xAxisKey}
                                                label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }}
                                            />
                                            <YAxis
                                                label={{ value: chart.yAxisKeys?.map(k => getColumnLabel(k)).join(', '), angle: -90, position: 'left' }}
                                            />
                                            <Tooltip />
                                            <Legend />
                                            {chart.yAxisKeys?.map((key, index) => (
                                                <Bar
                                                    key={key}
                                                    dataKey={key}
                                                    name={getColumnLabel(key)}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
