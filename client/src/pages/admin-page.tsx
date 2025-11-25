import { AdminTab } from "./dashboard/tabs/admin-tab";

export default function AdminPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">관리자 뷰</h1>
                <p className="text-muted-foreground">
                    데이터 정합성 모니터링 및 시스템 관리 기능을 제공합니다.
                </p>
            </div>
            <AdminTab />
        </div>
    );
}
