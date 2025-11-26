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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type SortConfig = { key: keyof typeof mockResearchData.patients[0]; direction: 'asc' | 'desc' } | null;

export function ResearchDashboard() {
    const [chartType, setChartType] = useState("bar");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const { ageDistribution, diagnosisTrend, breedDistribution, patients } = mockResearchData;

    // Sorting and Filtering Logic
    const processedData = useMemo(() => {
        let data = [...patients];

        // Filtering
        Object.keys(filters).forEach((key) => {
            const value = filters[key].toLowerCase();
            if (value) {
                data = data.filter((item) =>
                    String(item[key as keyof typeof item]).toLowerCase().includes(value)
                );
            }
        });

        // Sorting
        if (sortConfig) {
            data.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

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

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const renderHeader = (label: string, key: keyof typeof patients[0]) => (
        <TableHead className="min-w-[100px]">
            <div className="flex items-center gap-1 space-x-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-transparent"
                    onClick={() => handleSort(key)}
                >
                    <span>{label}</span>
                    {sortConfig?.key === key ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : <ArrowDown className="ml-2 h-3 w-3" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                    )}
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-transparent">
                            <Filter className={`h-3 w-3 ${filters[key] ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                            <span className="sr-only">Filter</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none text-xs text-muted-foreground">필터: {label}</h4>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="검색어 입력..."
                                    className="h-8 pl-8 text-xs"
                                    value={filters[key] || ""}
                                    onChange={(e) => handleFilterChange(key, e.target.value)}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </TableHead>
    );

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
                                    {renderHeader("환자 ID", "id")}
                                    {renderHeader("이름", "name")}
                                    {renderHeader("품종", "breed")}
                                    {renderHeader("나이", "age")}
                                    {renderHeader("성별", "gender")}
                                    {renderHeader("체중", "weight")}
                                    {renderHeader("주요 진단", "diagnosis")}
                                    {renderHeader("최근 방문일", "lastVisit")}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processedData.length > 0 ? (
                                    processedData.map((patient, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{patient.id}</TableCell>
                                            <TableCell>{patient.name}</TableCell>
                                            <TableCell>{patient.breed}</TableCell>
                                            <TableCell>{patient.age}세</TableCell>
                                            <TableCell>{patient.gender}</TableCell>
                                            <TableCell>{patient.weight}kg</TableCell>
                                            <TableCell>{patient.diagnosis}</TableCell>
                                            <TableCell>{patient.lastVisit}</TableCell>
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
                                    <ReLineChart data={diagnosisTrendData}>
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
