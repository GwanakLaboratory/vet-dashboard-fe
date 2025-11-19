import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ClipboardList,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { QuestionTemplate, QuestionnaireResponse, Patient } from "@shared/schema";

export default function Questionnaires() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: templates = [] } = useQuery<QuestionTemplate[]>({
    queryKey: ["/api/question-templates"],
  });

  const { data: responses = [] } = useQuery<QuestionnaireResponse[]>({
    queryKey: ["/api/questionnaire-responses"],
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Get unique categories
  const categories = [...new Set(templates.map((t) => t.category).filter(Boolean))];

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Category statistics
  const categoryStats = templates.reduce((acc: Record<string, number>, template) => {
    const cat = template.category || "기타";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Response statistics
  const responsesByQuestion = responses.reduce((acc: Record<string, number>, response) => {
    acc[response.questionId] = (acc[response.questionId] || 0) + 1;
    return acc;
  }, {});

  // Yes/No response statistics for questions
  const yesNoStats = responses.reduce((acc: Record<string, { yes: number; no: number }>, response) => {
    if (response.response === "예" || response.response === "아니오") {
      if (!acc[response.questionId]) {
        acc[response.questionId] = { yes: 0, no: 0 };
      }
      if (response.response === "예") {
        acc[response.questionId].yes++;
      } else {
        acc[response.questionId].no++;
      }
    }
    return acc;
  }, {});

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--muted))"];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">문진 데이터</h1>
        <p className="text-sm text-muted-foreground">
          사전 문진 템플릿 및 응답 통계
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 문진 항목</p>
                <p className="text-2xl font-bold font-mono">{templates.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 응답 수</p>
                <p className="text-2xl font-bold font-mono">{responses.length}</p>
              </div>
              <PieChartIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">카테고리 수</p>
                <p className="text-2xl font-bold font-mono">{categories.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution Chart */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">카테고리별 문진 항목 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="문진 항목 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-questions"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Question Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>문진 항목 목록 ({filteredTemplates.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length > 0 ? (
            <div className="space-y-3">
              {filteredTemplates.map((template) => {
                const responseCount = responsesByQuestion[template.id] || 0;
                const yesNo = yesNoStats[template.id];

                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-border hover-elevate"
                    data-testid={`question-${template.id}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {template.category && (
                            <Badge variant="outline">{template.category}</Badge>
                          )}
                          {template.relatedBodyPart && (
                            <Badge variant="secondary">
                              {template.relatedBodyPart}
                            </Badge>
                          )}
                          <Badge variant="outline" className="font-mono text-xs">
                            {template.questionType || "yes_no"}
                          </Badge>
                        </div>
                        <p className="font-medium mb-1">{template.question}</p>
                        {template.options && template.options.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.options.map((option, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-muted-foreground mb-1">응답 수</p>
                        <p className="text-2xl font-bold font-mono">{responseCount}</p>
                      </div>
                    </div>

                    {/* Yes/No Statistics */}
                    {yesNo && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-muted-foreground">
                              예: {yesNo.yes}건
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-muted-foreground">
                              아니오: {yesNo.no}건
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${(yesNo.yes / (yesNo.yes + yesNo.no)) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "검색 결과가 없습니다"
                : "문진 항목이 없습니다"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
