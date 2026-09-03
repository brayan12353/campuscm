import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, MessageSquare, Plus, Settings, ChevronRight, Star, BadgeCheck, Crown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockListings } from '@/data/mock';

export function Dashboard() {
  const { currentUser, notifications } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Vous n'êtes pas connecté</h1>
        <Button onClick={() => navigate('/login')}>Se connecter</Button>
      </div>
    );
  }

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const myListings = mockListings.filter((l) => l.sellerId === currentUser.id);

  const planLabel: Record<string, string> = { free: 'Free', premium: 'Premium', business: 'Business' };
  const planColor: Record<string, 'default' | 'primary' | 'accent'> = { free: 'default', premium: 'primary', business: 'accent' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary-400 shrink-0">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">{currentUser.fullName.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-lg leading-tight">{currentUser.fullName}</h1>
              {currentUser.verification === 'verified' && <BadgeCheck size={18} className="text-accent-300" />}
            </div>
            <p className="text-primary-200 text-sm mt-0.5">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="neutral" className="bg-white/20 text-white text-xs">{planLabel[currentUser.subscriptionPlan]}</Badge>
              {currentUser.university && <span className="text-xs text-primary-200">{currentUser.university}</span>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-bold">{myListings.length}</p>
            <p className="text-xs text-primary-200">Annonces</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-bold">{currentUser.rating > 0 ? currentUser.rating.toFixed(1) : '—'}</p>
            <p className="text-xs text-primary-200 flex items-center justify-center gap-0.5"><Star size={10} /> Note</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-bold">{unreadNotifs}</p>
            <p className="text-xs text-primary-200">Notifs</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button onClick={() => navigate('/create-listing')} className="flex flex-col items-center gap-2 bg-primary-600 text-white rounded-2xl p-4 hover:bg-primary-700 transition-colors">
          <Plus size={22} />
          <span className="text-xs font-semibold">Créer une annonce</span>
        </button>
        <Link to="/my-listings" className="flex flex-col items-center gap-2 bg-white text-gray-700 rounded-2xl p-4 border border-gray-100 hover:border-primary-300 transition-colors text-center">
          <ShoppingBag size={22} className="text-primary-600" />
          <span className="text-xs font-semibold">Mes annonces</span>
        </Link>
        <Link to="/favorites" className="flex flex-col items-center gap-2 bg-white text-gray-700 rounded-2xl p-4 border border-gray-100 hover:border-primary-300 transition-colors text-center">
          <Heart size={22} className="text-error-500" />
          <span className="text-xs font-semibold">Favoris</span>
        </Link>
        <Link to="/messages" className="flex flex-col items-center gap-2 bg-white text-gray-700 rounded-2xl p-4 border border-gray-100 hover:border-primary-300 transition-colors text-center">
          <MessageSquare size={22} className="text-accent-600" />
          <span className="text-xs font-semibold">Messages</span>
        </Link>
      </div>

      {/* Upgrade banner for free users */}
      {currentUser.subscriptionPlan === 'free' && (
        <div className="bg-gradient-to-br from-warning-50 to-orange-50 border border-warning-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Crown size={28} className="text-warning-500 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Passez à Premium</p>
            <p className="text-xs text-gray-500">Annonces illimitées, visibilité prioritaire — 1 000 FCFA/mois</p>
          </div>
          <Link to="/subscription"><Button size="sm">Upgrade</Button></Link>
        </div>
      )}

      {/* Menu links */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[
          { to: '/profile', icon: BadgeCheck, label: 'Mon profil', sub: 'Modifier vos informations' },
          { to: '/my-listings', icon: ShoppingBag, label: 'Mes annonces', sub: `${myListings.length} annonce${myListings.length !== 1 ? 's' : ''}` },
          { to: '/favorites', icon: Heart, label: 'Mes favoris', sub: 'Annonces sauvegardées' },
          { to: '/messages', icon: MessageSquare, label: 'Messages', sub: 'Vos conversations' },
          { to: '/subscription', icon: Crown, label: 'Abonnement', sub: `Plan ${planLabel[currentUser.subscriptionPlan]}` },
          { to: '/settings', icon: Settings, label: 'Paramètres', sub: 'Compte et préférences' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <item.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 truncate">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
