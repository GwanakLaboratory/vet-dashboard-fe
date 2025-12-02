import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart2,
    Table as TableIcon,
    Sparkles,
} from "lucide-react";
import { ResearchAgentInterface } from "@/components/research/research-agent-interface";
import { mockResearchData, columnDefinitions } from "@/lib/mock-dashboard-data";
import { ChartBuilder } from "./chart-builder";
import { PatientTable } from "./patient-table";

export function ResearchDashboard() {
    // Default selected columns: General group + key biomarkers
    const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([
        'id', 'name', 'breed', 'age', 'gender', 'weight', 'diagnosis', 'diseaseStage', 'lastVisit',
        'abnormalTestCount', 'criticalFlags',
        'CM001', 'BC009', 'BC007', 'BC001', 'BC008' // NT-proBNP, Creatinine, SDMA, ALT, BUN
    ]);

    const { patients } = mockResearchData;

    return (
        <div className="flex flex-col h-full space-y-12">
            {/* Section 1: Data Visualization (formerly Overview) */}
            <section id="section-visualization" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart2 className="w-5 h-5" />
                        데이터 시각화
                    </h2>
                </div>
                <ChartBuilder data={patients} columnDefinitions={columnDefinitions} />
            </section>

            {/* Section 2: Patient Database (formerly Patient List) */}
            <section id="section-database" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TableIcon className="w-5 h-5" />
                        환자 데이터베이스
                    </h2>
                </div>
                <div className="border rounded-lg bg-card flex flex-col h-[600px]">
                    <PatientTable
                        data={patients}
                        columns={columnDefinitions}
                        initialSelectedColumns={selectedColumnKeys}
                        onSelectionChange={setSelectedColumnKeys}
                    />
                </div>
            </section>

            {/* Section 3: AI Analysis */}
            <section id="section-ai" className="scroll-mt-20 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI 분석
                    </h2>
                </div>
                <div className="border rounded-lg bg-card overflow-hidden h-[600px]">
                    <ResearchAgentInterface />
                </div>
            </section>
        </div>
    );
}
