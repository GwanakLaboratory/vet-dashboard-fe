import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreDiagnosisTab } from "./dashboard/tabs/pre-diagnosis-tab";
import Questionnaires from "./questionnaires";

export default function PreDiagnosisPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">사전 문진 데이터</h1>
                <p className="text-muted-foreground">
                    보호자 사전 문진 내역과 증상 키워드를 분석합니다.
                </p>
            </div>

            <Tabs defaultValue="analysis" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="analysis">문진 분석 뷰</TabsTrigger>
                    <TabsTrigger value="data">문진 데이터 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                    <PreDiagnosisTab />
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background">
                        <Questionnaires />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
