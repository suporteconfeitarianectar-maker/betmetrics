import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Jogos from "./pages/Jogos";
import Ligas from "./pages/Ligas";
import Historico from "./pages/Historico";
import Banca from "./pages/Banca";
import Conta from "./pages/Conta";
import JogoDetalhe from "./pages/JogoDetalhe";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route - Auth page */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/jogos" element={
              <ProtectedRoute>
                <Jogos />
              </ProtectedRoute>
            } />
            <Route path="/jogo/:id" element={
              <ProtectedRoute>
                <JogoDetalhe />
              </ProtectedRoute>
            } />
            <Route path="/ligas" element={
              <ProtectedRoute>
                <Ligas />
              </ProtectedRoute>
            } />
            <Route path="/ligas/:id" element={
              <ProtectedRoute>
                <Ligas />
              </ProtectedRoute>
            } />
            <Route path="/historico" element={
              <ProtectedRoute>
                <Historico />
              </ProtectedRoute>
            } />
            <Route path="/banca" element={
              <ProtectedRoute>
                <Banca />
              </ProtectedRoute>
            } />
            <Route path="/conta" element={
              <ProtectedRoute>
                <Conta />
              </ProtectedRoute>
            } />
            
            {/* 404 - Also protected to prevent any unauthenticated access */}
            <Route path="*" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
