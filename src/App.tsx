
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Colleges from "./pages/Colleges";
import CollegeDetails from "./pages/CollegeDetails";
import Courses from "./pages/Courses";
import RankPredictor from "./pages/RankPredictor";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import WbjeeDataUploader from "./pages/WbjeeDataUploader";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <div className="min-h-screen w-full">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/rank-predictor" element={<RankPredictor />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/wbjee-uploader"
                element={
                  <ProtectedRoute requireAdmin>
                    <WbjeeDataUploader />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </div>
  </QueryClientProvider>
);

export default App;
