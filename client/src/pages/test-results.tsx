import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  TestTube,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts";
import type { TestResult, ExamMaster, Patient } from "@shared/schema";

export default function TestResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [patientFilter, setPatientFilter] = useState<string>("all"); // 환자 필터 추가
  
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedPatientForTrend, setSelectedPatientForTrend] = useState<string | null>(null); // 추세 보기용 환자 선택

  const [trendMode, setTrendMode] = useState("individual");

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  const { data: examMaster = [] } = useQuery<ExamMaster[]>({
    queryKey: ["/api/exam-master"],
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Get unique categories
  const categories = [...new Set(examMaster.map((e) => e.examCategory).filter(Boolean))];

  // Get patient name
  const getPatientName = (animalNumber: string) => {
    return patients.find((p) => p.animalNumber === animalNumber)?.name || animalNumber;
  };

  // Get exam info
  const getExamInfo = (examCode: string) => {
    return examMaster.find((e) => e.examCode === examCode);
  };

  // Filter test results
  const filteredResults = testResults.filter((result) => {
    const exam = getExamInfo(result.examCode);
    const patientName = getPatientName(result.animalNumber);

    const matchesSearch =
      result.examCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam?.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.animalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || exam?.examCategory === categoryFilter;

    const matchesStatus = statusFilter === "all" || result.status === statusFilter;

    const matchesPatient = patientFilter === "all" || result.animalNumber === patientFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPatient;
  });

  // Sort by test date descending
  const sortedResults = filteredResults.sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
  );

  // Get trend data for selected exam
  const getTrendData = (examCode: string) => {
    let filtered = testResults
      .filter((r) => r.examCode === examCode && r.value !== null);
    
    // 단일 강아지 모드일 경우 선택된 환자 데이터만 필터링
    if (trendMode === "individual" && selectedPatientForTrend) {
      filtered = filtered.filter(r => r.animalNumber === selectedPatientForTrend);
    }

    // 군집 모드 구현은 아직 군집 데이터가 없으므로 일단 전체(또는 필터링된) 데이터를 보여주거나,
    // 향후 군집 로직에 맞게 수정 필요. 현재는 individual 모드에 집중.

    return filtered
      .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
      .map((r) => ({
        date: r.testDate.split('T')[0], // 날짜 형식 간단하게
        value: r.value,
        status: r.status,
        patientName: getPatientName(r.animalNumber) // 툴팁용
      }));
  };

  const selectedExamInfo = selectedExam ? getExamInfo(selectedExam) : null;
  const trendData = selectedExam ? getTrendData(selectedExam) : [];

  // Statistics
  const totalTests = testResults.length;
  const highTests = testResults.filter((r) => r.status === "H").length;
  const lowTests = testResults.filter((r) => r.status === "L").length;
  const normalTests = testResults.filter((r) => r.status === "N").length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">검사 결과</h1>
        <p className="text-sm text-muted-foreground">
          환자별 검사 결과 및 추세 분석
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 검사</p>
                <p className="text-2xl font-bold font-mono">{totalTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">정상</p>
                <p className="text-2xl font-bold font-mono text-green-600">
                  {normalTests}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">높음</p>
                <p className="text-2xl font-bold font-mono text-red-600">{highTests}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">낮음</p>
                <p className="text-2xl font-bold font-mono text-yellow-600">
                  {lowTests}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="검사명, 코드, 환자명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-tests"
              />
            </div>
            
            {/* 환자 선택 필터 추가 */}
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <SelectValue placeholder="환자 선택" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 환자</SelectItem>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.animalNumber}>
                    {p.name} ({p.animalNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-category">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="N">정상</SelectItem>
                <SelectItem value="H">높음</SelectItem>
                <SelectItem value="L">낮음</SelectItem>
              </SelectContent>
            </Select>
            <Select value={trendMode} onValueChange={setTrendMode}>
              <SelectTrigger className="w-[150px]" data-testid="select-trend-mode">
                <SelectValue placeholder="추세 보기" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">개별 강아지</SelectItem>
                <SelectItem value="cluster">군집별</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>검사 결과 목록 ({sortedResults.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedResults.length > 0 ? (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상태</TableHead>
                    <TableHead>검사일</TableHead>
                    <TableHead>환자</TableHead>
                    <TableHead>검사명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">검사값</TableHead>
                    <TableHead>정상범위</TableHead>
                    <TableHead className="w-[100px]">추세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResults.map((result) => {
                    const exam = getExamInfo(result.examCode);
                    const patientName = getPatientName(result.animalNumber);

                    return (
                      <TableRow key={result.id} data-testid={`test-${result.id}`}>
                        <TableCell>
                          {result.status === "H" ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : result.status === "L" ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {result.testDate ? new Date(result.testDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{patientName}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {result.animalNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {exam?.examName || result.examCode}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {result.examCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {exam?.examCategory && (
                            <Badge variant="outline">{exam.examCategory}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {result.value !== null ? (
                            <span
                              className={
                                result.status === "H"
                                  ? "text-red-600"
                                  : result.status === "L"
                                  ? "text-yellow-600"
                                  : ""
                              }
                            >
                              {result.value} {exam?.unit || ""}
                            </span>
                          ) : (
                            result.valueText || "-"
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {exam && exam.normalRangeMin !== null &&
                          exam.normalRangeMax !== null ? (
                            <span>
                              {exam.normalRangeMin} - {exam.normalRangeMax}{" "}
                              {exam.unit}
                            </span>
                          ) : exam?.normalRangeText ? (
                            <span>{exam.normalRangeText}</span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {exam?.isQuantitative && result.value !== null && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedExam(result.examCode);
                                // 해당 결과의 환자를 선택
                                setSelectedPatientForTrend(result.animalNumber);
                              }}
                              data-testid={`button-trend-${result.examCode}`}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "검색 결과가 없습니다"
                : "검사 결과가 없습니다"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trend Dialog */}
      <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedExamInfo?.examName || selectedExam} 추세 분석 
              {trendMode === "individual" && selectedPatientForTrend && (
                <span className="ml-2 text-muted-foreground font-normal text-base">
                  - {getPatientName(selectedPatientForTrend)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {trendData.length > 0 ? (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  {selectedExamInfo?.normalRangeMin !== null &&
                    selectedExamInfo?.normalRangeMax !== null && (
                      <ReferenceArea
                        y1={selectedExamInfo.normalRangeMin}
                        y2={selectedExamInfo.normalRangeMax}
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.1}
                        label={{
                          value: "정상범위",
                          position: "insideTopRight",
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                      />
                    )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={`${selectedExamInfo?.examName || selectedExam}`}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>검사 설명:</strong>{" "}
                  {selectedExamInfo?.description || "설명 없음"}
                </p>
                {selectedExamInfo?.normalRangeMin !== null &&
                  selectedExamInfo?.normalRangeMax !== null && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>정상 범위:</strong> {selectedExamInfo.normalRangeMin} -{" "}
                      {selectedExamInfo.normalRangeMax} {selectedExamInfo.unit}
                    </p>
                  )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              추세 데이터가 없습니다
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
