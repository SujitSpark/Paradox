import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import LoginPage from "@/components/LoginPage";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardPage from "@/pages/DashboardPage";
import PriorityPage from "@/pages/PriorityPage";
import DelayPatternsPage from "@/pages/DelayPatternsPage";
import EscalationPage from "@/pages/EscalationPage";
import CalendarPage from "@/pages/CalendarPage";
import UploadPage from "@/pages/UploadPage";
import ExportPage from "@/pages/ExportPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function DefaultRedirect() {
  const role = useAuthStore((s) => s.role);
  if (role === 'junior_judge') return <Navigate to="/priority" replace />;
  if (role === 'admin') return <Navigate to="/upload" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/priority" element={<PriorityPage />} />
            <Route path="/delay-patterns" element={<DelayPatternsPage />} />
            <Route path="/escalation" element={<EscalationPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const App = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          {isAuthenticated ? <AppLayout /> : <LoginPage />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
