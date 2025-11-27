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
    Cell,
} from "recharts";
import { Plus, Save, Trash2, BarChart2, LineChart as LineChartIcon, ScatterChart as ScatterChartIcon } from "lucide-react";

interface ChartBuilderProps {
    data: any[];
    columnDefinitions: any[];
}

interface ChartConfig {
    id: string;
    type: 'scatter' | 'line' | 'bar';
    xAxisKey: string;
    yAxisKey: string;
    groupKey?: string;
    title: string;
}

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"
];

export function ChartBuilder({ data, columnDefinitions }: ChartBuilderProps) {
    const [charts, setCharts] = useState<ChartConfig[]>([
        {
            id: 'default-1',
            type: 'scatter',
            xAxisKey: 'age',
            yAxisKey: 'BC009', // Creatinine
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
                yAxisKey: 'weight',
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
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">차트 생성</h2>
                </div>
                <Button onClick={addChart} className="gap-2">
                    <Plus className="w-4 h-4" /> 차트 추가
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {charts.map((chart) => (
                    <Card key={chart.id} className="flex flex-col">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium">
                                    {chart.title}
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => removeChart(chart.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                            <CardDescription className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">Chart Type</span>
                                        <div className="flex gap-1">
                                            <Button
                                                variant={chart.type === 'scatter' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'scatter' })}
                                            >
                                                <ScatterChartIcon className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant={chart.type === 'line' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'line' })}
                                            >
                                                <LineChartIcon className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant={chart.type === 'bar' ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateChart(chart.id, { type: 'bar' })}
                                            >
                                                <BarChart2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">Group By</span>
                                        <Select
                                            value={chart.groupKey || "none"}
                                            onValueChange={(val) => updateChart(chart.id, { groupKey: val === "none" ? undefined : val })}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {categoricalColumns.map(col => (
                                                    <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium">X-Axis</span>
                                        <Select
                                            value={chart.xAxisKey}
                                            onValueChange={(val) => updateChart(chart.id, { xAxisKey: val })}
                                        >
                                            <SelectTrigger className="h-8">
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
                                        <span className="text-xs font-medium">Y-Axis</span>
                                        <Select
                                            value={chart.yAxisKey}
                                            onValueChange={(val) => updateChart(chart.id, { yAxisKey: val })}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {numericColumns.map(col => (
                                                    <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                {chart.type === 'scatter' ? (
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid />
                                        <XAxis
                                            type="number"
                                            dataKey={chart.xAxisKey}
                                            name={getColumnLabel(chart.xAxisKey)}
                                            label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey={chart.yAxisKey}
                                            name={getColumnLabel(chart.yAxisKey)}
                                            label={{ value: getColumnLabel(chart.yAxisKey), angle: -90, position: 'left' }}
                                        />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Legend />
                                        {chart.groupKey ? (
                                            // Grouped Scatter
                                            Array.from(new Set(data.map(d => d[chart.groupKey!]))).map((group, index) => (
                                                <Scatter
                                                    key={String(group)}
                                                    name={String(group)}
                                                    data={data.filter(d => d[chart.groupKey!] === group)}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))
                                        ) : (
                                            <Scatter name="Patients" data={data} fill="#8884d8" />
                                        )}
                                    </ScatterChart>
                                ) : chart.type === 'line' ? (
                                    <LineChart data={data.sort((a, b) => Number(a[chart.xAxisKey]) - Number(b[chart.xAxisKey]))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={chart.xAxisKey} label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }} />
                                        <YAxis label={{ value: getColumnLabel(chart.yAxisKey), angle: -90, position: 'left' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey={chart.yAxisKey} stroke="#8884d8" dot={false} />
                                    </LineChart>
                                ) : (
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={chart.xAxisKey} label={{ value: getColumnLabel(chart.xAxisKey), position: 'bottom', offset: 0 }} />
                                        <YAxis label={{ value: getColumnLabel(chart.yAxisKey), angle: -90, position: 'left' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey={chart.yAxisKey} fill="#8884d8" />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
