import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import {
  Dog,
  AlertTriangle,
  Calendar,
  Activity,
  TrendingUp,
  TestTube,
  ArrowUpRight,
  Users,
  Clock,
  Bell,
  CalendarDays,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  AreaChart,
  Area
} from "recharts";
import type { Patient, Visit, TestResult } from "@shared/schema";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useLocation } from "wouter";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date());

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
    .slice(0, 5)
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

  // Recent Activity (Latest 5 visits)
  const recentActivity = [...visits]
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .slice(0, 5)
    .map(visit => {
      const patient = patients.find(p => p.animalNumber === visit.animalNumber);
      return {
        ...visit,
        patientName: patient?.name || "Unknown",
        breed: patient?.breed || "-"
      };
    });

  // Notifications (Mock based on abnormal results)
  const notifications = testResults
    .filter(r => r.status === "H" || r.status === "L")
    .slice(0, 3)
    .map(r => {
      const patient = patients.find(p => p.animalNumber === r.animalNumber);
      return {
        id: r.id,
        title: "이상 검사 결과 감지",
        message: `${patient?.name || r.animalNumber}의 ${r.examCode} 수치가 ${r.status === 'H' ? '높음' : '낮음'}`,
        time: format(new Date(r.testDate), "HH:mm"),
        type: "warning"
      };
    });

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <motion.div
      className="container mx-auto p-4 max-w-[1600px] space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "yyyy년 MM월 dd일 EEEE", { locale: ko })} 현황
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocation("/patients")}>
            <Users className="w-4 h-4 mr-2" />
            환자 관리
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLocation("/visits")}>
            <CalendarDays className="w-4 h-4 mr-2" />
            진료 예약
          </Button>
          <Button size="sm" onClick={() => setLocation("/data-management")}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            데이터 업로드
          </Button>
        </div>
      </div>

      {/* Key Metrics - Compact Grid */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 환자"
          value={totalPatients}
          icon={Dog}
          description="등록된 반려동물"
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900"
        />
        <StatsCard
          title="총 방문"
          value={totalVisits}
          icon={Calendar}
          description="누적 진료 기록"
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-100 dark:border-green-900"
        />
        <StatsCard
          title="이상 소견"
          value={`${abnormalRate}%`}
          icon={AlertTriangle}
          description="전체 검사 대비"
          variant={Number(abnormalRate) > 20 ? "warning" : "default"}
          className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-100 dark:border-orange-900"
        />
        <StatsCard
          title="검사 항목"
          value={testResults.length}
          icon={TestTube}
          description="수행된 검사"
          className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-purple-100 dark:border-purple-900"
        />
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-12 lg:grid-rows-2">

        {/* Left Column: Charts (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          {/* Row 1: Visit Trend & Breed Distribution */}
          <div className="grid gap-4 md:grid-cols-2 h-[320px]">
            <motion.div variants={item} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    월별 방문 추이
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitFrequencyData}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: "8px" }} />
                        <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#colorVisits)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">품종별 분포</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 flex flex-col justify-center">
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breedData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {breedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    {breedData.slice(0, 4).map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="truncate max-w-[80px]">{entry.name}</span>
                        <span className="font-medium ml-auto">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Row 2: Abnormal Tests & Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 h-[320px]">
            <motion.div variants={item} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    주요 이상 소견
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={top5AbnormalTests} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    최근 진료
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLocation("/visits")}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-hidden">
                  <div className="space-y-3">
                    {recentActivity.slice(0, 4).map((visit) => (
                      <div key={visit.id} className="flex items-center gap-3 text-sm">
                        <div className="flex flex-col items-center justify-center w-10 h-10 bg-muted rounded text-xs font-medium shrink-0">
                          <span className="text-muted-foreground">{format(new Date(visit.visitDate), "MM")}</span>
                          <span className="text-foreground font-bold">{format(new Date(visit.visitDate), "dd")}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium truncate">{visit.patientName}</p>
                            <Badge variant="secondary" className="text-[10px] px-1 h-4">{visit.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{visit.chiefComplaint || "내원 사유 없음"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Calendar & Notifications (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">일정</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pb-2">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow-sm"
                />
              </CardContent>
              <CardFooter className="pt-0 pb-4 justify-center">
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setLocation("/visits")}>
                  전체 일정 보기
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={item} className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  알림
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {notifications.length > 0 ? notifications.map((notif, i) => (
                      <div key={i} className="flex gap-3 items-start p-2 rounded hover:bg-muted/50 transition-colors">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive shrink-0" />
                        <div>
                          <p className="text-sm font-medium leading-none">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        새로운 알림이 없습니다.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
