import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium animate-slide-down">
      <WifiOff size={16} />
      Vous êtes hors connexion. Certaines fonctionnalités nécessitent Internet.
    </div>
  );
}
