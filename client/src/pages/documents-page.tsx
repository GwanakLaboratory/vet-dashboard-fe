import { DocumentsTab } from "./dashboard/tabs/documents-tab";

export default function DocumentsPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">문서 통합 뷰어</h1>
                <p className="text-muted-foreground">
                    진료 의뢰서, 검사 결과지 등 각종 문서를 통합 관리합니다.
                </p>
            </div>
            <DocumentsTab />
        </div>
    );
}
