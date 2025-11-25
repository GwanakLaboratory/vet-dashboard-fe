import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, FileText, Plus, User, ChevronDown, ChevronRight } from "lucide-react";
import { PatientRegistration } from "@/components/workspace/patient-registration";
import { VisitDataEntry } from "@/components/workspace/visit-data-entry";
import { VisitTimeline } from "@/components/workspace/visit-timeline";
import { PatientOverview } from "@/components/workspace/patient-overview";
import { QuantitativeResults } from "@/components/workspace/quantitative-results";
import { PreDiagnosisViewer } from "@/components/workspace/pre-diagnosis-viewer";
import { ImagingViewer } from "@/components/workspace/imaging-viewer";
import { DocumentViewer } from "@/components/workspace/document-viewer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

export default function WorkspacePage() {
    const { toast } = useToast();
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);

    // Scroll Spy Logic: Dispatch custom event for Sidebar to listen
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        window.dispatchEvent(new CustomEvent('workspace-scroll', { detail: entry.target.id }));
                    }
                });
            },
            { rootMargin: "-100px 0px -70% 0px" }
        );

        const sections = [
            "section-registration", "section-data-entry", "section-calendar",
            "section-overview", "section-quantitative", "section-pre-diagnosis",
            "section-imaging", "section-documents"
        ];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleQuickAction = (action: string) => {
        toast({
            title: action,
            description: `${action} 기능이 실행되었습니다.`,
        });
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center gap-4 px-4">
                    <div className="flex flex-1 items-center gap-2 md:gap-4">
                        <div className="relative flex-1 md:w-[300px] md:flex-none">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="환자 검색 (이름/번호/보호자)..."
                                className="h-9 pl-8 w-full md:w-[300px]"
                            />
                        </div>
                        <Button size="sm" className="h-9 gap-1" onClick={() => setIsRegistrationOpen(true)}>
                            <Plus className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                신규 등록
                            </span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleQuickAction("달력 보기")}>
                            <Calendar className="h-4 w-4" />
                            <span className="sr-only">달력 보기</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleQuickAction("파일 뷰")}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">파일 뷰</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-12 scroll-smooth">
                {/* Section A: Registration (Collapsible) */}
                <section id="section-registration" className="scroll-mt-20">
                    <Collapsible open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen} className="border rounded-lg bg-card">
                        <div className="flex items-center justify-between p-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <User className="w-5 h-5" /> 신규 등록
                            </h2>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0">
                                    {isRegistrationOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="p-4 pt-0">
                            <PatientRegistration />
                        </CollapsibleContent>
                    </Collapsible>
                </section>

                {/* Section B: Data Entry (Collapsible) */}
                <section id="section-data-entry" className="scroll-mt-20">
                    <Collapsible open={isDataEntryOpen} onOpenChange={setIsDataEntryOpen} className="border rounded-lg bg-card">
                        <div className="flex items-center justify-between p-4">
                            <h2 className="text-xl font-semibold">데이터 추가</h2>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0">
                                    {isDataEntryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="p-4 pt-0">
                            <VisitDataEntry />
                        </CollapsibleContent>
                    </Collapsible>
                </section>

                {/* Section C: Calendar */}
                <section id="section-calendar" className="space-y-4 scroll-mt-20">
                    <VisitTimeline />
                </section>

                {/* Section D: Overview */}
                <section id="section-overview" className="space-y-4 scroll-mt-20">
                    <h2 className="text-xl font-semibold">개체 Overview</h2>
                    <PatientOverview />
                </section>

                {/* Section E: Quantitative Results */}
                <section id="section-quantitative" className="space-y-4 scroll-mt-20">
                    <QuantitativeResults />
                </section>

                {/* Section F: Pre-diagnosis */}
                <section id="section-pre-diagnosis" className="space-y-4 scroll-mt-20">
                    <h2 className="text-xl font-semibold">문진 뷰어</h2>
                    <PreDiagnosisViewer />
                </section>

                {/* Section G: Imaging */}
                <section id="section-imaging" className="space-y-4 scroll-mt-20">
                    <ImagingViewer />
                </section>

                {/* Section H: Documents */}
                <section id="section-documents" className="space-y-4 scroll-mt-20">
                    <h2 className="text-xl font-semibold">문서(PDF) 뷰</h2>
                    <DocumentViewer />
                </section>
            </main>
        </div>
    );
}
