import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PatientRegistration } from "@/components/workspace/patient-registration";
import { VisitDataEntry } from "@/components/workspace/visit-data-entry";
import { VisitTimeline } from "@/components/workspace/visit-timeline";
import { PatientOverview } from "@/components/workspace/patient-overview";
import { QuantitativeResults } from "@/components/workspace/quantitative-results";
import { PreDiagnosisViewer } from "@/components/workspace/pre-diagnosis-viewer";
import { ImagingViewer } from "@/components/workspace/imaging-viewer";
import { DocumentViewer } from "@/components/workspace/document-viewer";
import { TrendChart } from "@/components/workspace/trend-chart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

export default function WorkspacePage() {
    const { toast } = useToast();
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

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
            "section-overview", "section-quantitative", "section-trend-chart",
            "section-imaging", "section-documents"
        ];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleNavigateToDocument = (docId: string) => {
        setSelectedDocId(docId);
        const el = document.getElementById("section-documents");
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavigateToLab = () => {
        const el = document.getElementById("section-quantitative");
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavigateToImaging = () => {
        const el = document.getElementById("section-imaging");
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
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
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-12 scroll-smooth">

                {/* Section D: Overview */}
                <section id="section-overview" className="scroll-mt-20">
                    <PatientOverview />
                </section>

                {/* Section C: Calendar */}
                <section id="section-calendar" className="scroll-mt-20">
                    <VisitTimeline
                        onNavigateToDocument={handleNavigateToDocument}
                        onNavigateToLab={handleNavigateToLab}
                        onNavigateToImaging={handleNavigateToImaging}
                    />
                </section>

                {/* Section E: Quantitative Results */}
                <section id="section-quantitative" className="space-y-6 scroll-mt-20">
                    <QuantitativeResults />
                </section>

                {/* Section E: Trend Chart */}
                <section id="section-trend-chart" className="space-y-6 scroll-mt-20">
                    <TrendChart />
                </section>

                {/* Section G: Imaging */}
                <section id="section-imaging" className="scroll-mt-20">
                    <ImagingViewer />
                </section>

                {/* Section H: Documents */}
                <section id="section-documents" className="scroll-mt-20">
                    <DocumentViewer selectedDocId={selectedDocId} />
                </section>

                {/* Section A: Registration (Collapsible) - HIDDEN */}
                {/* <section id="section-registration" className="scroll-mt-20">
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
                </section> */}

                {/* Section B: Data Entry (Collapsible) - HIDDEN */}
                {/* <section id="section-data-entry" className="scroll-mt-20">
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
                </section> */}
            </main>
        </div>
    );
}
