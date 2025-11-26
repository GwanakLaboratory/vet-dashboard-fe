import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    BarChart2,
    Table as TableIcon,
    Filter,
    Download,
    Sparkles,
    PieChart,
    LineChart,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Search
} from "lucide-react";
import { ResearchAgentInterface } from "@/components/research/research-agent-interface";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart as ReLineChart,
    Line,
} from "recharts";
import { mockResearchData } from "@/lib/mock-dashboard-data";
import { DataTableFilter, FilterType } from "./data-table-filter";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type SortConfig = { key: keyof typeof mockResearchData.patients[0]; direction: 'asc' | 'desc' } | null;

interface ColumnConfig {
    key: keyof typeof mockResearchData.patients[0];
    label: string;
    type: FilterType;
    options?: string[];
    referenceRange?: { min: number; max: number };
}

export function ResearchDashboard() {
    const [chartType, setChartType] = useState("bar");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const { ageDistribution, diagnosisTrend, breedDistribution, patients } = mockResearchData;

    // Helper to get unique values for select options
    const getUniqueValues = (key: keyof typeof patients[0]) => {
        return Array.from(new Set(patients.map(p => p[key]))).sort();
    };

    // Column Definitions
    const columns: ColumnConfig[] = [
        { key: 'id', label: '환자 ID', type: 'text' },
        { key: 'name', label: '이름', type: 'text' },
        { key: 'breed', label: '품종', type: 'select', options: getUniqueValues('breed') as string[] },
        { key: 'age', label: '나이', type: 'number' },
        { key: 'gender', label: '성별', type: 'select', options: ['M', 'F'] },
        { key: 'weight', label: '체중', type: 'number' },
        { key: 'diagnosis', label: '주요 진단', type: 'select', options: getUniqueValues('diagnosis') as string[] },
        { key: 'ast', label: 'AST (U/L)', type: 'number', referenceRange: { min: 10, max: 50 } },
        { key: 'bun', label: 'BUN (mg/dL)', type: 'number', referenceRange: { min: 7, max: 27 } },
        { key: 'lastVisit', label: '최근 방문일', type: 'text' },
    ];

    // Calculate Min/Max for numeric columns for visualization
    const stats = useMemo(() => {
        const ages = patients.map(p => p.age);
        const weights = patients.map(p => Number(p.weight));
        return {
            age: { min: Math.min(...ages), max: Math.max(...ages) },
            weight: { min: Math.min(...weights), max: Math.max(...weights) }
        };
    }, [patients]);

    // Sorting and Filtering Logic
    const processedData = useMemo(() => {
        let data = [...patients];

        // Filtering
        Object.keys(filters).forEach((key) => {
            const filterValue = filters[key];
            if (filterValue === undefined || filterValue === null) return;

            data = data.filter((item) => {
                const itemValue = item[key as keyof typeof item];

                // Text Filter
                if (typeof filterValue === 'string') {
                    return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
                }

                // Number Filter (Range & Status)
                if (typeof filterValue === 'object') {
                    const numValue = Number(itemValue);

                    // Range Check
                    if (filterValue.min !== undefined && numValue < filterValue.min) return false;
                    if (filterValue.max !== undefined && numValue > filterValue.max) return false;

                    // Status Check (Low/Normal/High)
                    if (filterValue.status && filterValue.status.length > 0) {
                        const col = columns.find(c => c.key === key);
                        if (col?.referenceRange) {
                            let status = 'Normal';
                            if (numValue < col.referenceRange.min) status = 'Low';
                            else if (numValue > col.referenceRange.max) status = 'High';

                            if (!filterValue.status.includes(status)) return false;
                        }
                    }
                    return true;
                }

                // Select Filter (Array whitelist)
                if (Array.isArray(filterValue)) {
                    if (filterValue.length === 0) return true; // No selection means all
                    return filterValue.includes(String(itemValue));
                }

                return true;
            });
        });

        // Sorting
        if (sortConfig) {
            data.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Handle numeric sorting
                if (['weight', 'ast', 'bun'].includes(sortConfig.key)) {
                    return sortConfig.direction === 'asc'
                        ? Number(aValue) - Number(bValue)
                        : Number(bValue) - Number(aValue);
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [sortConfig, filters, patients]);

    const handleSort = (key: keyof typeof patients[0]) => {
        setSortConfig((current) => {
            if (current?.key === key && current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => {
            const next = { ...prev, [key]: value };
            if (value === undefined) {
                delete next[key];
            }
            return next;
        });
    };

    const renderHeader = (col: ColumnConfig) => (
        <TableHead key={col.key} className="min-w-[100px]">
            <div className="flex items-center gap-1 space-x-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-transparent"
                    onClick={() => handleSort(col.key)}
                >
                    <span>{col.label}</span>
                    {sortConfig?.key === col.key ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : <ArrowDown className="ml-2 h-3 w-3" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                    )}
                </Button>

                <DataTableFilter
                    title={col.label}
                    type={col.type}
                    options={col.options}
                    min={col.key === 'age' ? stats.age.min : col.key === 'weight' ? stats.weight.min : undefined}
                    max={col.key === 'age' ? stats.age.max : col.key === 'weight' ? stats.weight.max : undefined}
                    referenceRange={col.referenceRange}
                    currentFilter={filters[col.key]}
                    onFilterChange={(val) => handleFilterChange(col.key, val)}
                />
            </div>
        </TableHead>
    );

    const renderCell = (item: typeof patients[0], col: ColumnConfig) => {
        const value = item[col.key];

        // Medical Data Visualization (AST, BUN)
        if (col.referenceRange) {
            const numValue = Number(value);
            const { min, max } = col.referenceRange;
            let colorClass = "text-foreground";
            let statusIndicator = null;

            if (numValue < min) {
                colorClass = "text-blue-600 font-medium";
                statusIndicator = <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" title="Low" />;
            } else if (numValue > max) {
                colorClass = "text-red-600 font-medium";
                statusIndicator = <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" title="High" />;
            }

            return (
                <div className="flex items-center">
                    {statusIndicator}
                    <span className={colorClass}>{value}</span>
                </div>
            );
        }

        // Existing Visual Indicators (Age, Weight)
        if (col.key === 'age' || col.key === 'weight') {
            const numValue = Number(value);
            const min = col.key === 'age' ? stats.age.min : stats.weight.min;
            const max = col.key === 'age' ? stats.age.max : stats.weight.max;
            const percentage = ((numValue - min) / (max - min)) * 100;
            const colorClass = col.key === 'age' ? 'bg-blue-500' : 'bg-green-500';

            return (
                <div className="flex flex-col gap-1">
                    <span className="text-xs">{value}{col.key === 'age' ? '세' : 'kg'}</span>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorClass} rounded-full opacity-70`}
                            style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                    </div>
                </div>
            );
        }

        return <span>{value}</span>;
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Main Content Tabs */}
            <Tabs defaultValue="table" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <TabsList>
                        <TabsTrigger value="table" className="gap-2"><TableIcon className="w-4 h-4" /> 데이터 리스트</TabsTrigger>
                        <TabsTrigger value="chart" className="gap-2"><BarChart2 className="w-4 h-4" /> 차트 분석</TabsTrigger>
                        <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4 text-purple-500" /> AI 분석 도우미</TabsTrigger>
                    </TabsList>
                    <div className="text-xs text-muted-foreground">
                        Total: {processedData.length} records
                    </div>
                </div>

                {/* Tab 1: Data Table */}
                <TabsContent value="table" className="flex-1 overflow-hidden mt-0 border rounded-lg bg-card">
                    <div className="h-full overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                                <TableRow>
                                    {columns.map(col => renderHeader(col))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processedData.length > 0 ? (
                                    processedData.map((patient, i) => (
                                        <TableRow key={i}>
                                            {columns.map(col => (
                                                <TableCell key={col.key} className={col.key === 'id' ? 'font-medium' : ''}>
                                                    {renderCell(patient, col)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            검색 결과가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Tab 2: Charts */}
                <TabsContent value="chart" className="flex-1 overflow-hidden mt-0 border rounded-lg bg-card p-4">
                    <div className="flex flex-col h-full gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">데이터 시각화</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">차트 유형:</span>
                                <div className="flex bg-muted rounded-md p-1">
                                    <Button
                                        variant={chartType === "bar" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => setChartType("bar")}
                                    >
                                        <BarChart2 className="w-4 h-4 mr-1" /> 막대
                                    </Button>
                                    <Button
                                        variant={chartType === "pie" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => setChartType("pie")}
                                    >
                                        <PieChart className="w-4 h-4 mr-1" /> 원형
                                    </Button>
                                    <Button
                                        variant={chartType === "line" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => setChartType("line")}
                                    >
                                        <LineChart className="w-4 h-4 mr-1" /> 라인
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === "bar" ? (
                                    <BarChart data={breedDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#8884d8" name="환자 수" />
                                    </BarChart>
                                ) : chartType === "pie" ? (
                                    <RePieChart>
                                        <Pie
                                            data={ageDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {ageDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                ) : (
                                    <ReLineChart data={diagnosisTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="mmvd" stroke="#8884d8" name="MMVD" />
                                        <Line type="monotone" dataKey="patella" stroke="#82ca9d" name="슬개골 탈구" />
                                        <Line type="monotone" dataKey="ckd" stroke="#ff7300" name="신부전" />
                                    </ReLineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 3: AI Analysis */}
                <TabsContent value="ai" className="flex-1 overflow-hidden mt-0 border rounded-lg bg-card">
                    <ResearchAgentInterface />
                </TabsContent>
            </Tabs>
        </div>
    );
}
