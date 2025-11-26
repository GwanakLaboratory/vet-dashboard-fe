import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { mockDocuments } from "@/lib/mock-dashboard-data";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function DocumentViewer() {
    const [selectedDoc, setSelectedDoc] = useState(mockDocuments[0]);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [textContent, setTextContent] = useState<string>("");

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleDocumentSelect = async (doc: typeof mockDocuments[0]) => {
        setSelectedDoc(doc);
        setPageNumber(1);
        setScale(1.0);

        // Load text file content if it's a .txt file
        if (doc.name.endsWith('.txt')) {
            try {
                const response = await fetch(doc.path);
                const text = await response.text();
                setTextContent(text);
            } catch (error) {
                console.error('Error loading text file:', error);
                setTextContent('파일을 불러올 수 없습니다.');
            }
        } else {
            setTextContent("");
        }
    };

    const isPdf = selectedDoc?.name.endsWith('.pdf');

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
                            {mockDocuments.map((doc) => (
                                <TableRow
                                    key={doc.id}
                                    className={`cursor-pointer hover:bg-muted/50 ${selectedDoc?.id === doc.id ? 'bg-muted' : ''}`}
                                    onClick={() => handleDocumentSelect(doc)}
                                >
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{doc.name}</span>
                                            <span className="text-xs text-muted-foreground">{doc.date}</span>
                                        </div>
                                        <div className="mt-1">
                                            <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
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

            {/* PDF/Text Viewer */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" /> {selectedDoc?.name || "문서 선택"}
                    </CardTitle>
                    <div className="flex gap-2">
                        {isPdf && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isPdf ? (
                        <div className="flex flex-col items-center">
                            <div className="w-full h-[600px] overflow-auto border rounded-lg bg-gray-100 flex justify-center">
                                <Document
                                    file={selectedDoc.path}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<div className="flex items-center justify-center h-full">PDF 로딩 중...</div>}
                                    error={<div className="flex items-center justify-center h-full text-red-500">PDF를 불러올 수 없습니다.</div>}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                </Document>
                            </div>
                            {numPages > 0 && (
                                <div className="flex items-center gap-4 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                        disabled={pageNumber <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm">
                                        {pageNumber} / {numPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                        disabled={pageNumber >= numPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-[600px] overflow-auto border rounded-lg p-4 bg-white">
                            <pre className="text-sm whitespace-pre-wrap font-mono">{textContent || "파일을 선택하세요."}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
