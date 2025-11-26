import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Columns, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ColumnDefinition {
    key: string;
    label: string;
    group?: string;
}

interface ColumnSelectorProps {
    columns: ColumnDefinition[];
    selectedColumns: string[];
    onSelectionChange: (selected: string[]) => void;
}

export function ColumnSelector({ columns, selectedColumns, onSelectionChange }: ColumnSelectorProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Group columns
    const groupedColumns = useMemo(() => {
        const groups: Record<string, ColumnDefinition[]> = {};
        columns.forEach(col => {
            const group = col.group || "Other";
            if (!groups[group]) groups[group] = [];
            groups[group].push(col);
        });
        return groups;
    }, [columns]);

    // Filter columns based on search
    const filteredGroups = useMemo(() => {
        if (!search) return groupedColumns;
        const result: Record<string, ColumnDefinition[]> = {};
        Object.entries(groupedColumns).forEach(([group, cols]) => {
            const filtered = cols.filter(col =>
                col.label.toLowerCase().includes(search.toLowerCase()) ||
                col.key.toLowerCase().includes(search.toLowerCase())
            );
            if (filtered.length > 0) result[group] = filtered;
        });
        return result;
    }, [groupedColumns, search]);

    const handleGroupToggle = (group: string, checked: boolean) => {
        const groupCols = groupedColumns[group].map(c => c.key);
        let newSelected = [...selectedColumns];

        if (checked) {
            // Add all missing columns from group
            groupCols.forEach(key => {
                if (!newSelected.includes(key)) newSelected.push(key);
            });
        } else {
            // Remove all columns from group
            newSelected = newSelected.filter(key => !groupCols.includes(key));
        }
        onSelectionChange(newSelected);
    };

    const handleColumnToggle = (key: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedColumns, key]);
        } else {
            onSelectionChange(selectedColumns.filter(k => k !== key));
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                    <Columns className="mr-2 h-4 w-4" />
                    컬럼 설정
                    <Badge variant="secondary" className="ml-2 h-5 rounded-sm px-1 text-[10px] font-mono">
                        {selectedColumns.length}
                    </Badge>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
                <div className="p-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="컬럼 검색..."
                            className="pl-8 h-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="h-[400px] px-4">
                    <Accordion type="multiple" defaultValue={Object.keys(groupedColumns)} className="w-full">
                        {Object.entries(filteredGroups).map(([group, cols]) => {
                            const allSelected = cols.every(c => selectedColumns.includes(c.key));
                            const someSelected = cols.some(c => selectedColumns.includes(c.key));

                            return (
                                <AccordionItem value={group} key={group} className="border-b-0">
                                    <div className="flex items-center py-2">
                                        <Checkbox
                                            id={`group-${group}`}
                                            checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                            onCheckedChange={(checked) => handleGroupToggle(group, checked as boolean)}
                                            className="mr-2"
                                        />
                                        <AccordionTrigger className="py-0 hover:no-underline flex-1 text-sm font-medium">
                                            {group} ({cols.filter(c => selectedColumns.includes(c.key)).length}/{cols.length})
                                        </AccordionTrigger>
                                    </div>
                                    <AccordionContent className="pb-2 pl-6 space-y-1">
                                        {cols.map(col => (
                                            <div key={col.key} className="flex items-center space-x-2 py-1">
                                                <Checkbox
                                                    id={`col-${col.key}`}
                                                    checked={selectedColumns.includes(col.key)}
                                                    onCheckedChange={(checked) => handleColumnToggle(col.key, checked as boolean)}
                                                />
                                                <Label htmlFor={`col-${col.key}`} className="text-sm font-normal cursor-pointer flex-1">
                                                    {col.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </ScrollArea>
                <div className="p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => onSelectionChange([])}>
                        모두 해제
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onSelectionChange(columns.map(c => c.key))}>
                        모두 선택
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
