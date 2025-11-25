import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Dog,
  Calendar,
  TestTube,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Activity,
  User,
  Clock,
  Weight,
  Hash,
  FileText,
  Pill,
  LineChart
} from "lucide-react";
import type { Patient, Visit, TestResult, QuestionnaireResponse, Medication, ExamMaster } from "@shared/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { IntegratedTimeline } from "@/components/charts/integrated-timeline";
import { HealthRadar } from "@/components/charts/health-radar";

export default function PatientDetail() {
  const [, params] = useRoute("/patients/:animalNumber");
  const [, setLocation] = useLocation();
  const animalNumber = params?.animalNumber;

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  const { data: responses = [] } = useQuery<QuestionnaireResponse[]>({
    queryKey: ["/api/questionnaire-responses"],
  });

  const { data: medications = [] } = useQuery<Medication[]>({
    queryKey: ["/api/medications", animalNumber],
    queryFn: async () => {
      if (!animalNumber) return [];
      const res = await fetch(`/api/medications?animalNumber=${animalNumber}`);
      if (!res.ok) return [];
      // Filter client-side for now as the API returns all
      const allMeds = await res.json();
      return allMeds.filter((m: Medication) => m.animalNumber === animalNumber);
    },
    enabled: !!animalNumber,
  });

  const { data: examMaster = [] } = useQuery<ExamMaster[]>({
    queryKey: ["/api/exam-master"],
  });

  const patient = patients.find((p) => p.animalNumber === animalNumber);
  const patientVisits = visits.filter((v) => v.animalNumber === animalNumber);
  const patientTests = testResults.filter((t) => t.animalNumber === animalNumber);
  const patientResponses = responses.filter((r) => r.animalNumber === animalNumber);

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">환자를 찾을 수 없습니다</p>
        <Button onClick={() => setLocation("/patients")}>
          환자 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const age = calculateAge(patient.birthDate);
  const abnormalTests = patientTests.filter((t) => t.status === "H" || t.status === "L");
  const recentVisits = patientVisits
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .slice(0, 5);
  const recentTests = patientTests
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy.MM.dd", { locale: ko });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-[-1rem]">
        <span className="hover:text-primary cursor-pointer" onClick={() => setLocation("/")}>홈</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer" onClick={() => setLocation("/patients")}>환자 관리</span>
        <span>/</span>
        <span className="text-foreground font-medium">{patient.name}</span>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/patients")}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {patient.name}
              <Badge variant="secondary" className="text-base font-normal px-3">
                {patient.breed}
              </Badge>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Hash className="w-3 h-3" />
              {patient.animalNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient Profile & Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
            <CardContent className="p-0">
              <div className="bg-primary/10 p-8 flex flex-col items-center justify-center text-center border-b">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                    {patient.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground font-medium">{patient.breed}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant={patient.gender === "수컷" ? "default" : "secondary"}>
                    {patient.gender}
                  </Badge>
                  <Badge variant="outline">{age}세</Badge>
                  <Badge variant={patient.neutered ? "secondary" : "outline"}>
                    {patient.neutered ? "중성화 완료" : "중성화 미완료"}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-sm">보호자</span>
                  </div>
                  <span className="font-medium">{patient.ownerName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Weight className="w-4 h-4" />
                    <span className="text-sm">체중</span>
                  </div>
                  <span className="font-medium">{patient.weight ? `${patient.weight} kg` : "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">등록일</span>
                  </div>
                  <span className="font-medium">{formatDate(patient.registrationDate || "")}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">마이크로칩</span>
                  </div>
                  <span className="font-medium font-mono text-sm">{patient.microchipNumber || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Activity className="w-6 h-6 text-primary mb-2" />
                <p className="text-2xl font-bold">{patientVisits.length}</p>
                <p className="text-xs text-muted-foreground">총 방문 횟수</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-6 h-6 text-destructive mb-2" />
                <p className="text-2xl font-bold text-destructive">{abnormalTests.length}</p>
                <p className="text-xs text-muted-foreground">이상 소견</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Detailed Records */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="visits">진료 기록</TabsTrigger>
              <TabsTrigger value="tests">검사 결과</TabsTrigger>
              <TabsTrigger value="analytics">고급 분석</TabsTrigger>
              <TabsTrigger value="questionnaires">문진</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Overview content - keeping it simple for now, maybe summary of latest visit */}
                <Card>
                  <CardHeader>
                    <CardTitle>최근 진료 요약</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentVisits.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{formatDate(recentVisits[0].visitDate)}</h3>
                          <Badge>{recentVisits[0].status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{recentVisits[0].chiefComplaint}</p>
                        <p className="text-sm">{recentVisits[0].diagnosis}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">최근 진료 기록이 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="visits" className="mt-6 space-y-4">
              {recentVisits.length > 0 ? (
                recentVisits.map((visit) => (
                  <Card key={visit.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-muted/30 rounded-xl border">
                          <span className="text-2xl font-bold text-primary">
                            {formatDate(visit.visitDate).split('.')[2]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(visit.visitDate).split('.')[0]}.{formatDate(visit.visitDate).split('.')[1]}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs font-normal">
                                {visit.visitType || "일반진료"}
                              </Badge>
                              <h3 className="font-semibold text-lg">
                                {visit.chiefComplaint || "주증상 기록 없음"}
                              </h3>
                            </div>
                            <Badge variant={visit.status === "완료" ? "default" : "secondary"}>
                              {visit.status}
                            </Badge>
                          </div>

                          {visit.diagnosis && (
                            <div className="p-3 bg-muted/30 rounded-lg text-sm">
                              <span className="font-semibold mr-2">진단:</span>
                              {visit.diagnosis}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{visit.veterinarian || "담당의 미지정"}</span>
                            </div>
                            {visit.notes && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>메모 있음</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">등록된 방문 기록이 없습니다.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>최근 검사 결과</CardTitle>
                  <CardDescription>최근 5건의 주요 검사 결과입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTests.length > 0 ? (
                    <div className="space-y-1">
                      {recentTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors border-b last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${test.status === "H" ? "bg-red-100 text-red-600" :
                              test.status === "L" ? "bg-yellow-100 text-yellow-600" :
                                "bg-green-100 text-green-600"
                              }`}>
                              <Activity className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{test.examCode}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(test.testDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="font-mono font-bold text-lg">
                                {test.value !== null ? test.value : test.valueText || "-"}
                              </span>
                              {test.status === "H" && <ArrowLeft className="w-4 h-4 text-red-500 rotate-90" />}
                              {test.status === "L" && <ArrowLeft className="w-4 h-4 text-yellow-500 -rotate-90" />}
                            </div>
                            <Badge
                              variant={
                                test.status === "H" || test.status === "L"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {test.status === "H" ? "높음" : test.status === "L" ? "낮음" : "정상"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      검사 결과가 없습니다
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthRadar testResults={patientTests} examMaster={examMaster} />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      약물 처방 이력
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {medications.length > 0 ? (
                      <ScrollArea className="h-[250px]">
                        <ul className="space-y-3">
                          {medications.map((med) => (
                            <li key={med.id} className="border-b pb-3 last:border-0">
                              <div className="flex justify-between items-start">
                                <div className="font-semibold">{med.name}</div>
                                <Badge variant="outline">{med.category || "일반"}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {med.dosage} | {med.frequency}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {med.startDate} ~ {med.endDate || "진행중"}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    ) : (
                      <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
                        <Pill className="w-8 h-8 mb-2 opacity-50" />
                        <p>처방 기록이 없습니다.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">주요 검사 수치 및 약물 타임라인</h3>
                </div>
                {/* Example: Show timeline for BUN (Blood Urea Nitrogen) if available, or just the first available test */}
                <IntegratedTimeline
                  testResults={patientTests}
                  medications={medications}
                  examCode="BUN"
                />
                <IntegratedTimeline
                  testResults={patientTests}
                  medications={medications}
                  examCode="CREA"
                />
              </div>
            </TabsContent>

            <TabsContent value="questionnaires" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>문진 응답 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  {patientResponses.length > 0 ? (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {patientResponses.map((response) => (
                          <div
                            key={response.id}
                            className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="font-normal">
                                문항 {response.questionId}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(response.responseDate)}
                              </span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                              {response.response}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      문진 응답이 없습니다
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
