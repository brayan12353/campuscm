import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { APP_CONFIG } from '@/config/app';
import { cn } from '@/utils/format';

export function Header() {
  const { notifications, selectedCity, setSelectedCity, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCity(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3 px-4 h-16">
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Que recherchez-vous ?"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <div ref={cityRef} className="relative">
            <button
              onClick={() => setShowCity(!showCity)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MapPin size={16} className="text-primary-600" />
              <span className="hidden sm:inline">{selectedCity}</span>
            </button>
            {showCity && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down z-50">
                {APP_CONFIG.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => { setSelectedCity(city); setShowCity(false); }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                      city === selectedCity && 'text-primary-600 font-semibold',
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 animate-slide-down z-50 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border-b border-gray-50">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-xs text-primary-600 font-medium">
                      Tout marquer lu
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">Aucune notification</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <Link
                      key={n.id}
                      to={n.link || '#'}
                      onClick={() => setShowNotifs(false)}
                      className={cn('block p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors', !n.read && 'bg-primary-50/30')}
                    >
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
