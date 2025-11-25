import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Filter,
  Save,
  Trash2,
  Users,
  Plus,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import type { Patient, UserFilter, ClusterAnalysis, TestResult } from "@shared/schema";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Filters() {
  const { toast } = useToast();
  const [filterName, setFilterName] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [examStatus, setExamStatus] = useState<string>("all");
  const [selectedCluster, setSelectedCluster] = useState<ClusterAnalysis | null>(null);

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

      return api.filters.create({
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

      return api.cluster.create({
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
      return api.filters.delete(filterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-filters"] });
      toast({
        title: "필터 삭제 완료",
        description: "필터가 삭제되었습니다.",
      });
    },
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Breed distribution for current filter
  const breedStats = filteredPatients.reduce((acc: Record<string, number>, p) => {
    const breed = p.breed || "기타";
    acc[breed] = (acc[breed] || 0) + 1;
    return acc;
  }, {});

  const breedData = Object.entries(breedStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">필터 및 군집 분석</h1>
          <p className="text-muted-foreground mt-1">
            사용자 정의 필터 생성 및 환자 군집 데이터 분석
          </p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
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
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Filter Form */}
            <Card className="lg:col-span-4 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">필터 조건 설정</CardTitle>
                <CardDescription>원하는 조건으로 환자를 필터링하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age-min">최소 나이</Label>
                      <Input
                        id="age-min"
                        type="number"
                        placeholder="0"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        data-testid="input-age-min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age-max">최대 나이</Label>
                      <Input
                        id="age-max"
                        type="number"
                        placeholder="20"
                        value={ageMax}
                        onChange={(e) => setAgeMax(e.target.value)}
                        data-testid="input-age-max"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-name">필터 이름 (저장 시)</Label>
                    <Input
                      id="filter-name"
                      placeholder="예: 5세 이상 골든 리트리버"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      data-testid="input-filter-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-description">설명</Label>
                    <Textarea
                      id="filter-description"
                      placeholder="필터에 대한 설명..."
                      value={filterDescription}
                      onChange={(e) => setFilterDescription(e.target.value)}
                      data-testid="textarea-filter-description"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={() => saveFilterMutation.mutate()}
                  disabled={!filterName || saveFilterMutation.isPending}
                  data-testid="button-save-filter"
                >
                  <Save className="w-4 h-4 mr-2" />
                  필터 저장
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
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
                  현재 결과로 군집 생성
                </Button>
              </CardFooter>
            </Card>

            {/* Filter Results */}
            <div className="lg:col-span-8 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">필터링된 환자</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">{filteredPatients.length}</p>
                          <span className="text-sm text-muted-foreground">/ {patients.length}</span>
                        </div>
                      </div>
                      <Users className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">평균 나이</p>
                        <p className="text-3xl font-bold">
                          {filteredPatients.length > 0
                            ? (filteredPatients.reduce((acc, p) => acc + (calculateAge(p.birthDate) || 0), 0) / filteredPatients.length).toFixed(1)
                            : 0}
                          <span className="text-sm font-normal text-muted-foreground ml-1">세</span>
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">주요 품종</p>
                        <p className="text-lg font-bold truncate max-w-[120px]">
                          {breedData[0]?.name || "-"}
                        </p>
                      </div>
                      <PieChartIcon className="w-8 h-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts & List */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">품종 분포 (Top 5)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={breedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {breedData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">환자 목록 미리보기</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {filteredPatients.slice(0, 20).map((patient) => {
                          const age = calculateAge(patient.birthDate);
                          return (
                            <div
                              key={patient.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                  {patient.name.substring(0, 2)}
                                </div>
                                <div>
                                  <p className="font-medium">{patient.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {patient.breed}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-xs text-muted-foreground">{patient.animalNumber}</p>
                                <p className="text-xs">{age}세</p>
                              </div>
                            </div>
                          );
                        })}
                        {filteredPatients.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            조건에 맞는 환자가 없습니다.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Saved Filters Tab */}
        <TabsContent value="saved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userFilters.map((filter) => (
              <Card key={filter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{filter.name}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteFilterMutation.mutate(filter.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-2 h-10">
                    {filter.description || "설명 없음"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="font-normal">
                      {filter.filterType}
                    </Badge>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      {filter.createdDate}
                    </Badge>
                  </div>
                  {filter.filterCriteria && (
                    <div className="p-2 bg-muted/30 rounded text-xs font-mono text-muted-foreground truncate">
                      {filter.filterCriteria}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-sm h-8">
                    이 필터 적용하기
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {userFilters.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <Save className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">저장된 필터가 없습니다</h3>
                <p>새로운 필터를 생성하고 저장해보세요.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Clusters Tab */}
        <TabsContent value="clusters" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <Card
                key={cluster.id}
                className="hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => setSelectedCluster(cluster)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Users className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-base">{cluster.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {cluster.description || "설명 없음"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">포함된 환자</div>
                    <div className="text-2xl font-bold">{cluster.memberAnimalNumbers?.length || 0}명</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full opacity-80" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    상세 분석 보기 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {clusters.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">생성된 군집이 없습니다</h3>
                <p>필터를 사용하여 새로운 환자 군집을 생성해보세요.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cluster Detail Dialog */}
      <Dialog open={!!selectedCluster} onOpenChange={(open) => !open && setSelectedCluster(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6 text-primary" />
              {selectedCluster?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCluster?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedCluster && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">총 환자 수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCluster.memberAnimalNumbers?.length || 0}명</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">생성일</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-base">{selectedCluster.createdDate}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">유형</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{selectedCluster.clusterType}</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">환자 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {patients
                          .filter(p => selectedCluster.memberAnimalNumbers?.includes(p.animalNumber))
                          .map(patient => (
                            <div key={patient.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                              <div>
                                <div className="font-medium">{patient.name}</div>
                                <div className="text-xs text-muted-foreground">{patient.breed} • {patient.gender}</div>
                              </div>
                              <Badge variant="secondary">{patient.animalNumber}</Badge>
                            </div>
                          ))
                        }
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">성별 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: '수컷', value: patients.filter(p => selectedCluster.memberAnimalNumbers?.includes(p.animalNumber) && p.gender === 'Male').length },
                              { name: '암컷', value: patients.filter(p => selectedCluster.memberAnimalNumbers?.includes(p.animalNumber) && p.gender === 'Female').length },
                              { name: '중성화 수컷', value: patients.filter(p => selectedCluster.memberAnimalNumbers?.includes(p.animalNumber) && p.gender === 'Neutered Male').length },
                              { name: '중성화 암컷', value: patients.filter(p => selectedCluster.memberAnimalNumbers?.includes(p.animalNumber) && p.gender === 'Spayed Female').length },
                            ].filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
