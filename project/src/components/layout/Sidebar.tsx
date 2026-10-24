import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, ShoppingBag, Briefcase, GraduationCap, Building2, Wrench,
  CalendarDays, FileText, Heart, MessageSquare, User, Settings,
  Shield, LogOut, Plus, LayoutDashboard,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/format';

const mainLinks = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/tutors', label: 'Tutorat', icon: GraduationCap },
  { to: '/housing', label: 'Logement', icon: Building2 },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/events', label: 'Événements', icon: CalendarDays },
];

const personalLinks = [
  { to: '/my-listings', label: 'Mes annonces', icon: FileText },
  { to: '/favorites', label: 'Favoris', icon: Heart },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
];

const accountLinks = [
  { to: '/profile', label: 'Profil', icon: User },
  { to: '/settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar() {
  const { currentUser, logout, conversations } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0);
  const isAdmin = currentUser?.roles.includes('admin');

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Impossible de vous déconnecter.',
        'error',
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
      <div className="p-5 border-b border-gray-100">
        <Logo size="md" />
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {mainLinks.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Personnel</div>
        {personalLinks.map((link) => (
          <SidebarLink key={link.to} {...link} badge={link.to === '/messages' ? unreadCount : undefined} />
        ))}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Compte</div>
        {accountLinks.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Administration</div>
            <SidebarLink to="/admin" label="Tableau de bord" icon={LayoutDashboard} />
            <SidebarLink to="/admin/reports" label="Signalements" icon={Shield} />
          </>
        )}
      </nav>
      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => navigate('/create-listing')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} /> Créer une annonce
        </button>
        {currentUser ? (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} /> {loggingOut ? 'Déconnexion...' : 'Déconnexion'}
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} /> Connexion
          </button>
        )}
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number }>;
  badge?: number;
}

function SidebarLink({ to, label, icon: Icon, badge }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
        isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50',
      )}
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="bg-error-500 text-white text-xs px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </NavLink>
  );
}
