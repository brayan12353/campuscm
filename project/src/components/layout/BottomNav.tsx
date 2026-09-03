import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function BottomNav() {
  const { conversations, currentUser } = useApp();
  const navigate = useNavigate();
  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem to="/" icon={Home} label="Accueil" />
        <NavItem to="/explore" icon={Compass} label="Explorer" />
        <button
          onClick={() => navigate('/create-listing')}
          className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-colors"
          aria-label="Créer une annonce"
        >
          <Plus size={26} />
        </button>
        <NavItem to="/messages" icon={MessageSquare} label="Messages" badge={unreadCount} />
        <NavItem to={currentUser ? '/profile' : '/login'} icon={User} label="Profil" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon: Icon, label, badge }: { to: string; icon: React.ComponentType<{ size?: string | number }>; label: string; badge?: number }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => cn(
        'flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors relative',
        isActive ? 'text-primary-600' : 'text-gray-500',
      )}
    >
      <div className="relative">
        <Icon size={22} />
        {badge && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-error-500 text-white text-[10px] px-1 py-0.5 rounded-full min-w-[16px] text-center">
            {badge}
          </span>
        )}
      </div>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
