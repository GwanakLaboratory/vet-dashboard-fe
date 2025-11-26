import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Filter, Minus } from "lucide-react";
import { mockTestResults } from "@/lib/mock-dashboard-data";
import { useState } from "react";

export function QuantitativeResults() {
    const [showOnlyAbnormal, setShowOnlyAbnormal] = useState(false);

    const filteredResults = showOnlyAbnormal
        ? mockTestResults.filter(item => item.status !== "Normal")
        : mockTestResults;

    return (
        <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">정량 검진 결과</CardTitle>
                <div className="flex gap-2">
                    <Button
                        variant={showOnlyAbnormal ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => setShowOnlyAbnormal(!showOnlyAbnormal)}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        {showOnlyAbnormal ? "전체 보기" : "기준치 벗어난 항목만"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                                <TableHead>항목명</TableHead>
                                <TableHead>최근값</TableHead>
                                <TableHead>기준 (Min-Max)</TableHead>
                                <TableHead>단위</TableHead>
                                <TableHead>이전값</TableHead>
                                <TableHead>추이</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResults.map((item) => {
                                const previousValue = item.history[0]?.value;
                                const trend = item.result > previousValue ? 'up' : item.result < previousValue ? 'down' : 'same';

                                return (
                                    <TableRow key={item.id} className="hover:bg-muted/50 cursor-pointer">
                                        <TableCell className="font-medium">
                                            {item.name}
                                            <span className="text-xs text-muted-foreground ml-1">({item.category})</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={item.status === "High" ? "text-red-500 font-bold" : item.status === "Low" ? "text-blue-500 font-bold" : ""}>
                                                {item.result}
                                            </span>
                                            {item.status !== "Normal" && (
                                                <Badge
                                                    variant="outline"
                                                    className={`ml-2 text-[10px] ${item.status === "High"
                                                            ? "border-red-200 text-red-500 bg-red-50"
                                                            : "border-blue-200 text-blue-500 bg-blue-50"
                                                        }`}
                                                >
                                                    {item.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{item.min} - {item.max}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                                        <TableCell>{previousValue ?? '-'}</TableCell>
                                        <TableCell>
                                            {trend === 'up' ? (
                                                <ArrowUp className={`w-4 h-4 ${item.status === "High" ? "text-red-500" : "text-muted-foreground"}`} />
                                            ) : trend === 'down' ? (
                                                <ArrowDown className={`w-4 h-4 ${item.status === "Low" ? "text-blue-500" : "text-muted-foreground"}`} />
                                            ) : (
                                                <Minus className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
