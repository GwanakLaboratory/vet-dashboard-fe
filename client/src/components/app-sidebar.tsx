import {
  LayoutDashboard,
  Activity,
  TestTube,
  UserPlus,
  FileInput,
  Calendar as CalendarIcon,
  Layout,
  FileBarChart,
  Stethoscope,
  ImageIcon,
  FileText,
  GitGraph,
  GitGraphIcon,
  PieChart,
  Database,
  Bot,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "개체 워크스페이스", url: "/workspace", icon: LayoutDashboard },
  { title: "연구 스튜디오", url: "/research", icon: TestTube },
];

const workspaceSubItems = [
  { title: "개체 요약", id: "section-overview", icon: Layout },
  { title: "방문 기록", id: "section-calendar", icon: CalendarIcon },
  { title: "검진 결과", id: "section-quantitative", icon: FileBarChart },
  { title: "추적 검사 그래프", id: "section-trend-chart", icon: GitGraphIcon },
  { title: "영상 및 소견", id: "section-imaging", icon: ImageIcon },
  { title: "문서(PDF) 뷰", id: "section-documents", icon: FileText },
  // { title: "신규 등록", id: "section-registration", icon: UserPlus },
  // { title: "데이터 추가", id: "section-data-entry", icon: FileInput },
];

const researchSubItems = [
  { title: "데이터 시각화", id: "section-visualization", icon: PieChart },
  { title: "환자 데이터베이스", id: "section-database", icon: Database },
  { title: "AI 분석", id: "section-ai", icon: Bot },
];

export function AppSidebar() {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScrollEvent = (e: CustomEvent) => {
      setActiveSection(e.detail);
    };

    window.addEventListener('workspace-scroll', handleScrollEvent as EventListener);
    return () => {
      window.removeEventListener('workspace-scroll', handleScrollEvent as EventListener);
    };
  }, []);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Manually set active section for immediate feedback
      setActiveSection(id);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-sidebar-foreground">
              SNU 반려동물
            </h2>
            <p className="text-xs text-muted-foreground">검진센터 EMR</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>진료 관리</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Sub-navigation for Workspace */}
                    {item.url === "/workspace" && isActive && (
                      <SidebarMenuSub>
                        {workspaceSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => handleScrollToSection(subItem.id)}
                              isActive={activeSection === subItem.id}
                              className="cursor-pointer transition-colors"
                            >
                              <subItem.icon className="w-3 h-3 mr-2" />
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}

                    {/* Sub-navigation for Research */}
                    {item.url === "/research" && isActive && (
                      <SidebarMenuSub>
                        {researchSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => handleScrollToSection(subItem.id)}
                              isActive={activeSection === subItem.id}
                              className="cursor-pointer transition-colors"
                            >
                              <subItem.icon className="w-3 h-3 mr-2" />
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
