import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsTab } from "./dashboard/tabs/statistics-tab";
import Filters from "./filters";

export default function StatisticsPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">집단 비교 및 통계</h1>
                <p className="text-muted-foreground">
                    환자 데이터를 통계적으로 분석하고 특정 군집과 비교합니다.
                </p>
            </div>

            <Tabs defaultValue="stats" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="stats">통계 분석</TabsTrigger>
                    <TabsTrigger value="filters">필터 및 군집</TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="space-y-4">
                    <StatisticsTab />
                </TabsContent>

                <TabsContent value="filters" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background">
                        <Filters />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
