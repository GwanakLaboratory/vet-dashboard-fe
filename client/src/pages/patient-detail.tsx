import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Dog,
  Calendar,
  TestTube,
  ClipboardList,
  View,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { Patient, Visit, TestResult, QuestionnaireResponse } from "@shared/schema";

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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/patients")}
          data-testid="button-back-to-patients"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">환자 상세 정보</h1>
          <p className="text-sm text-muted-foreground">
            {patient.name}의 진료 기록 및 검사 결과
          </p>
        </div>
        <Button onClick={() => setLocation("/body-model")} data-testid="button-view-3d-model">
          <View className="w-4 h-4 mr-2" />
          3D 모델 보기
        </Button>
      </div>

      {/* Patient Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                {patient.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">환자명</p>
                <p className="text-lg font-semibold">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">동물번호</p>
                <p className="text-lg font-mono">{patient.animalNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">보호자</p>
                <p className="text-lg">{patient.ownerName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">품종</p>
                <p className="text-lg">{patient.breed || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">성별/나이</p>
                <p className="text-lg">
                  {patient.gender || "-"}
                  {age !== null && ` / ${age}세`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">중성화</p>
                <Badge variant={patient.neutered ? "default" : "outline"}>
                  {patient.neutered ? "완료" : "미완료"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">체중</p>
                <p className="text-lg font-mono">
                  {patient.weight ? `${patient.weight} kg` : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">등록일</p>
                <p className="text-lg">{patient.registrationDate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">마이크로칩</p>
                <p className="text-sm font-mono">{patient.microchipNumber || "-"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 방문</p>
                <p className="text-2xl font-bold font-mono">{patientVisits.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 검사</p>
                <p className="text-2xl font-bold font-mono">{patientTests.length}</p>
              </div>
              <TestTube className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">이상 검사</p>
                <p className="text-2xl font-bold font-mono text-destructive">
                  {abnormalTests.length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">문진 응답</p>
                <p className="text-2xl font-bold font-mono">{patientResponses.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="visits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visits" data-testid="tab-visits">
            최근 방문
          </TabsTrigger>
          <TabsTrigger value="tests" data-testid="tab-tests">
            최근 검사
          </TabsTrigger>
          <TabsTrigger value="questionnaire" data-testid="tab-questionnaire">
            문진 요약
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 방문 기록 (5건)</CardTitle>
            </CardHeader>
            <CardContent>
              {recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {recentVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover-elevate"
                      data-testid={`visit-${visit.id}`}
                    >
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">
                        {visit.visitDate}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{visit.visitType || "일반"}</Badge>
                          <Badge
                            variant={
                              visit.status === "완료" ? "default" : "outline"
                            }
                          >
                            {visit.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">
                          {visit.chiefComplaint || "주증상 없음"}
                        </p>
                        {visit.diagnosis && (
                          <p className="text-sm text-muted-foreground">
                            진단: {visit.diagnosis}
                          </p>
                        )}
                        {visit.veterinarian && (
                          <p className="text-xs text-muted-foreground mt-1">
                            수의사: {visit.veterinarian}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  방문 기록이 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 검사 결과 (5건)</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTests.length > 0 ? (
                <div className="space-y-3">
                  {recentTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                      data-testid={`test-${test.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {test.status === "H" ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : test.status === "L" ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{test.examCode}</p>
                          <p className="text-xs text-muted-foreground">
                            {test.testDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold">
                          {test.value !== null ? test.value : test.valueText || "-"}
                        </p>
                        <Badge
                          variant={
                            test.status === "H" || test.status === "L"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {test.status === "H"
                            ? "높음"
                            : test.status === "L"
                            ? "낮음"
                            : "정상"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  검사 결과가 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaire" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>문진 응답 요약</CardTitle>
            </CardHeader>
            <CardContent>
              {patientResponses.length > 0 ? (
                <div className="space-y-3">
                  {patientResponses.slice(0, 10).map((response) => (
                    <div
                      key={response.id}
                      className="p-3 rounded-lg border border-border"
                      data-testid={`response-${response.id}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium">
                          문항 ID: {response.questionId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {response.responseDate}
                        </p>
                      </div>
                      <p className="text-sm">응답: {response.response}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  문진 응답이 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
