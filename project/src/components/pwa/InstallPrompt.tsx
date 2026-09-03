import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('campuscm_install_dismissed');
    if (dismissed === 'true') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('campuscm_install_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 relative">
        <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <X size={16} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
            <Smartphone size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-900">Installer CampusCM</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ajoutez CampusCM à votre écran d'accueil pour un accès rapide.</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall}><Download size={14} /> Installer</Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>Plus tard</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
