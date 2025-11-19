import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Filter,
  Save,
  Trash2,
  Users,
  Plus,
  TrendingUp,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Patient, UserFilter, ClusterAnalysis, TestResult } from "@shared/schema";

export default function Filters() {
  const { toast } = useToast();
  const [filterName, setFilterName] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [examStatus, setExamStatus] = useState<string>("all");

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  const { data: userFilters = [] } = useQuery<UserFilter[]>({
    queryKey: ["/api/user-filters"],
  });

  const { data: clusters = [] } = useQuery<ClusterAnalysis[]>({
    queryKey: ["/api/cluster-analysis"],
  });

  // Get unique breeds
  const breeds = [...new Set(patients.map((p) => p.breed).filter(Boolean))];

  // Calculate age
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

  // Apply current filter
  const filteredPatients = patients.filter((patient) => {
    // Breed filter
    if (selectedBreed !== "all" && patient.breed !== selectedBreed) {
      return false;
    }

    // Age filter
    const age = calculateAge(patient.birthDate);
    if (age !== null) {
      if (ageMin && age < Number(ageMin)) return false;
      if (ageMax && age > Number(ageMax)) return false;
    }

    // Exam status filter
    if (examStatus !== "all") {
      const patientTests = testResults.filter(
        (r) => r.animalNumber === patient.animalNumber
      );
      const hasAbnormal = patientTests.some((r) => r.status === "H" || r.status === "L");

      if (examStatus === "abnormal" && !hasAbnormal) return false;
      if (examStatus === "normal" && hasAbnormal) return false;
    }

    return true;
  });

  // Save filter mutation
  const saveFilterMutation = useMutation({
    mutationFn: async () => {
      const criteria = {
        breed: selectedBreed !== "all" ? selectedBreed : undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        examStatus: examStatus !== "all" ? examStatus : undefined,
      };

      return apiRequest("POST", "/api/user-filters", {
        name: filterName,
        description: filterDescription,
        filterType: "custom",
        filterCriteria: JSON.stringify(criteria),
        createdDate: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-filters"] });
      toast({
        title: "필터 저장 완료",
        description: "사용자 정의 필터가 저장되었습니다.",
      });
      setFilterName("");
      setFilterDescription("");
    },
  });

  // Create cluster mutation
  const createClusterMutation = useMutation({
    mutationFn: async (clusterName: string) => {
      const memberNumbers = filteredPatients.map((p) => p.animalNumber);

      return apiRequest("POST", "/api/cluster-analysis", {
        name: clusterName,
        description: `${filterName || "사용자 정의"} 조건으로 생성된 군집`,
        clusterType: "custom",
        memberAnimalNumbers: memberNumbers,
        criteria: JSON.stringify({
          breed: selectedBreed,
          ageMin,
          ageMax,
          examStatus,
        }),
        createdDate: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cluster-analysis"] });
      toast({
        title: "군집 생성 완료",
        description: "새로운 군집이 생성되었습니다.",
      });
    },
  });

  // Delete filter mutation
  const deleteFilterMutation = useMutation({
    mutationFn: async (filterId: string) => {
      return apiRequest("DELETE", `/api/user-filters/${filterId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-filters"] });
      toast({
        title: "필터 삭제 완료",
        description: "필터가 삭제되었습니다.",
      });
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">필터 & 군집 분석</h1>
        <p className="text-sm text-muted-foreground">
          사용자 정의 필터를 생성하고 환자 군집을 분석하세요
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" data-testid="tab-create">
            <Filter className="w-4 h-4 mr-2" />
            필터 생성
          </TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved">
            <Save className="w-4 h-4 mr-2" />
            저장된 필터
          </TabsTrigger>
          <TabsTrigger value="clusters" data-testid="tab-clusters">
            <Users className="w-4 h-4 mr-2" />
            군집 분석
          </TabsTrigger>
        </TabsList>

        {/* Create Filter Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">필터 조건 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="breed">품종</Label>
                  <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                    <SelectTrigger id="breed" data-testid="select-breed">
                      <SelectValue placeholder="품종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 품종</SelectItem>
                      {breeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exam-status">검사 상태</Label>
                  <Select value={examStatus} onValueChange={setExamStatus}>
                    <SelectTrigger id="exam-status" data-testid="select-exam-status">
                      <SelectValue placeholder="검사 상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="normal">정상</SelectItem>
                      <SelectItem value="abnormal">이상 있음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age-min">최소 나이 (세)</Label>
                  <Input
                    id="age-min"
                    type="number"
                    placeholder="최소 나이"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    data-testid="input-age-min"
                  />
                </div>

                <div>
                  <Label htmlFor="age-max">최대 나이 (세)</Label>
                  <Input
                    id="age-max"
                    type="number"
                    placeholder="최대 나이"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    data-testid="input-age-max"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">필터 결과</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {filteredPatients.length}명
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    (전체 {patients.length}명 중)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">필터 저장</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="filter-name">필터 이름</Label>
                <Input
                  id="filter-name"
                  placeholder="예: 5세 이상 골든 리트리버"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  data-testid="input-filter-name"
                />
              </div>

              <div>
                <Label htmlFor="filter-description">설명</Label>
                <Textarea
                  id="filter-description"
                  placeholder="필터 설명..."
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  data-testid="textarea-filter-description"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => saveFilterMutation.mutate()}
                  disabled={!filterName || saveFilterMutation.isPending}
                  data-testid="button-save-filter"
                >
                  <Save className="w-4 h-4 mr-2" />
                  필터 저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const name = prompt("군집 이름을 입력하세요:");
                    if (name) {
                      createClusterMutation.mutate(name);
                    }
                  }}
                  disabled={filteredPatients.length === 0 || createClusterMutation.isPending}
                  data-testid="button-create-cluster"
                >
                  <Users className="w-4 h-4 mr-2" />
                  군집 생성
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filtered Patients Preview */}
          {filteredPatients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">필터 결과 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredPatients.slice(0, 20).map((patient) => {
                    const age = calculateAge(patient.birthDate);
                    return (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                        data-testid={`filtered-patient-${patient.animalNumber}`}
                      >
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.breed} • {patient.gender}
                            {age !== null && ` • ${age}세`}
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {patient.animalNumber}
                        </Badge>
                      </div>
                    );
                  })}
                  {filteredPatients.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      외 {filteredPatients.length - 20}명
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Filters Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                저장된 필터 ({userFilters.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userFilters.length > 0 ? (
                <div className="space-y-3">
                  {userFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className="p-4 rounded-lg border border-border"
                      data-testid={`saved-filter-${filter.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{filter.name}</p>
                          {filter.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {filter.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{filter.filterType}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {filter.createdDate}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteFilterMutation.mutate(filter.id)}
                          data-testid={`button-delete-filter-${filter.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      {filter.filterCriteria && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono">
                          {filter.filterCriteria}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  저장된 필터가 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clusters Tab */}
        <TabsContent value="clusters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                군집 분석 ({clusters.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clusters.length > 0 ? (
                <div className="space-y-3">
                  {clusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="p-4 rounded-lg border border-border"
                      data-testid={`cluster-${cluster.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <p className="font-medium">{cluster.name}</p>
                          </div>
                          {cluster.description && (
                            <p className="text-sm text-muted-foreground">
                              {cluster.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{cluster.clusterType}</Badge>
                            <Badge variant="default">
                              <Users className="w-3 h-3 mr-1" />
                              {cluster.memberAnimalNumbers?.length || 0}명
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {cluster.createdDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      {cluster.criteria && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono">
                          {cluster.criteria}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  생성된 군집이 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
