import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageIcon } from "lucide-react";

export function ImagingViewer() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">영상 및 소견</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Thumbnail Carousel */}
                <ScrollArea className="w-full whitespace-nowrap pb-4">
                    <div className="flex w-max space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-[150px] aspect-square rounded-md bg-muted flex items-center justify-center relative overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                <span className="absolute bottom-2 left-2 text-xs font-medium bg-black/50 text-white px-1 rounded">
                                    X-ray {i}
                                </span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Preview & Findings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t pt-4">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">영상 프리뷰 영역</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">영상 판독 소견</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                흉부 방사선 상 심비대 소견 관찰됨 (VHS 11.5).
                                좌심방 확장이 의심되며, 폐수종 소견은 명확하지 않음.
                                기관지 패턴이 일부 관찰되나 노령성 변화로 추정됨.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">주요 측정 수치</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/20 rounded border">
                                    <span className="text-xs text-muted-foreground block">VHS</span>
                                    <span className="font-bold text-lg">11.5</span>
                                    <span className="text-xs text-red-500 ml-1">(High)</span>
                                </div>
                                <div className="p-3 bg-muted/20 rounded border">
                                    <span className="text-xs text-muted-foreground block">VLAS</span>
                                    <span className="font-bold text-lg">2.1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
