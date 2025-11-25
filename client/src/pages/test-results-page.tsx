import { TestResultsTab } from "./dashboard/tabs/test-results-tab";

export default function TestResultsPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">통합 검진 결과</h1>
                <p className="text-muted-foreground">
                    모든 검사 결과를 통합하여 조회하고 분석합니다.
                </p>
            </div>
            <TestResultsTab />
        </div>
    );
}
