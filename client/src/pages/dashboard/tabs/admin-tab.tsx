import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAdminData } from "@/lib/mock-dashboard-data";
import { AlertTriangle, ShieldAlert, Database, CheckCircle, RefreshCw } from "lucide-react";

export function AdminTab() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                    데이터 정합성 모니터링
                </h2>
                <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    전체 재검사
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Missing Data Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            필수 데이터 누락 ({mockAdminData.missingFields.length})
                        </CardTitle>
                        <CardDescription>
                            주요 임상 데이터 중 비어있는 항목입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Missing Field</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAdminData.missingFields.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                        <TableCell>{item.patient}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                                                {item.field}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                                수정
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Name Conflicts Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Database className="w-4 h-4 text-red-500" />
                            동일 개체명 중복 의심 ({mockAdminData.nameConflicts.length})
                        </CardTitle>
                        <CardDescription>
                            이름은 같지만 ID가 다른 개체들입니다. (오기입 가능성)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockAdminData.nameConflicts.map((conflict, i) => (
                                <div key={i} className="p-4 border rounded-lg bg-muted/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-lg">{conflict.name}</span>
                                        <Badge variant="destructive">{conflict.count}건 중복</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {conflict.ids.map((id) => (
                                            <Badge key={id} variant="secondary" className="font-mono">
                                                {id}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <Button size="sm" variant="secondary">병합 관리</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Terminology Mapping Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        용어 표준화 매핑 현황
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-1">검사 항목 매핑률</p>
                            <p className="text-2xl font-bold text-green-600">98.5%</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-1">품종 코드 매핑률</p>
                            <p className="text-2xl font-bold text-green-600">100%</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-1">미식별 용어</p>
                            <p className="text-2xl font-bold text-orange-500">3건</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
