import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Clock,
  User,
  FileText,
} from "lucide-react";
import type { Visit, Patient } from "@shared/schema";

export default function Visits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Get patient name by animal number
  const getPatientName = (animalNumber: string) => {
    return patients.find((p) => p.animalNumber === animalNumber)?.name || animalNumber;
  };

  // Filter visits
  const filteredVisits = visits
    .filter((visit) => {
      const matchesSearch =
        visit.animalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.veterinarian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPatientName(visit.animalNumber).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || visit.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  // Group visits by month
  const groupedVisits = filteredVisits.reduce((acc: Record<string, Visit[]>, visit) => {
    const month = visit.visitDate.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(visit);
    return acc;
  }, {});

  const months = Object.keys(groupedVisits).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">방문 기록</h1>
        <p className="text-sm text-muted-foreground">
          환자들의 진료 방문 타임라인
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="환자명, 동물번호, 증상, 진단, 수의사 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-visits"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="예약">예약</SelectItem>
                <SelectItem value="접수">접수</SelectItem>
                <SelectItem value="진료중">진료중</SelectItem>
                <SelectItem value="완료">완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">총 방문</p>
            <p className="text-2xl font-bold font-mono">{visits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">예약</p>
            <p className="text-2xl font-bold font-mono">
              {visits.filter((v) => v.status === "예약").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">진료중</p>
            <p className="text-2xl font-bold font-mono">
              {visits.filter((v) => v.status === "진료중").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">완료</p>
            <p className="text-2xl font-bold font-mono">
              {visits.filter((v) => v.status === "완료").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>방문 타임라인 ({filteredVisits.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {months.length > 0 ? (
            <div className="space-y-8">
              {months.map((month) => (
                <div key={month}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{month}</h3>
                    <Badge variant="outline">{groupedVisits[month].length}건</Badge>
                  </div>
                  <div className="space-y-3 pl-7 border-l-2 border-border">
                    {groupedVisits[month].map((visit) => (
                      <div
                        key={visit.id}
                        className="relative ml-4 p-4 rounded-lg border border-border hover-elevate"
                        data-testid={`visit-${visit.id}`}
                      >
                        <div className="absolute -left-[2.25rem] top-6 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                        
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-mono text-muted-foreground">
                              {visit.visitDate}
                            </span>
                          </div>
                          <Badge
                            variant={
                              visit.status === "완료"
                                ? "default"
                                : visit.status === "진료중"
                                ? "outline"
                                : "outline"
                            }
                          >
                            {visit.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {getPatientName(visit.animalNumber)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({visit.animalNumber})
                            </span>
                          </div>

                          {visit.visitType && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <Badge variant="outline">{visit.visitType}</Badge>
                            </div>
                          )}

                          {visit.chiefComplaint && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">주증상:</p>
                              <p className="text-sm font-medium">{visit.chiefComplaint}</p>
                            </div>
                          )}

                          {visit.diagnosis && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">진단:</p>
                              <p className="text-sm">{visit.diagnosis}</p>
                            </div>
                          )}

                          {visit.treatment && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">처치:</p>
                              <p className="text-sm">{visit.treatment}</p>
                            </div>
                          )}

                          {visit.veterinarian && (
                            <div className="mt-2 flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                담당 수의사: {visit.veterinarian}
                              </p>
                            </div>
                          )}

                          {visit.notes && (
                            <div className="mt-2 p-2 bg-muted/50 rounded-md">
                              <p className="text-xs text-muted-foreground">메모:</p>
                              <p className="text-sm">{visit.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "검색 결과가 없습니다"
                : "방문 기록이 없습니다"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
