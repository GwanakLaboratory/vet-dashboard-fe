import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Patients from "./patients";
import Visits from "./visits";
import { OverviewTab } from "./dashboard/tabs/overview-tab";

export default function OverviewPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">통합 개체 관리</h1>
                <p className="text-muted-foreground">
                    환자 정보 관리, 방문 이력 조회 및 개체별 요약 정보를 확인합니다.
                </p>
            </div>

            <Tabs defaultValue="summary" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="summary">개체 요약</TabsTrigger>
                    <TabsTrigger value="patients">환자 관리</TabsTrigger>
                    <TabsTrigger value="visits">방문 기록</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                    <OverviewTab />
                </TabsContent>

                <TabsContent value="patients" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background">
                        {/* Removing container class from Patients to fit in tab */}
                        <Patients />
                    </div>
                </TabsContent>

                <TabsContent value="visits" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background">
                        <Visits />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
