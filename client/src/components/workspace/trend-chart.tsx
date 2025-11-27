import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, subMonths, isAfter, isBefore, parseISO } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { mockTestResults } from "@/lib/mock-dashboard-data";
import { cn } from "@/lib/utils";

export function TrendChart() {
    // 1. State for filters
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: subMonths(new Date(), 6),
        to: new Date(),
    });
    const [showReferenceLines, setShowReferenceLines] = useState(true);

    // 2. Extract unique categories and items
    const categories = useMemo(() => {
        const cats = new Set(mockTestResults.map(item => item.category));
        return ["All", ...Array.from(cats)];
    }, []);

    const filteredItems = useMemo(() => {
        if (selectedCategory === "All") return mockTestResults;
        return mockTestResults.filter(item => item.category === selectedCategory);
    }, [selectedCategory]);

    // 3. Prepare Chart Data
    // We need to transform the data structure. 
    // mockTestResults has `history` array for each item.
    // We want to plot multiple items on the same timeline if selected.
    // However, different items have different units/scales, so multi-axis might be needed or just one item at a time is better for detailed view.
    // Let's support selecting ONE primary item for detailed analysis, or multiple for comparison (normalized?).
    // For now, let's allow selecting ONE item to show its detailed trend with reference lines.

    const [primaryItemId, setPrimaryItemId] = useState<string>(mockTestResults[0]?.id || "");

    const primaryItem = mockTestResults.find(item => item.id === primaryItemId);

    const chartData = useMemo(() => {
        if (!primaryItem) return [];

        // Combine current result with history
        // Assuming history is ordered descending (recent first), we reverse it for the chart
        const historyData = [...primaryItem.history].reverse().map((h, index) => ({
            date: format(subMonths(new Date(), primaryItem.history.length - index), "yyyy-MM-dd"), // Mock dates for history if not provided
            value: h.value,
            min: primaryItem.min,
            max: primaryItem.max,
        }));

        // Add current result
        const currentData = {
            date: format(new Date(), "yyyy-MM-dd"),
            value: primaryItem.result,
            min: primaryItem.min,
            max: primaryItem.max,
        };

        return [...historyData, currentData];
    }, [primaryItem]);


    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>추적 검사 그래프 (Trend Analysis)</CardTitle>
                    <div className="flex items-center gap-2">
                        {/* Date Range Picker (Simplified) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={(range: any) => setDateRange(range)}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Controls Sidebar */}
                    <div className="w-full md:w-[250px] space-y-6">
                        <div className="space-y-2">
                            <Label>검사 분류 (Category)</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>검사 항목 (Item)</Label>
                            <ScrollArea className="h-[300px] border rounded-md p-2">
                                <div className="space-y-2">
                                    {filteredItems.map(item => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={primaryItemId === item.id}
                                                onCheckedChange={() => setPrimaryItemId(item.id)}
                                            />
                                            <label
                                                htmlFor={item.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {item.name} <span className="text-xs text-muted-foreground">({item.unit})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-ref"
                                checked={showReferenceLines}
                                onCheckedChange={(checked) => setShowReferenceLines(checked as boolean)}
                            />
                            <Label htmlFor="show-ref">정상 범위 표시 (Reference Range)</Label>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 min-h-[400px] border rounded-lg p-4 bg-slate-50/50">
                        {primaryItem ? (
                            <div className="h-full w-full">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        {primaryItem.name}
                                        <span className="text-sm font-normal text-muted-foreground">({primaryItem.category})</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Current: <span className="font-bold text-foreground">{primaryItem.result} {primaryItem.unit}</span>
                                        {' '} | Reference: {primaryItem.min} - {primaryItem.max} {primaryItem.unit}
                                    </p>
                                </div>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        {showReferenceLines && (
                                            <ReferenceLine y={primaryItem.max} label="Max" stroke="red" strokeDasharray="3 3" />
                                        )}
                                        {showReferenceLines && (
                                            <ReferenceLine y={primaryItem.min} label="Min" stroke="blue" strokeDasharray="3 3" />
                                        )}
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                            name={primaryItem.name}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Select an item to view the trend graph.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { ScrollArea } from "@/components/ui/scroll-area";
