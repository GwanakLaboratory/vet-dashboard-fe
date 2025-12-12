import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

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
    ReferenceArea,
    Brush,
} from "recharts";
import {
    Plus,
    Trash2,
    BarChart2,
    LineChart as LineChartIcon,
    ScatterChart as ScatterChartIcon,
    Settings2,
    Check,
    ChevronsUpDown,
    MoreHorizontal,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";



interface ChartBuilderProps {
    data: any[];
    columnDefinitions: any[];
    initialCharts?: ChartConfig[];
    mode?: 'dashboard' | 'compact';
}

export interface ChartConfig {
    id: string;
    type: 'scatter' | 'line' | 'bar';
    xAxisKey: string;
    yAxisKeys: string[];
    groupKey?: string;
    title: string;
    showGrid: boolean;
    showReferenceRange?: boolean;
    enableZoom?: boolean;
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
            groupKey: undefined,
            title: 'Chart 1',
            showGrid: true
        }
    ]);

    const [settingsOpen, setSettingsOpen] = useState<Record<string, boolean>>({});

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
                title: 'New Chart',
                showGrid: true
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
        <div className={`space-y-8 ${mode === 'dashboard' ? 'p-6' : 'p-0'}`}>
            {mode === 'dashboard' && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">데이터 시각화</h2>
                        <p className="text-muted-foreground text-sm">
                            축을 직접 클릭하여 데이터를 변경하세요.
                        </p>
                    </div>
                    <Button onClick={addChart} className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4" /> 차트 추가
                    </Button>
                </div>
            )}

            <div className={`grid gap-8 ${mode === 'dashboard' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {charts.map((chart) => (
                    <Card key={chart.id} className={`group relative flex flex-col overflow-visible border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 ${mode === 'compact' ? 'border-0 shadow-none' : ''}`}>

                        {/* Floating Toolbar (Top Right) */}
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex items-center bg-background/90 backdrop-blur-sm rounded-full border shadow-sm p-1">
                                <Button
                                    variant={chart.type === 'scatter' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => updateChart(chart.id, { type: 'scatter' })}
                                    title="산점도"
                                >
                                    <ScatterChartIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={chart.type === 'line' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => updateChart(chart.id, { type: 'line' })}
                                    title="선 그래프"
                                >
                                    <LineChartIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={chart.type === 'bar' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => updateChart(chart.id, { type: 'bar' })}
                                    title="막대 그래프"
                                >
                                    <BarChart2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Settings Popover */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-sm"
                                    onClick={() => setSettingsOpen(prev => ({ ...prev, [chart.id]: !prev[chart.id] }))}
                                >
                                    <Settings2 className="w-4 h-4" />
                                </Button>

                                {settingsOpen[chart.id] && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setSettingsOpen(prev => ({ ...prev, [chart.id]: false }))}
                                        />
                                        <div className="absolute right-0 top-12 z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                                            <div className="space-y-4">
                                                <h4 className="font-medium leading-none">차트 설정</h4>
                                                <div className="space-y-2">
                                                    <span className="text-xs font-medium leading-none">그룹화 (색상)</span>
                                                    <select
                                                        className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={chart.groupKey || "none"}
                                                        onChange={(e) => updateChart(chart.id, { groupKey: e.target.value === "none" ? undefined : e.target.value })}
                                                    >
                                                        <option value="none">없음</option>
                                                        {categoricalColumns.map(col => (
                                                            <option key={col.key} value={col.key}>{col.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium leading-none">그리드 표시</span>
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={chart.showGrid}
                                                        onChange={(e) => updateChart(chart.id, { showGrid: e.target.checked })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium leading-none">참고 범위 표시</span>
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={chart.showReferenceRange}
                                                        onChange={(e) => updateChart(chart.id, { showReferenceRange: e.target.checked })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-medium leading-none ${chart.type === 'scatter' ? 'text-gray-400' : ''}`}>
                                                        줌/팬 (Brush) {chart.type === 'scatter' && '(Line/Bar만 지원)'}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                                        checked={chart.enableZoom}
                                                        disabled={chart.type === 'scatter'}
                                                        onChange={(e) => updateChart(chart.id, { enableZoom: e.target.checked })}
                                                    />
                                                </div>
                                                {mode === 'dashboard' && (
                                                    <>
                                                        <div className="my-2 h-px bg-muted" />
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full h-8 text-xs"
                                                            onClick={() => removeChart(chart.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-2" /> 차트 삭제
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Y-Axis Selector (Top Left Overlay) */}
                        < div className="absolute top-4 left-4 z-10" >
                            <ChartMultiSelect
                                options={numericColumns.map(col => ({ label: col.label, value: col.key }))}
                                selected={chart.yAxisKeys || []}
                                onChange={(selected) => updateChart(chart.id, { yAxisKeys: selected })}
                                title="Y축 선택"
                                align="start"
                            />
                        </div>

                        <CardContent className={`flex-1 p-0 ${mode === 'compact' ? 'p-0' : ''}`}>
                            <div className="h-[350px] w-full pt-12 pb-12 pr-4 pl-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chart.type === 'scatter' ? (
                                        <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                            {chart.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
                                            <XAxis
                                                type="number"
                                                dataKey={chart.xAxisKey}
                                                name={getColumnLabel(chart.xAxisKey)}
                                                domain={['auto', 'auto']}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                type="number"
                                                domain={['auto', 'auto']}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={40}
                                            />
                                            <Tooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ fontSize: '12px', top: -10, right: 0 }} />
                                            {chart.groupKey ? (
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
                                            {chart.showReferenceRange && chart.yAxisKeys?.map((yKey, idx) => {
                                                const col = columnDefinitions.find(c => c.key === yKey);
                                                if (col?.referenceRange) {
                                                    return (
                                                        <ReferenceArea
                                                            key={yKey}
                                                            y1={col.referenceRange.min}
                                                            y2={col.referenceRange.max}
                                                            fill={COLORS[idx % COLORS.length]}
                                                            fillOpacity={0.15}
                                                            stroke="none"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </ScatterChart>
                                    ) : chart.type === 'line' ? (
                                        <LineChart data={data.sort((a, b) => Number(a[chart.xAxisKey]) - Number(b[chart.xAxisKey]))} margin={{ top: 0, right: 0, bottom: chart.enableZoom ? 40 : 0, left: 0 }}>
                                            {chart.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
                                            <XAxis
                                                dataKey={chart.xAxisKey}
                                                domain={['auto', 'auto']}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                domain={['auto', 'auto']}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={40}
                                            />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ fontSize: '12px', top: -10, right: 0 }} />
                                            {chart.yAxisKeys?.map((key, index) => (
                                                <Line
                                                    key={key}
                                                    type="monotone"
                                                    dataKey={key}
                                                    name={getColumnLabel(key)}
                                                    stroke={COLORS[index % COLORS.length]}
                                                    dot={false}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                            {chart.showReferenceRange && chart.yAxisKeys?.map((yKey, idx) => {
                                                const col = columnDefinitions.find(c => c.key === yKey);
                                                if (col?.referenceRange) {
                                                    return (
                                                        <ReferenceArea
                                                            key={yKey}
                                                            y1={col.referenceRange.min}
                                                            y2={col.referenceRange.max}
                                                            fill={COLORS[idx % COLORS.length]}
                                                            fillOpacity={0.15}
                                                            stroke="none"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                            {chart.enableZoom && (
                                                <Brush dataKey={chart.xAxisKey} height={30} stroke="#ff0000" data={data.sort((a, b) => Number(a[chart.xAxisKey]) - Number(b[chart.xAxisKey]))} />
                                            )}
                                        </LineChart>
                                    ) : (
                                        <BarChart data={data} margin={{ top: 0, right: 0, bottom: chart.enableZoom ? 40 : 0, left: 0 }}>
                                            {chart.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
                                            <XAxis
                                                dataKey={chart.xAxisKey}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={40}
                                            />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ fontSize: '12px', top: -10, right: 0 }} />
                                            {chart.yAxisKeys?.map((key, index) => (
                                                <Bar
                                                    key={key}
                                                    dataKey={key}
                                                    name={getColumnLabel(key)}
                                                    fill={COLORS[index % COLORS.length]}
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            ))}
                                            {chart.showReferenceRange && chart.yAxisKeys?.map((yKey, idx) => {
                                                const col = columnDefinitions.find(c => c.key === yKey);
                                                if (col?.referenceRange) {
                                                    return (
                                                        <ReferenceArea
                                                            key={yKey}
                                                            y1={col.referenceRange.min}
                                                            y2={col.referenceRange.max}
                                                            fill={COLORS[idx % COLORS.length]}
                                                            fillOpacity={0.15}
                                                            stroke="none"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                            {chart.enableZoom && (
                                                <Brush dataKey={chart.xAxisKey} height={30} stroke="#ff0000" data={data} />
                                            )}
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>

                            {/* X-Axis Selector (Bottom Center Overlay) */}
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
                                <select
                                    className="h-8 min-w-[120px] w-auto gap-2 rounded-full border shadow-sm bg-background/90 backdrop-blur-sm hover:bg-accent/50 transition-colors text-xs font-medium px-3 appearance-none text-center cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={chart.xAxisKey}
                                    onChange={(e) => updateChart(chart.id, { xAxisKey: e.target.value })}
                                >
                                    {numericColumns.map(col => (
                                        <option key={col.key} value={col.key}>{col.label}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                ))
                }
            </div >
        </div >
    );
}

function ChartMultiSelect({
    options,
    selected,
    onChange,
    title,
    align = "start"
}: {
    options: { label: string; value: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    title: string;
    align?: "start" | "center" | "end";
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-full border shadow-sm bg-background/90 backdrop-blur-sm hover:bg-accent/50 transition-colors text-xs font-medium px-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-muted-foreground">Y축:</span>
                <span className="truncate max-w-[120px]">
                    {selected.length === 0
                        ? "선택 안됨"
                        : selected.length === 1
                            ? options.find(o => o.value === selected[0])?.label
                            : `${selected.length}개 항목`}
                </span>
                <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className={`absolute top-full mt-2 z-50 w-[220px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 ${align === 'end' ? 'right-0' : 'left-0'}`}>
                        <div className="p-2">
                            <input
                                placeholder="항목 검색..."
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={(e) => e.stopPropagation()}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="py-6 text-center text-xs">결과 없음</div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                const newSelected = selected.includes(option.value)
                                                    ? selected.filter(s => s !== option.value)
                                                    : [...selected, option.value];
                                                onChange(newSelected);
                                            }}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
                                        >
                                            <div className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/50",
                                                selected.includes(option.value)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                <Check className={cn("h-3 w-3")} />
                                            </div>
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selected.length > 0 && (
                                <>
                                    <div className="-mx-1 my-1 h-px bg-muted" />
                                    <div className="space-y-1">
                                        <div
                                            onClick={() => onChange([])}
                                            className="relative flex cursor-default select-none items-center justify-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer text-muted-foreground hover:text-foreground"
                                        >
                                            선택 초기화
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
