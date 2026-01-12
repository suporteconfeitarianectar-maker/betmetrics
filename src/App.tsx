import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/jogos" element={<Jogos />} />
            <Route path="/jogo/:id" element={<JogoDetalhe />} />
            <Route path="/ligas" element={<Ligas />} />
            <Route path="/ligas/:id" element={<Ligas />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/banca" element={<Banca />} />
            <Route path="/conta" element={<Conta />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
