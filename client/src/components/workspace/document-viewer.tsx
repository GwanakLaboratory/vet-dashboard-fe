import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

export function DocumentViewer() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">문서 목록</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>날짜/파일명</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3].map((i) => (
                                <TableRow key={i} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">혈액검사_결과지.pdf</span>
                                            <span className="text-xs text-muted-foreground">2024.05.{20 - i}</span>
                                        </div>
                                        <div className="mt-1">
                                            <Badge variant="outline" className="text-[10px]">Lab</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* PDF Viewer & OCR */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" /> 혈액검사_결과지.pdf
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">OCR 텍스트</Button>
                        <Button variant="outline" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-[500px] bg-muted/20 border rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">PDF 뷰어 영역</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
