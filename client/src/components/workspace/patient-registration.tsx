import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const patientSchema = z.object({
    name: z.string().min(1, "이름을 입력해주세요"),
    species: z.enum(["Canine", "Feline"]),
    breed: z.string().min(1, "품종을 입력해주세요"),
    gender: z.enum(["Male", "Female", "Neutered Male", "Spayed Female"]),
    birthDate: z.string().min(1, "생년월일을 입력해주세요"),
    ownerName: z.string().min(1, "보호자 이름을 입력해주세요"),
    ownerPhone: z.string().min(1, "연락처를 입력해주세요"),
    microchip: z.string().optional(),
    memo: z.string().optional(),
});

export function PatientRegistration() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof patientSchema>>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            species: "Canine",
            gender: "Male",
        },
    });

    function onSubmit(values: z.infer<typeof patientSchema>) {
        console.log(values);
        toast({
            title: "환자 등록 완료",
            description: `${values.name} 환자가 성공적으로 등록되었습니다.`,
        });
        // In a real app, we would save to DB and then trigger "Add Data" mode
    }

    return (
        <Card className="w-full border-l-4 border-l-primary">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        신규 환자 등록
                        {/* Duplicate check badge placeholder */}
                        <span className="text-xs font-normal px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full hidden">
                            유사 개체 존재
                        </span>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>이름 *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="동물명" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="species"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>종 *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="종 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Canine">개 (Canine)</SelectItem>
                                                    <SelectItem value="Feline">고양이 (Feline)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="breed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>품종 *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="품종 입력" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>성별 *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="성별 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">수컷 (Male)</SelectItem>
                                                    <SelectItem value="Female">암컷 (Female)</SelectItem>
                                                    <SelectItem value="Neutered Male">중성화 수컷 (NM)</SelectItem>
                                                    <SelectItem value="Spayed Female">중성화 암컷 (SF)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>생년월일 *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ownerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>보호자명 *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="보호자 이름" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ownerPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>연락처 *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="010-0000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="microchip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>마이크로칩</FormLabel>
                                            <FormControl>
                                                <Input placeholder="선택사항" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="memo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>메모</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="특이사항 메모" className="h-20" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button type="submit" className="gap-2">
                                    <Check className="w-4 h-4" /> 등록 완료
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            )}
        </Card>
    );
}
