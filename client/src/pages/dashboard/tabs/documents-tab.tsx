import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockDocuments } from "@/lib/mock-dashboard-data";
import { FileText, Download, Eye, FileSearch, Tag } from "lucide-react";

export function DocumentsTab() {
    return (
        <div className="grid gap-4 md:grid-cols-12">
            {/* Left: Document List (5 cols) */}
            <div className="md:col-span-5 space-y-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            문서 목록
                        </CardTitle>
                        <CardDescription>
                            환자와 관련된 모든 문서 및 PDF 파일입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-3">
                                {mockDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-red-100 text-red-600 p-2 rounded shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm line-clamp-1">{doc.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] h-5">{doc.type}</Badge>
                                                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Right: OCR & Analysis (7 cols) */}
            <div className="md:col-span-7 space-y-4">
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileSearch className="w-4 h-4 text-primary" />
                                    문서 내용 분석 (OCR)
                                </CardTitle>
                                <CardDescription>
                                    선택된 문서: {mockDocuments[0].name}
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                                분석 완료
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <div className="grid grid-rows-2 h-full">
                            {/* Extracted Text Preview */}
                            <div className="p-4 bg-muted/20 overflow-auto h-[250px] text-sm font-mono leading-relaxed border-b">
                                <p className="text-muted-foreground mb-2">[Page 1 Extracted Text]</p>
                                <p>
                                    Patient: Choco (ID: 10000001) <br />
                                    Date: 2024-10-15 <br />
                                    <br />
                                    HEMATOLOGY REPORT <br />
                                    ---------------------------------------- <br />
                                    RBC: 5.2 M/uL (L) [Ref: 5.5-8.5] <br />
                                    HCT: 35.0 % (L) [Ref: 37.0-55.0] <br />
                                    WBC: 18.5 K/uL (H) [Ref: 6.0-17.0] <br />
                                    <br />
                                    CHEMISTRY REPORT <br />
                                    ---------------------------------------- <br />
                                    BUN: 32.0 mg/dL (H) [Ref: 7.0-27.0] <br />
                                    Creatinine: 1.8 mg/dL (N) [Ref: 0.5-1.8] <br />
                                    ...
                                </p>
                            </div>

                            {/* Auto-Tagging */}
                            <div className="p-4 bg-background">
                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    자동 태깅된 이상 항목
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                        RBC Low (5.2)
                                    </Badge>
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                        HCT Low (35.0)
                                    </Badge>
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                        WBC High (18.5)
                                    </Badge>
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                        BUN High (32.0)
                                    </Badge>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-md">
                                    * OCR 분석 결과, 총 4개의 이상 수치가 감지되어 자동으로 데이터베이스에 매핑되었습니다.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
