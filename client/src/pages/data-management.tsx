import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function DataManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // Upload Excel file
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
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

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setUploadStatus("success");
      toast({
        title: "업로드 성공",
        description: "Excel 파일이 성공적으로 처리되었습니다.",
      });
      // Invalidate all queries to refresh data
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
        description: error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
      }, 3000);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        uploadMutation.mutate(file);
      } else {
        toast({
          title: "잘못된 파일 형식",
          description: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.",
          variant: "destructive",
        });
      }
      // Reset input
      event.target.value = "";
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
    {
      name: "patients",
      label: "환자 정보",
      description: "등록된 모든 환자의 기본 정보",
      icon: FileSpreadsheet,
    },
    {
      name: "visits",
      label: "방문 기록",
      description: "환자별 진료 방문 기록",
      icon: FileSpreadsheet,
    },
    {
      name: "test-results",
      label: "검사 결과",
      description: "모든 검사 결과 데이터",
      icon: FileSpreadsheet,
    },
    {
      name: "questionnaires",
      label: "문진 데이터",
      description: "문진 응답 데이터",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">데이터 관리</h1>
        <p className="text-sm text-muted-foreground">
          Excel 파일 업로드 및 데이터 다운로드
        </p>
      </div>

      {/* Instructions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">데이터 관리 가이드</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Excel 파일(.xlsx, .xls) 형식만 업로드 가능합니다</li>
                <li>• 업로드된 데이터는 자동으로 파싱되어 시스템에 저장됩니다</li>
                <li>• 기존 데이터와 중복되는 경우 새 데이터로 업데이트됩니다</li>
                <li>• 다운로드 시 현재 시스템의 모든 데이터가 Excel 형식으로 저장됩니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Excel 파일 업로드
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
            <FileSpreadsheet className="w-16 h-16 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Excel 파일을 업로드하세요</p>
              <p className="text-xs text-muted-foreground">
                지원 형식: .xlsx, .xls (최대 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === "uploading"}
              data-testid="button-select-file"
            >
              <Upload className="w-4 h-4 mr-2" />
              파일 선택
            </Button>
          </div>

          {/* Upload Progress */}
          {uploadStatus !== "idle" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadStatus === "uploading"
                    ? "업로드 중..."
                    : uploadStatus === "success"
                    ? "업로드 완료"
                    : "업로드 실패"}
                </span>
                {uploadStatus === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : uploadStatus === "error" ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {uploadProgress}%
                  </span>
                )}
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Expected Data Structure */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">예상 데이터 구조</p>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="text-xs">
                <p className="font-mono text-muted-foreground">고객정보 시트:</p>
                <p className="font-mono mt-1">동물번호, 동물명, 보호자명, 품종...</p>
              </div>
              <div className="text-xs">
                <p className="font-mono text-muted-foreground">방문기록 시트:</p>
                <p className="font-mono mt-1">동물번호, 방문일, 주증상...</p>
              </div>
              <div className="text-xs">
                <p className="font-mono text-muted-foreground">검사결과 시트:</p>
                <p className="font-mono mt-1">동물번호, 검사코드, 검사값...</p>
              </div>
              <div className="text-xs">
                <p className="font-mono text-muted-foreground">문진데이터 시트:</p>
                <p className="font-mono mt-1">카테고리, 문항, 응답...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            데이터 다운로드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {dataTypes.map((type) => (
              <div
                key={type.name}
                className="p-4 rounded-lg border border-border hover-elevate"
                data-testid={`download-card-${type.name}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <type.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">{type.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownload(type.name)}
                  data-testid={`button-download-${type.name}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">다운로드 정보</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Excel 파일은 .xlsx 형식으로 저장됩니다</li>
              <li>• 파일명에는 데이터 유형과 다운로드 날짜가 포함됩니다</li>
              <li>• 모든 필드가 포함된 완전한 데이터가 다운로드됩니다</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">데이터 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">환자 수</p>
              <p className="text-2xl font-bold font-mono">-</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">방문 기록</p>
              <p className="text-2xl font-bold font-mono">-</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">검사 결과</p>
              <p className="text-2xl font-bold font-mono">-</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">문진 응답</p>
              <p className="text-2xl font-bold font-mono">-</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * 데이터를 업로드하면 통계가 자동으로 업데이트됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
