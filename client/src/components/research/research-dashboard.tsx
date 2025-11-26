import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    BarChart2,
    Table as TableIcon,
    Download,
    Sparkles,
    PieChart,
    LineChart,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Users,
    Activity,
    AlertCircle,
    FileText
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
import { mockResearchData, columnDefinitions } from "@/lib/mock-dashboard-data";
import { DataTableFilter, FilterType } from "./data-table-filter";
import { ColumnSelector } from "./column-selector";
import { MedicalResultPopup } from "@/components/medical/medical-result-popup";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export function ResearchDashboard() {
    const [chartType, setChartType] = useState("bar");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Default selected columns: General group + key Chemistry
    const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([
        'id', 'name', 'breed', 'age', 'gender', 'weight', 'diagnosis', 'lastVisit',
        'ast', 'bun', 'creatinine'
    ]);

    const { ageDistribution, diagnosisTrend, breedDistribution, patients } = mockResearchData;

    // Filter columns based on selection
    const visibleColumns = useMemo(() => {
        return columnDefinitions.filter(col => selectedColumnKeys.includes(col.key));
    }, [selectedColumnKeys]);

    // Helper to get unique values for select options
    const getUniqueValues = (key: keyof typeof patients[0]) => {
        return Array.from(new Set(patients.map(p => p[key]))).sort();
    };

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
                        const col = columnDefinitions.find(c => c.key === key);
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
                const aValue = a[sortConfig.key as keyof typeof a];
                const bValue = b[sortConfig.key as keyof typeof b];

                // Handle numeric sorting
                const colDef = columnDefinitions.find(c => c.key === sortConfig.key);
                if (colDef?.type === 'number') {
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

    const handleSort = (key: string) => {
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

    const renderHeader = (col: typeof columnDefinitions[0]) => (
        <TableHead
            key={col.key}
            className={`min-w-[120px] bg-background ${col.key === 'id' || col.key === 'name' ? 'sticky left-0 z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]' : ''}`}
            style={col.key === 'name' ? { left: '80px' } : col.key === 'id' ? { left: 0 } : undefined}
        >
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
                    type={col.type as FilterType}
                    options={col.type === 'select' ? getUniqueValues(col.key as any) as string[] : undefined}
                    min={col.key === 'age' ? stats.age.min : col.key === 'weight' ? stats.weight.min : undefined}
                    max={col.key === 'age' ? stats.age.max : col.key === 'weight' ? stats.weight.max : undefined}
                    referenceRange={col.referenceRange}
                    currentFilter={filters[col.key]}
                    onFilterChange={(val) => handleFilterChange(col.key, val)}
                />
            </div>
        </TableHead>
    );

    const renderCell = (item: typeof patients[0], col: typeof columnDefinitions[0]) => {
        const value = item[col.key as keyof typeof item];

        // Medical Data Visualization (AST, BUN, etc.)
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
                <MedicalResultPopup columnKey={col.key} value={value} referenceRange={col.referenceRange}>
                    <div className="flex items-center cursor-pointer">
                        {statusIndicator}
                        <span className={`${colorClass} hover:underline`}>{value}</span>
                    </div>
                </MedicalResultPopup>
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
            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="overview">개요</TabsTrigger>
                        <TabsTrigger value="patients">환자 목록</TabsTrigger>
                        <TabsTrigger value="ai">AI 분석</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="flex-1 overflow-y-auto mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">총 환자 수</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{patients.length}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">평균 연령</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(patients.reduce((acc, curr) => acc + curr.age, 0) / patients.length).toFixed(1)}세
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">주요 질환</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">MMVD</div>
                                <p className="text-xs text-muted-foreground">전체 환자의 32%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">진행중인 연구</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>월별 진단 추세</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
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
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>환자 분포</CardTitle>
                                <CardDescription>연령별 / 품종별 분포</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height={350}>
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
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 2: Patient List (Data Table) */}
                <TabsContent value="patients" className="flex-1 overflow-hidden mt-0 border rounded-lg bg-card">
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">환자 데이터베이스</h3>
                            <div className="flex items-center gap-2">
                                <ColumnSelector
                                    columns={columnDefinitions}
                                    selectedColumns={selectedColumnKeys}
                                    onSelectionChange={setSelectedColumnKeys}
                                />
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    내보내기
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0 overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                    <TableRow>
                                        {visibleColumns.map(renderHeader)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {processedData.map((patient) => (
                                        <TableRow key={patient.id}>
                                            {visibleColumns.map((col) => (
                                                <TableCell
                                                    key={col.key}
                                                    className={`${col.key === 'id' || col.key === 'name' ? 'sticky left-0 z-10 bg-background/95 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]' : ''}`}
                                                    style={col.key === 'name' ? { left: '80px' } : col.key === 'id' ? { left: 0 } : undefined}
                                                >
                                                    {renderCell(patient, col)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
