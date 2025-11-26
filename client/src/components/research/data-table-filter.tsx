import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type FilterType = 'text' | 'number' | 'select';

interface DataTableFilterProps {
    title: string;
    type: FilterType;
    options?: string[]; // For 'select' type
    min?: number; // Global min for 'number' type context
    max?: number; // Global max for 'number' type context
    referenceRange?: { min: number; max: number }; // For 'number' type with medical context
    currentFilter: any;
    onFilterChange: (value: any) => void;
}

export function DataTableFilter({
    title,
    type,
    options = [],
    min,
    max,
    referenceRange,
    currentFilter,
    onFilterChange
}: DataTableFilterProps) {
    // Local state for inputs before applying
    const [isOpen, setIsOpen] = useState(false);

    // Helper to check if filter is active
    const isActive = currentFilter !== undefined && currentFilter !== null && (
        (type === 'text' && currentFilter !== '') ||
        (type === 'number' && (currentFilter.min !== undefined || currentFilter.max !== undefined || (currentFilter.status && currentFilter.status.length > 0))) ||
        (type === 'select' && Array.isArray(currentFilter) && currentFilter.length > 0)
    );

    const handleClear = () => {
        onFilterChange(undefined);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-transparent">
                    <Filter className={`h-3 w-3 ${isActive ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    <span className="sr-only">Filter {title}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-3" align="start">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none text-sm text-muted-foreground">필터: {title}</h4>
                        {isActive && (
                            <Button variant="ghost" size="sm" className="h-6 px-1 text-xs text-muted-foreground hover:text-destructive" onClick={handleClear}>
                                초기화
                            </Button>
                        )}
                    </div>

                    {type === 'text' && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="검색어 입력..."
                                className="h-8 pl-8 text-xs"
                                value={currentFilter || ""}
                                onChange={(e) => onFilterChange(e.target.value)}
                            />
                        </div>
                    )}

                    {type === 'number' && (
                        <div className="space-y-3">
                            {/* Reference Range Status Filter */}
                            {referenceRange && (
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">상태 (정상범위: {referenceRange.min}~{referenceRange.max})</Label>
                                    <div className="flex flex-col gap-1">
                                        {['Low', 'Normal', 'High'].map((status) => {
                                            const isSelected = (currentFilter?.status || []).includes(status);
                                            return (
                                                <div key={status} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`status-${status}`}
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => {
                                                            const currentStatus = currentFilter?.status || [];
                                                            let nextStatus;
                                                            if (checked) {
                                                                nextStatus = [...currentStatus, status];
                                                            } else {
                                                                nextStatus = currentStatus.filter((s: string) => s !== status);
                                                            }
                                                            onFilterChange({ ...currentFilter, status: nextStatus.length > 0 ? nextStatus : undefined });
                                                        }}
                                                    />
                                                    <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                                                        {status === 'Low' && <span className="text-blue-500 font-medium">Low (&lt;{referenceRange.min})</span>}
                                                        {status === 'Normal' && <span className="text-green-600">Normal</span>}
                                                        {status === 'High' && <span className="text-red-500 font-medium">High (&gt;{referenceRange.max})</span>}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Separator />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="grid gap-1 flex-1">
                                    <Label htmlFor="min" className="text-xs text-muted-foreground">최소</Label>
                                    <Input
                                        id="min"
                                        type="number"
                                        className="h-8 text-xs"
                                        placeholder={min?.toString() || "Min"}
                                        value={currentFilter?.min ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value ? Number(e.target.value) : undefined;
                                            onFilterChange({ ...currentFilter, min: val });
                                        }}
                                    />
                                </div>
                                <span className="text-muted-foreground mt-4">-</span>
                                <div className="grid gap-1 flex-1">
                                    <Label htmlFor="max" className="text-xs text-muted-foreground">최대</Label>
                                    <Input
                                        id="max"
                                        type="number"
                                        className="h-8 text-xs"
                                        placeholder={max?.toString() || "Max"}
                                        value={currentFilter?.max ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value ? Number(e.target.value) : undefined;
                                            onFilterChange({ ...currentFilter, max: val });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {type === 'select' && (
                        <div className="space-y-2">
                            <div className="max-h-[200px] overflow-y-auto space-y-1">
                                {options.map((option) => {
                                    const isSelected = (currentFilter || []).includes(option);
                                    return (
                                        <div key={option} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`filter-${option}`}
                                                checked={isSelected}
                                                onCheckedChange={(checked) => {
                                                    const current = currentFilter || [];
                                                    let next;
                                                    if (checked) {
                                                        next = [...current, option];
                                                    } else {
                                                        next = current.filter((item: string) => item !== option);
                                                    }
                                                    onFilterChange(next.length > 0 ? next : undefined);
                                                }}
                                            />
                                            <Label htmlFor={`filter-${option}`} className="text-sm font-normal cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                            {options.length === 0 && <div className="text-xs text-muted-foreground">옵션이 없습니다.</div>}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
