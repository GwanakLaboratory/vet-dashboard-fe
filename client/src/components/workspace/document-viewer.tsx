import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";
import { mockDocuments } from "@/lib/mock-dashboard-data";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
    selectedDocId?: string | null;
}

export function DocumentViewer({ selectedDocId }: DocumentViewerProps) {
    const [selectedDoc, setSelectedDoc] = useState(mockDocuments[0]);

    useEffect(() => {
        if (selectedDocId) {
            const doc = mockDocuments.find(d => d.id === selectedDocId);
            if (doc) {
                handleDocumentSelect(doc);
            }
        }
    }, [selectedDocId]);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [textContent, setTextContent] = useState<string>("");

    // Viewer States
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

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

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartPos({
            x: e.clientX,
            y: e.clientY,
            scrollLeft: containerRef.current.scrollLeft,
            scrollTop: containerRef.current.scrollTop,
        });
        containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        containerRef.current.scrollLeft = startPos.scrollLeft - dx;
        containerRef.current.scrollTop = startPos.scrollTop - dy;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

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
            <Card className={`lg:col-span-2 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between border-b bg-background">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" /> {selectedDoc?.name || "문서 선택"}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground ml-7">생성일: {selectedDoc?.date}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        {isPdf && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                                <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(3.0, s + 0.1))}>
                                    <ZoomIn className="w-4 h-4" />
                                </Button>

                                <Button variant="outline" size="sm" onClick={toggleFullscreen} title={isFullscreen ? "축소" : "전체화면"}>
                                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </Button>
                            </>
                        )}
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={`p-0 bg-gray-100 flex-1 relative overflow-hidden ${isFullscreen ? 'h-full' : 'h-[600px]'}`}>
                    {isPdf ? (
                        <div className="flex flex-col h-full">
                            <div
                                ref={containerRef}
                                className="flex-1 overflow-auto flex justify-center p-4 cursor-grab active:cursor-grabbing"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <Document
                                    file={selectedDoc.path}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<div className="flex items-center justify-center h-full">PDF 로딩 중...</div>}
                                    error={<div className="flex items-center justify-center h-full text-red-500">PDF를 불러올 수 없습니다.</div>}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        scale={scale}
                                        renderTextLayer={false} // Disable text layer to prevent selection interference with drag
                                        renderAnnotationLayer={true}
                                    />
                                </Document>
                            </div>

                            {/* Floating Page Controls */}
                            {numPages > 0 && (
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border shadow-lg rounded-full px-4 py-2 flex items-center gap-4 z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                        disabled={pageNumber <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-medium">
                                        {pageNumber} / {numPages}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                        disabled={pageNumber >= numPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full overflow-auto p-4 bg-white">
                            <pre className="text-sm whitespace-pre-wrap font-mono">{textContent || "파일을 선택하세요."}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
