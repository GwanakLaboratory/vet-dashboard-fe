import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OverviewTab } from "./tabs/overview-tab";
import { TestResultsTab } from "./tabs/test-results-tab";
import { StatisticsTab } from "./tabs/statistics-tab";
import { PreDiagnosisTab } from "./tabs/pre-diagnosis-tab";
import { ImagingTab } from "./tabs/imaging-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { AdminTab } from "./tabs/admin-tab";
import { mockPatient } from "@/lib/mock-dashboard-data";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="container mx-auto p-4 max-w-[1600px] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">통합 검진 대시보드</h1>
                    <p className="text-sm text-muted-foreground">
                        환자의 종합적인 건강 상태를 한눈에 확인하세요.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">환자 선택:</span>
                    <Select defaultValue={mockPatient.animalNumber}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="환자 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={mockPatient.animalNumber}>
                                {mockPatient.name} ({mockPatient.animalNumber})
                            </SelectItem>
                            <SelectItem value="10000002">나비 (10000002)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                    <TabsTrigger value="overview">개체 Overview</TabsTrigger>
                    <TabsTrigger value="results">통합 검진 결과</TabsTrigger>
                    <TabsTrigger value="stats">집단 비교/통계</TabsTrigger>
                    <TabsTrigger value="pre-diagnosis">사전 문진</TabsTrigger>
                    <TabsTrigger value="imaging">영상/소견</TabsTrigger>
                    <TabsTrigger value="documents">문서/PDF</TabsTrigger>
                    <TabsTrigger value="admin">관리자(정합성)</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <OverviewTab />
                </TabsContent>
                <TabsContent value="results" className="space-y-4">
                    <TestResultsTab />
                </TabsContent>
                <TabsContent value="stats" className="space-y-4">
                    <StatisticsTab />
                </TabsContent>
                <TabsContent value="pre-diagnosis" className="space-y-4">
                    <PreDiagnosisTab />
                </TabsContent>
                <TabsContent value="imaging" className="space-y-4">
                    <ImagingTab />
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                    <DocumentsTab />
                </TabsContent>
                <TabsContent value="admin" className="space-y-4">
                    <AdminTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
