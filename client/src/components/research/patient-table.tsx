import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Download } from "lucide-react";
import { DataTableFilter, FilterType } from "./data-table-filter";
import { ColumnSelector } from "./column-selector";
import { MedicalResultPopup } from "@/components/medical/medical-result-popup";

interface PatientTableProps {
    data: any[];
    columns: any[];
    initialSelectedColumns?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
}

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export function PatientTable({ data: initialData, columns, initialSelectedColumns }: PatientTableProps) {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Default selected columns if not provided
    const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(
        initialSelectedColumns || columns.map(c => c.key)
    );

    // Filter columns based on selection
    const visibleColumns = useMemo(() => {
        return columns.filter(col => selectedColumnKeys.includes(col.key));
    }, [columns, selectedColumnKeys]);

    // Helper to get unique values for select options
    const getUniqueValues = (key: string) => {
        return Array.from(new Set(initialData.map(p => p[key]))).sort();
    };

    // Calculate Min/Max for numeric columns for visualization
    const stats = useMemo(() => {
        const ages = initialData.map(p => p.age);
        const weights = initialData.map(p => Number(p.weight));
        return {
            age: { min: Math.min(...ages), max: Math.max(...ages) },
            weight: { min: Math.min(...weights), max: Math.max(...weights) }
        };
    }, [initialData]);

    // Sorting and Filtering Logic
    const processedData = useMemo(() => {
        let data = [...initialData];

        // Filtering
        Object.keys(filters).forEach((key) => {
            const filterValue = filters[key];
            if (filterValue === undefined || filterValue === null) return;

            data = data.filter((item) => {
                const itemValue = item[key];

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
                const colDef = columns.find(c => c.key === sortConfig.key);
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
    }, [sortConfig, filters, initialData, columns]);

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

    const renderHeader = (col: any) => (
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
                    options={col.type === 'select' ? getUniqueValues(col.key) as string[] : undefined}
                    min={col.key === 'age' ? stats.age.min : col.key === 'weight' ? stats.weight.min : undefined}
                    max={col.key === 'age' ? stats.age.max : col.key === 'weight' ? stats.weight.max : undefined}
                    referenceRange={col.referenceRange}
                    currentFilter={filters[col.key]}
                    onFilterChange={(val) => handleFilterChange(col.key, val)}
                />
            </div>
        </TableHead>
    );

    const renderCell = (item: any, col: any) => {
        const value = item[col.key];

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
                <MedicalResultPopup
                    columnKey={col.key}
                    value={value}
                    referenceRange={col.referenceRange}
                    description={col.description}
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
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between bg-card">
                <h3 className="font-semibold text-sm">데이터 목록 ({processedData.length})</h3>
                <div className="flex items-center gap-2">
                    <ColumnSelector
                        columns={columns}
                        selectedColumns={selectedColumnKeys}
                        onSelectionChange={setSelectedColumnKeys}
                    />
                    <Button variant="outline" size="sm" className="h-8">
                        <Download className="mr-2 h-4 w-4" />
                        내보내기
                    </Button>
                </div>
            </div>
            <div className="flex-1 w-full min-h-0 overflow-auto bg-card">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                        <TableRow>
                            {visibleColumns.map(renderHeader)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedData.map((patient, idx) => (
                            <TableRow key={patient.id || idx}>
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
    );
}
