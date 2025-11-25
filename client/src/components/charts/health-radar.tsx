import { useMemo } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestResult, ExamMaster } from "@shared/schema";

interface HealthRadarProps {
    testResults: TestResult[];
    examMaster: ExamMaster[];
}

export function HealthRadar({ testResults, examMaster }: HealthRadarProps) {
    const radarData = useMemo(() => {
        // Define categories
        const categories = [
            { key: "liver", label: "간 (Liver)" },
            { key: "kidney", label: "신장 (Kidney)" },
            { key: "heart", label: "심장 (Heart)" },
            { key: "pancreas", label: "췌장 (Pancreas)" }, // Changed from Skin/Joint for more common blood tests
            { key: "blood", label: "혈액 (Blood)" },
        ];

        // Calculate scores for each category
        // Score starts at 100. Deduct points for abnormal results (H or L).
        // This is a simplified logic.

        return categories.map((cat) => {
            // Find exams related to this category
            // We need to map exam codes to categories manually or use relatedBodyPart if available
            // For now, let's use a simple mapping based on common prefixes or relatedBodyPart

            const relatedExams = examMaster.filter(e =>
                e.relatedBodyPart?.toLowerCase().includes(cat.key) ||
                e.examCategory.toLowerCase().includes(cat.key)
            );

            const relatedExamCodes = relatedExams.map(e => e.examCode);

            // Get latest results for these exams
            const latestResults = relatedExamCodes.map(code => {
                const results = testResults
                    .filter(r => r.examCode === code)
                    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
                return results[0];
            }).filter(Boolean);

            if (latestResults.length === 0) {
                return { subject: cat.label, A: 100, fullMark: 100 }; // No data = Perfect score assumption or N/A
            }

            let abnormalCount = 0;
            latestResults.forEach(r => {
                if (r.status === "H" || r.status === "L") {
                    abnormalCount++;
                }
            });

            // Simple scoring: 100 - (abnormal count * 20), min 0
            const score = Math.max(0, 100 - (abnormalCount * 20));

            return {
                subject: cat.label,
                A: score,
                fullMark: 100,
            };
        });
    }, [testResults, examMaster]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>건강 위험 레이더 (Health Risk Radar)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                                name="건강 점수"
                                dataKey="A"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
