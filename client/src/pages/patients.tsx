import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { insertPatientSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import {
  Search,
  Dog,
  Calendar,
  AlertCircle,
  ChevronRight,
  LayoutGrid,
  List,
  Filter,
  MoreHorizontal,
  FileText,
  Activity,
  User
} from "lucide-react";
import type { Patient, Visit, TestResult } from "@shared/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Patients() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      animalNumber: "",
      name: "",
      ownerName: "",
      species: "개",
      breed: "",
      gender: "수컷",
      birthDate: new Date().toISOString(), // Default to today, needs proper handling
      registrationDate: new Date().toISOString(),
      neutered: false
    }
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.patients.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setIsAddDialogOpen(false);
      toast({
        title: "환자 등록 완료",
        description: "새로운 환자가 성공적으로 등록되었습니다.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "등록 실패",
        description: "환자 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    // Ensure dates are strings
    const formattedData = {
      ...data,
      birthDate: new Date(data.birthDate).toISOString(),
      registrationDate: new Date().toISOString()
    };
    createPatientMutation.mutate(formattedData);
  };

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: testResults = [] } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

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

  // Filter patients
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.animalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.ownerName && patient.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.breed && patient.breed.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get patient stats
  const getPatientStats = (animalNumber: string) => {
    const patientVisits = visits.filter((v) => v.animalNumber === animalNumber);
    const patientTests = testResults.filter((t) => t.animalNumber === animalNumber);
    const abnormalTests = patientTests.filter((t) => t.status === "H" || t.status === "L");
    const lastVisit = patientVisits.sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    )[0];

    return {
      totalVisits: patientVisits.length,
      abnormalTestCount: abnormalTests.length,
      lastVisitDate: lastVisit?.visitDate,
      lastDiagnosis: lastVisit?.diagnosis
    };
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsSheetOpen(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "yyyy.MM.dd", { locale: ko });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">환자 관리</h1>
          <p className="text-muted-foreground mt-1">
            등록된 반려동물 환자 목록 및 통합 관리
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-patient" className="gap-2">
              <Dog className="w-4 h-4" />
              환자 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 환자 등록</DialogTitle>
              <DialogDescription>
                새로운 환자의 기본 정보를 입력하여 등록합니다.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="animalNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>동물번호</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input placeholder="멍멍이" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>보호자명</FormLabel>
                        <FormControl>
                          <Input placeholder="홍길동" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>품종</FormLabel>
                        <FormControl>
                          <Input placeholder="말티즈" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createPatientMutation.isPending}>
                    {createPatientMutation.isPending ? "등록 중..." : "등록하기"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="이름, 번호, 보호자, 품종 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-patients"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <div className="flex border rounded-md bg-background">
            <Button
              variant={viewType === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewType("list")}
              className="rounded-none rounded-l-md h-9 w-9"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewType("grid")}
              className="rounded-none rounded-r-md h-9 w-9"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Patient List/Grid */}
      {filteredPatients.length > 0 ? (
        viewType === "list" ? (
          <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">환자 정보</TableHead>
                  <TableHead>동물번호</TableHead>
                  <TableHead>품종/성별/나이</TableHead>
                  <TableHead>보호자</TableHead>
                  <TableHead>진료 현황</TableHead>
                  <TableHead>최근 방문</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const stats = getPatientStats(patient.animalNumber);
                  const age = calculateAge(patient.birthDate);

                  return (
                    <TableRow
                      key={patient.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handlePatientClick(patient)}
                      data-testid={`row-patient-${patient.animalNumber}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border">
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {patient.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            {patient.microchipNumber && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                칩 등록됨
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {patient.animalNumber}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {patient.breed || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {patient.gender || "-"} • {age !== null ? `${age}세` : "-"}
                        </div>
                      </TableCell>
                      <TableCell>{patient.ownerName || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-normal">
                            방문 {stats.totalVisits}
                          </Badge>
                          {stats.abnormalTestCount > 0 && (
                            <Badge variant="destructive" className="gap-1 px-1.5">
                              <AlertCircle className="w-3 h-3" />
                              {stats.abnormalTestCount}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(stats.lastVisitDate || null)}
                        </div>
                        {stats.lastDiagnosis && (
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {stats.lastDiagnosis}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/patients/${patient.animalNumber}`);
                          }}
                        >
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPatients.map((patient) => {
              const stats = getPatientStats(patient.animalNumber);
              const age = calculateAge(patient.birthDate);

              return (
                <Card
                  key={patient.id}
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handlePatientClick(patient)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {patient.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{patient.name}</CardTitle>
                      <CardDescription className="truncate text-xs">
                        {patient.breed} • {age}세
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="flex flex-col gap-0.5 p-2 bg-muted/30 rounded">
                        <span className="text-xs text-muted-foreground">방문</span>
                        <span className="font-bold">{stats.totalVisits}회</span>
                      </div>
                      <div className="flex flex-col gap-0.5 p-2 bg-muted/30 rounded">
                        <span className="text-xs text-muted-foreground">이상소견</span>
                        <span className={`font-bold ${stats.abnormalTestCount > 0 ? "text-destructive" : "text-green-600"}`}>
                          {stats.abnormalTestCount}건
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {patient.ownerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(stats.lastVisitDate || null)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed bg-muted/10">
          <Dog className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            검색어와 일치하는 환자가 없습니다. 새로운 환자를 등록하거나 검색어를 변경해보세요.
          </p>
        </div>
      )}

      {/* Quick View Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedPatient && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="w-16 h-16 border-2">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {selectedPatient.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-2xl">{selectedPatient.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedPatient.breed}</Badge>
                      <span>{selectedPatient.gender}</span>
                      <span>{calculateAge(selectedPatient.birthDate)}세</span>
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setLocation(`/patients/${selectedPatient.animalNumber}`)}>
                    상세 정보 보기
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: "준비 중", description: "차트 작성 기능은 추후 업데이트될 예정입니다." })}>
                    <FileText className="w-4 h-4 mr-2" />
                    차트 작성
                  </Button>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" /> 기본 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">동물번호</span>
                      <span className="font-mono">{selectedPatient.animalNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">보호자</span>
                      <span>{selectedPatient.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">체중</span>
                      <span>{selectedPatient.weight ? `${selectedPatient.weight} kg` : "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">등록일</span>
                      <span>{formatDate(selectedPatient.registrationDate || null)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recent History */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4" /> 최근 진료 이력
                  </h4>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    {visits
                      .filter(v => v.animalNumber === selectedPatient.animalNumber)
                      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                      .slice(0, 5)
                      .map((visit) => (
                        <div key={visit.id} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{formatDate(visit.visitDate)}</span>
                            <Badge variant={visit.status === "완료" ? "secondary" : "outline"} className="text-[10px]">
                              {visit.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{visit.chiefComplaint || "주증상 없음"}</p>
                          {visit.diagnosis && (
                            <p className="text-xs text-muted-foreground mt-1">Dx: {visit.diagnosis}</p>
                          )}
                          <Separator className="my-3" />
                        </div>
                      ))}
                    {visits.filter(v => v.animalNumber === selectedPatient.animalNumber).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        진료 기록이 없습니다.
                      </p>
                    )}
                  </ScrollArea>
                </div>
              </div>

              <SheetFooter className="mt-8">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full">닫기</Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
