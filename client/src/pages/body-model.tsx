import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DogModel3D, bodyParts, type BodyPart } from "@/components/dog-model-3d";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  TrendingUp,
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
} from "recharts";
import type { TestResult, ExamMaster } from "@shared/schema";

export default function BodyModel() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  const { data: examMaster = [] } = useQuery<ExamMaster[]>({
    queryKey: ["/api/exam-master"],
  });

  // Get related test results for selected body part
  const getRelatedTests = (part: BodyPart | null) => {
    if (!part) return [];

    const relatedExams = examMaster.filter((exam) =>
      part.relatedTests.includes(exam.relatedBodyPart || "")
    );

    return relatedExams.map((exam) => {
      const results = testResults
        .filter((r) => r.examCode === exam.examCode)
        .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());

      const latestResult = results[0];
      const abnormalCount = results.filter((r) => r.status === "H" || r.status === "L").length;

      return {
        exam,
        latestResult,
        resultCount: results.length,
        abnormalCount,
        trendData: results
          .filter((r) => r.value !== null)
          .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
          .slice(-10)
          .map((r) => ({
            date: r.testDate,
            value: r.value,
          })),
      };
    });
  };

  const relatedTests = getRelatedTests(selectedPart);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">3D 신체 부위별 검사</h1>
        <p className="text-sm text-muted-foreground">
          강아지 3D 모델에서 신체 부위를 클릭하여 관련 검사 항목을 확인하세요
        </p>
      </div>

      {/* Instructions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">사용 방법</p>
              <p className="text-sm text-muted-foreground">
                • 마우스로 모델을 회전하고 확대/축소할 수 있습니다
              </p>
              <p className="text-sm text-muted-foreground">
                • 신체 부위 위로 마우스를 올리면 부위 이름이 표시됩니다
              </p>
              <p className="text-sm text-muted-foreground">
                • 부위를 클릭하면 관련 검사 항목과 결과를 오른쪽 패널에서 확인할 수 있습니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content: 3D Model + Info Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3D Model */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">3D 강아지 모델</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[600px]">
                <DogModel3D
                  onPartClick={setSelectedPart}
                  selectedPart={selectedPart}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">
                {selectedPart ? selectedPart.name : "신체 부위 정보"}
              </CardTitle>
              {selectedPart && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedPart(null)}
                  data-testid="button-close-panel"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {selectedPart ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">설명</p>
                    <p className="text-sm">{selectedPart.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      관련 검사 항목 ({relatedTests.length}개)
                    </p>
                    {relatedTests.length > 0 ? (
                      <div className="space-y-3">
                        {relatedTests.map(({ exam, latestResult, resultCount, abnormalCount, trendData }) => (
                          <div
                            key={exam.id}
                            className="p-3 rounded-lg border border-border"
                            data-testid={`exam-${exam.examCode}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{exam.examName}</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {exam.examCode}
                                </p>
                              </div>
                              {latestResult && (
                                <div className="flex-shrink-0 ml-2">
                                  {latestResult.status === "H" ? (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                  ) : latestResult.status === "L" ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              )}
                            </div>

                            {exam.description && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {exam.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {exam.examCategory}
                              </Badge>
                              <Badge variant="outline" className="text-xs font-mono">
                                {resultCount}회 검사
                              </Badge>
                              {abnormalCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  이상 {abnormalCount}회
                                </Badge>
                              )}
                            </div>

                            {latestResult && (
                              <div className="mt-2 pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-1">
                                  최근 결과 ({latestResult.testDate})
                                </p>
                                <p className="text-sm font-mono font-semibold">
                                  {latestResult.value !== null
                                    ? `${latestResult.value} ${exam.unit || ""}`
                                    : latestResult.valueText || "-"}
                                </p>
                                {exam.normalRangeMin !== null &&
                                  exam.normalRangeMax !== null && (
                                    <p className="text-xs text-muted-foreground">
                                      정상범위: {exam.normalRangeMin} -{" "}
                                      {exam.normalRangeMax} {exam.unit}
                                    </p>
                                  )}
                              </div>
                            )}

                            {/* Mini trend chart */}
                            {trendData.length > 1 && (
                              <div className="mt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">
                                    추세 (최근 10회)
                                  </p>
                                </div>
                                <ResponsiveContainer width="100%" height={100}>
                                  <LineChart data={trendData}>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="hsl(var(--border))"
                                    />
                                    <XAxis
                                      dataKey="date"
                                      tick={{ fontSize: 10 }}
                                      hide
                                    />
                                    <YAxis tick={{ fontSize: 10 }} width={30} />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                      }}
                                    />
                                    {exam.normalRangeMin !== null &&
                                      exam.normalRangeMax !== null && (
                                        <ReferenceArea
                                          y1={exam.normalRangeMin}
                                          y2={exam.normalRangeMax}
                                          fill="hsl(var(--chart-2))"
                                          fillOpacity={0.1}
                                        />
                                      )}
                                    <Line
                                      type="monotone"
                                      dataKey="value"
                                      stroke="hsl(var(--chart-1))"
                                      strokeWidth={2}
                                      dot={{ r: 2 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        이 부위와 관련된 검사 결과가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>신체 부위를 선택하면</p>
                  <p>관련 검사 정보가 표시됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Body Parts Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">신체 부위 참조</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {bodyParts.map((part) => (
              <Button
                key={part.name}
                variant={selectedPart?.name === part.name ? "default" : "outline"}
                className="justify-start h-auto py-3"
                onClick={() => setSelectedPart(part)}
                data-testid={`button-select-${part.name}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: part.color }}
                  ></div>
                  <div className="text-left flex-1">
                    <p className="font-medium">{part.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {part.description.split(" - ")[0]}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
