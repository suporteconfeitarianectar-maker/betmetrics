import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { TrialBanner } from '@/components/TrialBanner';
import { TrialExpiredModal } from '@/components/TrialExpiredModal';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isTrialActive, profile } = useAuth();
  const location = useLocation();
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Show modal when trial expires and user tries to access protected content
  useEffect(() => {
    const protectedPaths = ['/jogo/', '/jogos', '/ligas', '/historico', '/banca'];
    const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
    
    if (user && profile && profile.plan === 'FREE' && !isTrialActive && isProtectedPath) {
      setShowExpiredModal(true);
    }
  }, [user, profile, isTrialActive, location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <TrialBanner />
        <Header />
        <main className="pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
      <TrialExpiredModal 
        open={showExpiredModal} 
        onOpenChange={setShowExpiredModal} 
      />
    </div>
  );
}
