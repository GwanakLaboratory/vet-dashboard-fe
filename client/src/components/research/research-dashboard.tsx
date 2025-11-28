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
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    AlertCircle,
} from "lucide-react";
import { ResearchAgentInterface } from "@/components/research/research-agent-interface";
import { mockResearchData, columnDefinitions } from "@/lib/mock-dashboard-data";
import { DataTableFilter, FilterType } from "./data-table-filter";
import { ColumnSelector } from "./column-selector";
import { MedicalResultPopup } from "@/components/medical/medical-result-popup";
import { ChartBuilder } from "./chart-builder";

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export function ResearchDashboard() {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Default selected columns: General group + key biomarkers
    const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([
        'id', 'name', 'breed', 'age', 'gender', 'weight', 'diagnosis', 'diseaseStage', 'lastVisit',
        'abnormalTestCount', 'criticalFlags',
        'CM001', 'BC009', 'BC007', 'BC001', 'BC008' // NT-proBNP, Creatinine, SDMA, ALT, BUN
    ]);

    const { patients } = mockResearchData;

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

                if (aValue === bValue) return 0;
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

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
                colorClass = "text-red-600 font-medium";
                statusIndicator = <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" title="High" />;
            }

            return (
                <MedicalResultPopup
                    columnKey={col.key}
                    value={value}
                    referenceRange={col.referenceRange}
                    description={(col as any).description}
                    testName={col.label}
                >
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

        // Critical Flags Indicator
        if (col.key === 'criticalFlags') {
            return value ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    위험
                </span>
            ) : (
                <span className="text-muted-foreground text-xs">-</span>
            );
        }

        // Abnormal Test Count
        if (col.key === 'abnormalTestCount') {
            const count = Number(value);
            let colorClass = 'text-green-600';
            if (count > 5) colorClass = 'text-red-600 font-bold';
            else if (count > 2) colorClass = 'text-orange-600 font-medium';
            else if (count > 0) colorClass = 'text-yellow-600';

            return <span className={colorClass}>{count}</span>;
        }

        // Disease Stage
        if (col.key === 'diseaseStage') {
            if (!value) return <span className="text-muted-foreground text-xs">-</span>;

            let colorClass = 'bg-blue-100 text-blue-800';
            if (String(value).includes('Stage 3') || String(value).includes('B2') || String(value).includes('Grade 3')) {
                colorClass = 'bg-red-100 text-red-800';
            } else if (String(value).includes('Stage 2') || String(value).includes('Grade 2')) {
                colorClass = 'bg-orange-100 text-orange-800';
            }

            return (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {value}
                </span>
            );
        }

        return <span>{value}</span>;
    };

    return (
        <div className="flex flex-col h-full space-y-12">
            {/* Section 1: Data Visualization (formerly Overview) */}
            <section id="section-visualization" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart2 className="w-5 h-5" />
                        데이터 시각화
                    </h2>
                </div>
                <ChartBuilder data={patients} columnDefinitions={columnDefinitions} />
            </section>

            {/* Section 2: Patient Database (formerly Patient List) */}
            <section id="section-database" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TableIcon className="w-5 h-5" />
                        환자 데이터베이스
                    </h2>
                </div>
                <div className="border rounded-lg bg-card flex flex-col h-[600px]">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold">전체 환자 목록</h3>
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
            </section>

            {/* Section 3: AI Analysis */}
            <section id="section-ai" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI 분석
                    </h2>
                </div>
                <div className="border rounded-lg bg-card overflow-hidden h-[600px]">
                    <ResearchAgentInterface />
                </div>
            </section>
        </div>
    );
}
