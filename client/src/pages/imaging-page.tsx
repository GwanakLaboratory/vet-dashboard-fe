import { ImagingTab } from "./dashboard/tabs/imaging-tab";

export default function ImagingPage() {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">영상 및 소견</h1>
                <p className="text-muted-foreground">
                    X-ray, 초음파 등 영상 자료와 판독 소견을 확인합니다.
                </p>
            </div>
            <ImagingTab />
        </div>
    );
}
