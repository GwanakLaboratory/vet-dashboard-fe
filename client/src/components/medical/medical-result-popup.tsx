import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, AlertTriangle, CheckCircle, ArrowDown, ArrowUp } from "lucide-react";
import { medicalKnowledgeBase } from "@/lib/medical-data";

interface MedicalResultPopupProps {
    columnKey: string;
    value: string | number;
    referenceRange?: { min: number; max: number };
    description?: string;
    testName?: string;
    children: React.ReactNode;
}

export function MedicalResultPopup({ columnKey, value, referenceRange, description, testName, children }: MedicalResultPopupProps) {
    const info = medicalKnowledgeBase[columnKey];

    // If no medical info is found and no description provided, just render the children without popup
    if (!info && !description) {
        return <>{children}</>;
    }

    const numValue = Number(value);
    let status: 'Normal' | 'High' | 'Low' = 'Normal';

    if (referenceRange) {
        if (numValue < referenceRange.min) status = 'Low';
        else if (numValue > referenceRange.max) status = 'High';
    }

    const getStatusColor = (s: typeof status) => {
        switch (s) {
            case 'High': return 'text-red-600';
            case 'Low': return 'text-blue-600';
            default: return 'text-green-600';
        }
    };

    const getStatusIcon = (s: typeof status) => {
        switch (s) {
            case 'High': return <ArrowUp className="w-4 h-4 mr-1" />;
            case 'Low': return <ArrowDown className="w-4 h-4 mr-1" />;
            default: return <CheckCircle className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild className="cursor-pointer hover:underline decoration-dashed underline-offset-4">
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {info?.name || testName || columnKey}
                        <Badge variant={status === 'Normal' ? 'outline' : 'destructive'} className={status === 'Low' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200' : ''}>
                            {status}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {description || info?.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">측정값</div>
                        <div className={`text-2xl font-bold flex items-center ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            {value}
                        </div>
                    </div>

                    {referenceRange && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">정상 범위</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-mono">{referenceRange.min}</span>
                                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden relative">
                                    {/* Range Indicator Bar */}
                                    <div className="absolute top-0 bottom-0 bg-green-500/20 w-full" />
                                    {/* Value Marker */}
                                    <div
                                        className={`absolute top-0 bottom-0 w-2 rounded-full ${status === 'High' ? 'bg-red-500' : status === 'Low' ? 'bg-blue-500' : 'bg-green-500'}`}
                                        style={{
                                            left: `${Math.min(100, Math.max(0, ((numValue - (referenceRange.min * 0.8)) / ((referenceRange.max * 1.2) - (referenceRange.min * 0.8))) * 100))}%`
                                        }}
                                    />
                                </div>
                                <span className="font-mono">{referenceRange.max}</span>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {info?.interpretation && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Info className="w-4 h-4 text-primary" />
                                임상적 소견
                            </div>
                            <div className="text-sm bg-primary/5 p-3 rounded-md border border-primary/10">
                                {status === 'High' ? info.interpretation.high :
                                    status === 'Low' ? info.interpretation.low :
                                        info.interpretation.normal}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
