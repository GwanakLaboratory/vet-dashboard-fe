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
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
        from: subMonths(new Date(), 6),
        to: new Date(),
    });
    const [showReferenceLines, setShowReferenceLines] = useState(true);

    // Initialize selection with the first item if empty
    useMemo(() => {
        if (selectedItemIds.length === 0 && mockTestResults.length > 0) {
            setSelectedItemIds([mockTestResults[0].id]);
        }
    }, []);

    // 2. Extract unique categories and items
    const categories = useMemo(() => {
        const cats = new Set(mockTestResults.map(item => item.category));
        return ["All", ...Array.from(cats)];
    }, []);

    const filteredItems = useMemo(() => {
        if (selectedCategory === "All") return mockTestResults;
        return mockTestResults.filter(item => item.category === selectedCategory);
    }, [selectedCategory]);

    // Toggle Item Selection
    const toggleItem = (itemId: string) => {
        setSelectedItemIds(prev => {
            if (prev.includes(itemId)) {
                // Don't allow deselecting the last item
                if (prev.length === 1) return prev;
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // 3. Prepare Chart Data
    const chartData = useMemo(() => {
        if (selectedItemIds.length === 0) return [];

        const selectedItems = mockTestResults.filter(item => selectedItemIds.includes(item.id));

        // Collect all unique dates and sort them
        const allDates = new Set<string>();
        selectedItems.forEach(item => {
            item.history.forEach(h => allDates.add(h.date));
            allDates.add(format(new Date(), "yyyy-MM-dd")); // Add current date
        });

        const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Create data points
        let data = sortedDates.map(date => {
            const point: any = { date };
            selectedItems.forEach(item => {
                // Check history
                const historyEntry = item.history.find(h => h.date === date);
                if (historyEntry) {
                    point[item.id] = historyEntry.value;
                }
                // Check current result (assuming today's date)
                if (date === format(new Date(), "yyyy-MM-dd")) {
                    point[item.id] = item.result;
                }
            });
            return point;
        });

        // Filter by Date Range
        if (dateRange?.from && dateRange?.to) {
            data = data.filter(d => {
                const date = parseISO(d.date);
                // Compare dates (inclusive)
                return (isAfter(date, dateRange.from!) || date.getTime() === dateRange.from!.getTime()) &&
                    (isBefore(date, dateRange.to!) || date.getTime() === dateRange.to!.getTime());
            });
        }

        return data;
    }, [selectedItemIds, dateRange]);

    // Colors for lines
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#0891b2', '#be185d'];

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>추적 검사 그래프 (Trend Analysis)</CardTitle>
                    <div className="flex items-center gap-2">
                        {/* Date Range Picker */}
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
                                    onSelect={(range) => {
                                        if (range?.from) {
                                            setDateRange({ from: range.from, to: range.to || range.from });
                                        } else {
                                            setDateRange(undefined);
                                        }
                                    }}
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
                                                checked={selectedItemIds.includes(item.id)}
                                                onCheckedChange={() => toggleItem(item.id)}
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
                                disabled={selectedItemIds.length > 1}
                            />
                            <Label htmlFor="show-ref" className={selectedItemIds.length > 1 ? "text-muted-foreground" : ""}>
                                정상 범위 표시 (Single Item Only)
                            </Label>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 min-h-[400px] border rounded-lg p-4 bg-slate-50/50 flex flex-col justify-center">
                        {selectedItemIds.length > 0 ? (
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height={350} >
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        {/* Reference Lines - Only show if 1 item selected */}
                                        {showReferenceLines && selectedItemIds.length === 1 && (() => {
                                            const item = mockTestResults.find(i => i.id === selectedItemIds[0]);
                                            if (!item) return null;
                                            return (
                                                <>
                                                    <ReferenceLine y={item.max} label="Max" stroke="red" strokeDasharray="3 3" />
                                                    <ReferenceLine y={item.min} label="Min" stroke="blue" strokeDasharray="3 3" />
                                                </>
                                            );
                                        })()}

                                        {/* Render Lines for each selected item */}
                                        {selectedItemIds.map((id, idx) => {
                                            const item = mockTestResults.find(i => i.id === id);
                                            if (!item) return null;
                                            return (
                                                <Line
                                                    key={id}
                                                    type="monotone"
                                                    dataKey={id}
                                                    name={item.name}
                                                    stroke={colors[idx % colors.length]}
                                                    strokeWidth={2}
                                                    activeDot={{ r: 8 }}
                                                    connectNulls
                                                />
                                            );
                                        })}
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
