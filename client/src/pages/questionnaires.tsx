import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  BarChart3,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import type { QuestionTemplate, QuestionnaireResponse, Patient } from "@shared/schema";
import { motion } from "framer-motion";

export default function Questionnaires() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: templates = [] } = useQuery<QuestionTemplate[]>({
    queryKey: ["/api/question-templates"],
  });

  const { data: responses = [] } = useQuery<QuestionnaireResponse[]>({
    queryKey: ["/api/questionnaire-responses"],
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

  const categoryData = Object.entries(categoryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">문진 데이터 분석</h1>
          <p className="text-muted-foreground mt-1">
            사전 문진 템플릿 관리 및 응답 데이터 통계
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "준비 중", description: "템플릿 관리 기능은 추후 업데이트될 예정입니다." })}>
            <FileText className="w-4 h-4 mr-2" />
            템플릿 관리
          </Button>
          <Button onClick={() => window.location.href = "/api/download/questionnaires"}>
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">총 문진 항목</p>
                <p className="text-3xl font-bold">{templates.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">총 응답 수</p>
                <p className="text-3xl font-bold">{responses.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                <PieChartIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">카테고리 수</p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">통계 대시보드</TabsTrigger>
          <TabsTrigger value="items">문진 항목 목록</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 분포</CardTitle>
                <CardDescription>문진 항목의 카테고리별 비율입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 항목 수</CardTitle>
                <CardDescription>가장 많은 문진 항목을 포함한 카테고리입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="문진 항목 내용 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="카테고리" />
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
          </div>

          {/* Question List */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => {
                const responseCount = responsesByQuestion[template.id] || 0;
                const yesNo = yesNoStats[template.id];

                return (
                  <motion.div key={template.id} variants={item}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              {template.category && (
                                <Badge variant="secondary" className="font-medium">
                                  {template.category}
                                </Badge>
                              )}
                              {template.relatedBodyPart && (
                                <Badge variant="outline">
                                  {template.relatedBodyPart}
                                </Badge>
                              )}
                              <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                                {template.questionType || "yes_no"}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-2">{template.question}</h3>
                            {template.options && template.options.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {template.options.map((option, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-muted/50 text-muted-foreground font-normal">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Stats Section */}
                          <div className="w-full md:w-[300px] flex flex-col justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-muted-foreground">총 응답</span>
                              <span className="text-xl font-bold">{responseCount}건</span>
                            </div>

                            {yesNo ? (
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="flex items-center gap-1 text-green-600">
                                      <CheckCircle2 className="w-3 h-3" /> 예
                                    </span>
                                    <span className="font-medium">{yesNo.yes} ({Math.round(yesNo.yes / (yesNo.yes + yesNo.no) * 100)}%)</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500"
                                      style={{ width: `${(yesNo.yes / (yesNo.yes + yesNo.no)) * 100}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="flex items-center gap-1 text-red-500">
                                      <XCircle className="w-3 h-3" /> 아니오
                                    </span>
                                    <span className="font-medium">{yesNo.no} ({Math.round(yesNo.no / (yesNo.yes + yesNo.no) * 100)}%)</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-red-500"
                                      style={{ width: `${(yesNo.no / (yesNo.yes + yesNo.no)) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground text-sm gap-2">
                                <HelpCircle className="w-4 h-4" />
                                <span>응답 데이터 없음</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">검색 결과가 없습니다</h3>
                <p>검색어와 일치하는 문진 항목을 찾을 수 없습니다.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
