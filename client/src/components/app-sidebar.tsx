import {
  Home,
  Dog,
  Calendar,
  ClipboardList,
  TestTube,
  View,
  Filter,
  Upload,
  Activity,
} from "lucide-react";
import { Link, useLocation } from "wouter";
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "홈 대시보드",
    url: "/",
    icon: Home,
  },
  {
    title: "환자 관리",
    url: "/patients",
    icon: Dog,
  },
  {
    title: "방문 기록",
    url: "/visits",
    icon: Calendar,
  },
  {
    title: "문진 데이터",
    url: "/questionnaires",
    icon: ClipboardList,
  },
  {
    title: "검사 결과",
    url: "/test-results",
    icon: TestTube,
  },
  {
    title: "3D 신체 모델",
    url: "/body-model",
    icon: View,
  },
  {
    title: "필터 & 군집",
    url: "/filters",
    icon: Filter,
  },
  {
    title: "데이터 관리",
    url: "/data-management",
    icon: Upload,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

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
