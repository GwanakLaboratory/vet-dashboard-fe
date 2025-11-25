import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTestResults, TestItem } from "@/lib/mock-dashboard-data";
import { Search, Filter, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export function TestResultsTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAbnormalOnly, setShowAbnormalOnly] = useState(false);

    const filteredResults = mockTestResults.filter((item) => {
        // 1. Filter by Abnormal
        if (showAbnormalOnly && item.status === "Normal") return false;

        // 2. Search by Name or Synonyms
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            const matchName = item.name.toLowerCase().includes(lowerTerm);
            const matchSynonym = item.synonyms.some((s) => s.toLowerCase().includes(lowerTerm));
            const matchCategory = item.category.toLowerCase().includes(lowerTerm);
            return matchName || matchSynonym || matchCategory;
        }

        return true;
    });

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-lg">전체 검사 결과</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="검사명, 동의어(심장, 간...) 검색"
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-md border">
                            <Switch
                                id="abnormal-mode"
                                checked={showAbnormalOnly}
                                onCheckedChange={setShowAbnormalOnly}
                            />
                            <Label htmlFor="abnormal-mode" className="text-sm cursor-pointer flex items-center gap-2">
                                <Filter className="w-3 h-3" />
                                기준치 벗어난 항목만 보기
                            </Label>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Category</TableHead>
                                <TableHead className="w-[200px]">Test Item</TableHead>
                                <TableHead className="text-right">Result</TableHead>
                                <TableHead className="text-center w-[100px]">Status</TableHead>
                                <TableHead className="text-center w-[150px]">Reference (Min-Max)</TableHead>
                                <TableHead className="w-[150px]">Trend (6mo)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-muted-foreground text-xs">
                                            {item.category}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                                    {item.synonyms.join(", ")}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            <span
                                                className={
                                                    item.status === "High"
                                                        ? "text-red-600"
                                                        : item.status === "Low"
                                                            ? "text-blue-600"
                                                            : ""
                                                }
                                            >
                                                {item.result}
                                            </span>{" "}
                                            <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.status === "High" && (
                                                <Badge variant="destructive" className="h-5 text-[10px] px-1.5">
                                                    <ArrowUp className="w-3 h-3 mr-0.5" /> High
                                                </Badge>
                                            )}
                                            {item.status === "Low" && (
                                                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                    <ArrowDown className="w-3 h-3 mr-0.5" /> Low
                                                </Badge>
                                            )}
                                            {item.status === "Normal" && (
                                                <Badge variant="outline" className="h-5 text-[10px] px-1.5 text-muted-foreground">
                                                    <Minus className="w-3 h-3 mr-0.5" /> Normal
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            {item.min} - {item.max}
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-[30px] w-[120px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={item.history}>
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke={
                                                                item.status === "High"
                                                                    ? "#ef4444"
                                                                    : item.status === "Low"
                                                                        ? "#2563eb"
                                                                        : "#94a3b8"
                                                            }
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                        <YAxis domain={['auto', 'auto']} hide />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        검색 결과가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
