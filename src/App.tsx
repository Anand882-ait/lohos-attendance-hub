
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Login";
import RoomList from "@/pages/RoomList";
import RoomDetails from "@/pages/RoomDetails";
import StudentDetails from "@/pages/StudentDetails";
import AttendancePage from "@/pages/AttendancePage";
import StudentAttendance from "@/pages/StudentAttendance";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/rooms" element={
              <ProtectedRoute>
                <RoomList />
              </ProtectedRoute>
            } />
            
            <Route path="/rooms/:id" element={
              <ProtectedRoute>
                <RoomDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/students/:id" element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/attendance" element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            } />
            
            <Route path="/attendance/student/:id" element={
              <ProtectedRoute>
                <StudentAttendance />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
