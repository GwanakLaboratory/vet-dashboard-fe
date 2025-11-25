import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockImaging } from "@/lib/mock-dashboard-data";
import { Image as ImageIcon, AlertCircle, ZoomIn } from "lucide-react";

export function ImagingTab() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockImaging.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                    <div className="relative aspect-video bg-muted">
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Badge variant="secondary" className="cursor-pointer flex items-center gap-1">
                                <ZoomIn className="w-3 h-3" /> 크게 보기
                            </Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                            <Badge variant="default" className="bg-black/70 hover:bg-black/80">
                                {item.type}
                            </Badge>
                        </div>
                        {item.severity === "High" && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="destructive">이상 소견</Badge>
                            </div>
                        )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            {item.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <AlertCircle className="w-4 h-4" />
                                <span>주요 소견</span>
                            </div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {item.findings.map((finding, i) => (
                                    <li key={i} className="text-foreground/90">
                                        {finding}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Placeholder for "No Images" or "Upload" */}
            <Card className="border-dashed flex flex-col items-center justify-center min-h-[300px] text-muted-foreground bg-muted/20">
                <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium">추가 영상 없음</p>
                <p className="text-sm mt-1">새로운 영상을 업로드하려면 PACS 연동을 확인하세요.</p>
            </Card>
        </div>
    );
}
