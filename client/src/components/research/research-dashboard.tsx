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
        <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
            {/* Section 1: Data Visualization (formerly Overview) */}
            <section id="section-visualization" className="h-full snap-start flex flex-col p-6 space-y-4">
                <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart2 className="w-5 h-5" />
                        데이터 시각화
                    </h2>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <ChartBuilder data={patients} columnDefinitions={columnDefinitions} />
                </div>
            </section>

            {/* Section 2: Patient Database (formerly Patient List) */}
            <section id="section-database" className="h-full snap-start flex flex-col p-6 space-y-4">
                <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TableIcon className="w-5 h-5" />
                        환자 데이터베이스
                    </h2>
                </div>
                <div className="border rounded-lg bg-card flex flex-col flex-1 min-h-0 shadow-sm">
                    <PatientTable
                        data={patients}
                        columns={columnDefinitions}
                        initialSelectedColumns={selectedColumnKeys}
                        onSelectionChange={setSelectedColumnKeys}
                    />
                </div>
            </section>

            {/* Section 3: AI Analysis */}
            <section id="section-ai" className="h-full snap-start flex flex-col p-6 space-y-4">
                <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI 분석
                    </h2>
                </div>
                <div className="border rounded-lg bg-card overflow-hidden flex-1 min-h-0 shadow-sm">
                    <ResearchAgentInterface />
                </div>
            </section>
        </div>
    );
}
