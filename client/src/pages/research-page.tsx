import { FlaskConical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResearchDashboard } from "@/components/research/research-dashboard";
import { useEffect } from "react";

export default function ResearchPage() {
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
            "section-visualization", "section-database", "section-ai"
        ];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center gap-4 px-4">
                    <div className="flex items-center gap-2 font-semibold">
                        <FlaskConical className="w-5 h-5" />
                        <span>연구 스튜디오</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 bg-muted/10 scroll-smooth">
                <ResearchDashboard />
            </main>
        </div>
    );
}
