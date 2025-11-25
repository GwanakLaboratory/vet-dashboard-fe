import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Upload, FileText, Activity, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function VisitDataEntry() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">데이터 추가 (새 방문)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* B-1: Basic Visit Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">방문일</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>날짜 선택</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">내원 사유</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="사유 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="checkup">정기 검진</SelectItem>
                                <SelectItem value="vaccination">예방 접종</SelectItem>
                                <SelectItem value="sick">질병 치료</SelectItem>
                                <SelectItem value="surgery">수술</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">담당의</label>
                        <Input placeholder="담당 수의사" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">병원/지점</label>
                        <Input placeholder="본원" />
                    </div>
                </div>

                {/* Tabs for B-2, B-3, B-4 */}
                <Tabs defaultValue="findings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="findings" className="gap-2">
                            <FileText className="w-4 h-4" /> 소견 및 문진
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="w-4 h-4" /> 문서 업로드
                        </TabsTrigger>
                        <TabsTrigger value="quantitative" className="gap-2">
                            <Activity className="w-4 h-4" /> 정량 데이터
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="findings" className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">의료진 소견</label>
                                <Textarea placeholder="진료 소견을 입력하세요..." className="h-32" />
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-xs h-7">Bold</Button>
                                    <Button variant="outline" size="sm" className="text-xs h-7">List</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">보호자 설명/문진</label>
                                <Textarea placeholder="보호자가 설명한 증상..." className="h-32" />
                                <div className="flex gap-2 flex-wrap">
                                    {["식욕부진", "구토", "설사", "기침"].map((chip) => (
                                        <span key={chip} className="px-2 py-1 bg-muted rounded-full text-xs cursor-pointer hover:bg-muted/80">
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="py-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/5 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm font-medium">PDF 또는 이미지를 드래그하여 업로드하세요</p>
                            <p className="text-xs text-muted-foreground mt-1">다중 파일 지원</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="quantitative" className="py-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">검사 결과 입력</h3>
                                <Button variant="outline" size="sm">엑셀 업로드</Button>
                            </div>
                            <div className="border rounded-md p-4 bg-muted/20 text-center text-sm text-muted-foreground">
                                주요 검사 항목 입력 폼 (ALT, AST, CREA 등)
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* B-5: Save Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline">취소</Button>
                    <Button className="gap-2">
                        <Save className="w-4 h-4" /> 이번 방문 저장
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
