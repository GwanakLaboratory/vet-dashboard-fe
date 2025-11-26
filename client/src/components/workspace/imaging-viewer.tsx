import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageIcon } from "lucide-react";
import { mockImaging } from "@/lib/mock-dashboard-data";

export function ImagingViewer() {
    const { thumbnails, findings } = mockImaging;
    const [selectedImage, setSelectedImage] = useState(thumbnails[0]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">영상 및 소견</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Thumbnail Carousel */}
                <ScrollArea className="w-full whitespace-nowrap pb-4">
                    <div className="flex w-max space-x-4">
                        {thumbnails.map((item) => (
                            <div
                                key={item.id}
                                className={`w-[150px] aspect-square rounded-md bg-muted flex items-center justify-center relative overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all ${selectedImage.id === item.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setSelectedImage(item)}
                            >
                                {item.path ? (
                                    <img
                                        src={item.path}
                                        alt={item.label}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                )}
                                <span className="absolute bottom-2 left-2 text-xs font-medium bg-black/50 text-white px-1 rounded">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Preview & Findings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t pt-4">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
                        {selectedImage?.path ? (
                            <img
                                src={selectedImage.path}
                                alt={selectedImage.label}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <p className="text-muted-foreground text-sm">영상 프리뷰 영역</p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">{findings.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {findings.description}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">주요 측정 수치</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {findings.measurements.map((measure, i) => (
                                    <div key={i} className="p-3 bg-muted/20 rounded border">
                                        <span className="text-xs text-muted-foreground block">{measure.label}</span>
                                        <span className="font-bold text-lg">{measure.value}</span>
                                        {measure.status === "High" && (
                                            <span className="text-xs text-red-500 ml-1">(High)</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
