import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewData {
  [sheetName: string]: {
    count: number;
    preview: any[];
  };
}

export default function DataManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Preview Mutation
  const previewMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      console.log('Sending preview request for file:', file.name, file.size);
      const response = await fetch("/api/preview-excel", {
        method: "POST",
        body: formData,
      });
      console.log('Preview response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Preview failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Preview failed: ${response.status} - ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Preview success:', data);
      setPreviewData(data);
      toast({
        title: "파일 분석 완료",
        description: "데이터 미리보기를 확인해주세요.",
      });
    },
    onError: (error) => {
      console.error('=== PREVIEW ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      toast({
        title: "분석 실패",
        description: "파일을 분석하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setSelectedFile(null);
    },
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      setUploadStatus("uploading");
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      setUploadStatus("success");
      setPreviewData(null);
      setSelectedFile(null);
      toast({
        title: "업로드 성공",
        description: "데이터가 성공적으로 저장되었습니다.",
      });
      queryClient.invalidateQueries();
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
      }, 3000);
    },
    onError: (error) => {
      setUploadStatus("error");
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
        previewMutation.mutate(file);
      } else {
        toast({
          title: "잘못된 파일 형식",
          description: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.",
          variant: "destructive",
        });
      }
      event.target.value = "";
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleDownload = async (dataType: string) => {
    try {
      const response = await fetch(`/api/download/${dataType}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataType}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "다운로드 완료",
        description: `${dataType} 데이터가 다운로드되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "데이터 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const dataTypes = [
    { name: "patients", label: "환자 정보", description: "기본 인적 사항", icon: FileSpreadsheet },
    { name: "visits", label: "방문 기록", description: "진료 및 방문 이력", icon: FileText },
    { name: "test-results", label: "검사 결과", description: "혈액/영상 검사 데이터", icon: FileSpreadsheet },
    { name: "questionnaires", label: "문진 데이터", description: "문진표 응답 내역", icon: FileText },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">데이터 관리</h1>
        <p className="text-muted-foreground">
          대량의 데이터를 Excel로 업로드하거나 시스템 데이터를 백업하세요.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="h-full border-dashed border-2 shadow-none hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                데이터 업로드
              </CardTitle>
              <CardDescription>
                새로운 데이터를 시스템에 추가합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!previewData && !uploadStatus.includes("uploading") && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <FileSpreadsheet className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Excel 파일을 이곳에 드래그하거나 선택하세요</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      .xlsx, .xls 형식 지원 (최대 10MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={previewMutation.isPending}
                  >
                    {previewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        파일 선택
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Preview Section */}
              {previewData && uploadStatus === "idle" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium">{selectedFile?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile!.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setPreviewData(null);
                      setSelectedFile(null);
                    }}>
                      취소
                    </Button>
                  </div>

                  <Tabs defaultValue={Object.keys(previewData)[0]} className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                      {Object.keys(previewData).map((sheet) => (
                        <TabsTrigger key={sheet} value={sheet} className="text-xs">
                          {sheet} ({previewData[sheet].count})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(previewData).map(([sheet, data]) => (
                      <TabsContent key={sheet} value={sheet} className="mt-4">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {data.preview.length > 0 && Object.keys(data.preview[0]).slice(0, 4).map((header) => (
                                  <TableHead key={header} className="text-xs">{header}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.preview.map((row, i) => (
                                <TableRow key={i}>
                                  {Object.values(row).slice(0, 4).map((cell: any, j) => (
                                    <TableCell key={j} className="text-xs py-2">
                                      {String(cell).slice(0, 20)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          ... 외 {Math.max(0, data.count - 5)}개 데이터
                        </p>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <Button className="w-full" onClick={handleConfirmUpload}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    데이터 저장하기
                  </Button>
                </div>
              )}

              {/* Upload Progress */}
              {uploadStatus !== "idle" && (
                <div className="space-y-4 py-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {uploadStatus === "uploading" ? "데이터 저장 중..." :
                        uploadStatus === "success" ? "저장 완료!" : "저장 실패"}
                    </span>
                    <span className="text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  {uploadStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <p>모든 데이터가 성공적으로 업데이트되었습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <div className="space-y-6">
          <Card className="h-full shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                데이터 내보내기
              </CardTitle>
              <CardDescription>
                시스템의 데이터를 Excel 파일로 다운로드합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {dataTypes.map((type) => (
                  <div
                    key={type.name}
                    className="group flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => handleDownload(type.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-md border group-hover:border-primary/30">
                        <type.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">참고 사항</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      다운로드되는 파일은 .xlsx 형식이며, 현재 시점의 최신 데이터를 포함합니다.
                      대용량 데이터의 경우 다운로드에 시간이 소요될 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
