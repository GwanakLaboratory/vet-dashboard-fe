import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import {
  Dog,
  AlertTriangle,
  Calendar,
  Activity,
  TrendingUp,
  TestTube,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Patient, Visit, TestResult } from "@shared/schema";

export default function Home() {
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  // Calculate statistics
  const totalPatients = patients.length;
  const totalVisits = visits.length;
  const abnormalTests = testResults.filter(
    (r) => r.status === "H" || r.status === "L"
  ).length;
  const abnormalRate =
    testResults.length > 0
      ? ((abnormalTests / testResults.length) * 100).toFixed(1)
      : "0";

  // Top 5 abnormal tests
  const testAbnormalCounts = testResults.reduce((acc: Record<string, number>, result) => {
    if (result.status === "H" || result.status === "L") {
      acc[result.examCode] = (acc[result.examCode] || 0) + 1;
    }
    return acc;
  }, {});

  const top5AbnormalTests = Object.entries(testAbnormalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([examCode, count]) => ({
      name: examCode,
      count,
    }));

  // Breed distribution
  const breedCounts = patients.reduce((acc: Record<string, number>, patient) => {
    const breed = patient.breed || "미상";
    acc[breed] = (acc[breed] || 0) + 1;
    return acc;
  }, {});

  const breedData = Object.entries(breedCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value,
    }));

  // Visit frequency by month
  const visitsByMonth = visits.reduce((acc: Record<string, number>, visit) => {
    if (visit.visitDate) {
      const month = visit.visitDate.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const visitFrequencyData = Object.entries(visitsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month,
      count,
    }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--muted))"];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          전체 환자 건강 데이터 요약
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 환자 수"
          value={totalPatients}
          icon={Dog}
          description="등록된 반려동물"
          data-testid="stat-total-patients"
        />
        <StatsCard
          title="총 방문 횟수"
          value={totalVisits}
          icon={Calendar}
          description="누적 진료 기록"
          data-testid="stat-total-visits"
        />
        <StatsCard
          title="비정상 검사 비율"
          value={`${abnormalRate}%`}
          icon={AlertTriangle}
          description={`${abnormalTests}건 / ${testResults.length}건`}
          variant={Number(abnormalRate) > 20 ? "warning" : "default"}
          data-testid="stat-abnormal-rate"
        />
        <StatsCard
          title="총 검사 항목"
          value={testResults.length}
          icon={TestTube}
          description="수행된 검사"
          data-testid="stat-total-tests"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top 5 Abnormal Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              주요 검사 이상 Top 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            {top5AbnormalTests.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top5AbnormalTests}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
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
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                검사 데이터가 없습니다
              </div>
            )}
          </CardContent>
        </Card>

        {/* Breed Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              품종별 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            {breedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                환자 데이터가 없습니다
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visit Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            월별 방문 추이 (최근 6개월)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visitFrequencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
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
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              방문 데이터가 없습니다
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
