import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Home from "@/pages/home";
import Patients from "@/pages/patients";
import PatientDetail from "@/pages/patient-detail";
import Visits from "@/pages/visits";
import Questionnaires from "@/pages/questionnaires";
import TestResults from "@/pages/test-results";
import BodyModel from "@/pages/body-model";
import Filters from "@/pages/filters";
import DataManagement from "@/pages/data-management";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/patients" component={Patients} />
      <Route path="/patients/:animalNumber" component={PatientDetail} />
      <Route path="/visits" component={Visits} />
      <Route path="/questionnaires" component={Questionnaires} />
      <Route path="/test-results" component={TestResults} />
      <Route path="/body-model" component={BodyModel} />
      <Route path="/filters" component={Filters} />
      <Route path="/data-management" component={DataManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-background">
              <Router />
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
