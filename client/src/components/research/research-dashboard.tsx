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

// Mock Data for Charts
const ageDistributionData = [
    { name: "Puppy (<2)", value: 150, fill: "#8884d8" },
    { name: "Adult (2-7)", value: 450, fill: "#82ca9d" },
    { name: "Senior (7+)", value: 300, fill: "#ffc658" },
    { name: "Geriatric (12+)", value: 120, fill: "#ff8042" },
];

const diagnosisTrendData = [
    { month: "1월", mmvd: 12, patella: 18, ckd: 5 },
    { month: "2월", mmvd: 15, patella: 20, ckd: 7 },
    { month: "3월", mmvd: 18, patella: 15, ckd: 8 },
    { month: "4월", mmvd: 22, patella: 25, ckd: 10 },
    { month: "5월", mmvd: 20, patella: 22, ckd: 9 },
    { month: "6월", mmvd: 25, patella: 28, ckd: 12 },
];

const breedData = [
    { name: "말티즈", count: 320 },
    { name: "푸들", count: 280 },
    { name: "포메라니안", count: 210 },
    { name: "치와와", count: 150 },
    { name: "시츄", count: 90 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Stable Mock Data for Table
const MOCK_PATIENTS = Array.from({ length: 50 }).map((_, i) => ({
    id: `P-${2024000 + i}`,
    name: `환자_${i + 1}`,
    breed: ['말티즈', '푸들', '포메라니안', '치와와', '시츄'][i % 5],
    age: 8 + (i % 5),
    gender: i % 2 === 0 ? 'M' : 'F',
    weight: (3 + (i * 0.1)).toFixed(1),
    diagnosis: ['MMVD (B2)', '슬개골 탈구 (3기)', '만성 신부전', '아토피 피부염', '건강함'][i % 5],
    lastVisit: `2024-11-${String((i % 30) + 1).padStart(2, '0')}`
}));

type SortConfig = { key: keyof typeof MOCK_PATIENTS[0]; direction: 'asc' | 'desc' } | null;

export function ResearchDashboard() {
    const [chartType, setChartType] = useState("bar");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Sorting and Filtering Logic
    const processedData = useMemo(() => {
        let data = [...MOCK_PATIENTS];

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
    }, [sortConfig, filters]);

    const handleSort = (key: keyof typeof MOCK_PATIENTS[0]) => {
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

    const renderHeader = (label: string, key: keyof typeof MOCK_PATIENTS[0]) => (
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
            {/* Filters & Controls (Global) */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-card">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">빠른 필터:</span>
                    </div>
                    <Select onValueChange={(val) => handleFilterChange('breed', val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="품종" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="말티즈">말티즈</SelectItem>
                            <SelectItem value="푸들">푸들</SelectItem>
                            <SelectItem value="포메라니안">포메라니안</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(val) => handleFilterChange('diagnosis', val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="진단명" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value="MMVD">MMVD</SelectItem>
                            <SelectItem value="슬개골">슬개골 탈구</SelectItem>
                            <SelectItem value="신부전">신부전 (CKD)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setFilters({})}
                    >
                        필터 초기화
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span className="sr-only sm:not-sr-only">내보내기</span>
                    </Button>
                </div>
            </div>

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
                                    <BarChart data={breedData}>
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
                                            data={ageDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {ageDistributionData.map((entry, index) => (
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
