import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Filter } from "lucide-react";

export function QuantitativeResults() {
    return (
        <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">정량 검진 결과</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="w-3.5 h-3.5" /> 기준치 벗어난 항목만
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>항목명</TableHead>
                            <TableHead>최근값 (24.05.21)</TableHead>
                            <TableHead>기준 (Min-Max)</TableHead>
                            <TableHead>단위</TableHead>
                            <TableHead>이전값 (24.04.15)</TableHead>
                            <TableHead>추이</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="font-medium">ALT (GPT)</TableCell>
                            <TableCell>
                                <span className="text-red-500 font-bold">125</span>
                                <Badge variant="outline" className="ml-2 text-[10px] border-red-200 text-red-500 bg-red-50">High</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">10 - 100</TableCell>
                            <TableCell className="text-muted-foreground">U/L</TableCell>
                            <TableCell>98</TableCell>
                            <TableCell><ArrowUp className="w-4 h-4 text-red-500" /></TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="font-medium">Creatinine</TableCell>
                            <TableCell>1.1</TableCell>
                            <TableCell className="text-muted-foreground">0.5 - 1.8</TableCell>
                            <TableCell className="text-muted-foreground">mg/dL</TableCell>
                            <TableCell>1.0</TableCell>
                            <TableCell><span className="text-muted-foreground">-</span></TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="font-medium">BUN</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell className="text-muted-foreground">7 - 27</TableCell>
                            <TableCell className="text-muted-foreground">mg/dL</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell><ArrowUp className="w-4 h-4 text-muted-foreground" /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
