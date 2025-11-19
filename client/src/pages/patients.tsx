import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Dog,
  Calendar,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import type { Patient, Visit, TestResult } from "@shared/schema";

export default function Patients() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

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
    };
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">환자 관리</h1>
          <p className="text-sm text-muted-foreground">
            등록된 반려동물 환자 목록
          </p>
        </div>
        <Button data-testid="button-add-patient">
          <Dog className="w-4 h-4 mr-2" />
          환자 추가
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="환자명, 동물번호, 보호자명, 품종으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-patients"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            환자 목록 ({filteredPatients.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>환자</TableHead>
                    <TableHead>동물번호</TableHead>
                    <TableHead>품종</TableHead>
                    <TableHead>성별/나이</TableHead>
                    <TableHead>보호자</TableHead>
                    <TableHead>방문횟수</TableHead>
                    <TableHead>최근방문</TableHead>
                    <TableHead>이상검사</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => {
                    const stats = getPatientStats(patient.animalNumber);
                    const age = calculateAge(patient.birthDate);

                    return (
                      <TableRow
                        key={patient.id}
                        className="hover-elevate cursor-pointer"
                        onClick={() =>
                          setLocation(`/patients/${patient.animalNumber}`)
                        }
                        data-testid={`row-patient-${patient.animalNumber}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {patient.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              {patient.microchipNumber && (
                                <div className="text-xs text-muted-foreground">
                                  칩: {patient.microchipNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {patient.animalNumber}
                        </TableCell>
                        <TableCell>{patient.breed || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">
                              {patient.gender || "-"}
                            </span>
                            {age !== null && (
                              <span className="text-xs text-muted-foreground">
                                {age}세
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{patient.ownerName || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono">{stats.totalVisits}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {stats.lastVisitDate || "-"}
                        </TableCell>
                        <TableCell>
                          {stats.abnormalTestCount > 0 ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {stats.abnormalTestCount}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              정상
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-view-patient-${patient.animalNumber}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm
                ? "검색 결과가 없습니다"
                : "등록된 환자가 없습니다"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
