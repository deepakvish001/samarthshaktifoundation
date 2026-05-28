import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalCrudProvider } from "@/contexts/GlobalCrudContext";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Donation from "./pages/Donation";
import Partners from "./pages/Partners";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";
import RashtriyaGramSwarajAbhiyan from "./pages/RashtriyaGramSwarajAbhiyan";
import NSQF from "./pages/NSQF";
import AAIOE from "./pages/AAIOE";
import EntrepreneurshipDevelopment from "./pages/EntrepreneurshipDevelopment";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import MyCertificates from "./pages/MyCertificates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {!isAdminRoute && <Navigation />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/rashtiya-gram-swaraj-abhiyan" element={<RashtriyaGramSwarajAbhiyan />} />
        <Route path="/nsqf" element={<NSQF />} />
        <Route path="/aaioe" element={<AAIOE />} />
        <Route path="/entrepreneurship-development" element={<EntrepreneurshipDevelopment />} />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          } 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Authenticated user routes */}
        <Route path="/profile" element={<AuthGuard requireAuth={true}><Profile /></AuthGuard>} />
        <Route path="/my-courses" element={<AuthGuard requireAuth={true}><MyCourses /></AuthGuard>} />
        <Route path="/my-certificates" element={<AuthGuard requireAuth={true}><MyCertificates /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard requireAuth={true}><Settings /></AuthGuard>} />

        {/* Protected routes */}
        <Route 
          path="/admin/*" 
          element={
            <AuthGuard requireAuth={true} requireRole="admin">
              <Admin />
            </AuthGuard>
          } 
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <GlobalCrudProvider>
              <AppContent />
            </GlobalCrudProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;