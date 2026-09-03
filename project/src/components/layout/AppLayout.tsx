import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { Footer } from './Footer';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { OfflineDetector } from '@/components/pwa/OfflineDetector';
import { Onboarding } from '@/components/pwa/Onboarding';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BottomNav />
      <InstallPrompt />
      <OfflineDetector />
      <Onboarding />
    </div>
  );
}
