import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Briefcase, Building2, Flag, TrendingUp, Eye, CheckCircle, XCircle, AlertTriangle, Ban, BadgeCheck, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { mockUsers, mockListings, mockJobs, mockHousing, mockReports, mockPayments } from '@/data/mock';
import { formatPrice, timeAgo } from '@/utils/format';
import { cn } from '@/utils/format';

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'listings', label: 'Annonces' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'reports', label: 'Signalements' },
  { id: 'revenue', label: 'Revenus' },
];

export function Admin() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmAction, setConfirmAction] = useState<{ action: string; target: string } | null>(null);

  if (!currentUser?.roles.includes('admin')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Shield size={48} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
        <p className="text-sm text-gray-500 mb-4">Vous n'avez pas les permissions d'accéder à cette page.</p>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    );
  }

  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { label: 'Utilisateurs', value: mockUsers.length, icon: Users, color: 'bg-primary-50 text-primary-600' },
    { label: 'Annonces', value: mockListings.length, icon: ShoppingBag, color: 'bg-accent-50 text-accent-600' },
    { label: 'Jobs', value: mockJobs.length, icon: Briefcase, color: 'bg-success-50 text-success-600' },
    { label: 'Logements', value: mockHousing.length, icon: Building2, color: 'bg-warning-50 text-warning-600' },
    { label: 'Signalements', value: mockReports.length, icon: Flag, color: 'bg-error-50 text-error-600' },
    { label: 'Revenus (démo)', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'bg-gray-50 text-gray-600' },
  ];

  const handleAction = (action: string, targetName: string) => {
    setConfirmAction({ action, target: targetName });
  };

  const executeAction = () => {
    showToast(`Action "${confirmAction?.action}" effectuée (Démo)`, 'success');
    setConfirmAction(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Administration CampusCM</h1>
          <p className="text-xs text-gray-500">Mode démonstration — Aucune action réelle</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors', activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
                  <stat.icon size={20} />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {mockReports.filter((r) => r.status === 'pending').length > 0 && (
            <div className="bg-warning-50 border border-warning-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-warning-600" />
                <h3 className="font-semibold text-warning-900">Signalements en attente</h3>
              </div>
              <p className="text-sm text-warning-800">{mockReports.filter((r) => r.status === 'pending').length} signalement(s) nécessitent une attention.</p>
              <button onClick={() => setActiveTab('reports')} className="text-sm text-warning-700 font-semibold mt-1 hover:underline">Voir les signalements →</button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Annonces récentes</h3>
            <div className="space-y-2">
              {mockListings.slice(0, 4).map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.title}</p>
                    <p className="text-xs text-gray-500">{l.sellerName} · {timeAgo(l.createdAt)}</p>
                  </div>
                  <Badge variant={l.status === 'approved' ? 'success' : l.status === 'pending' ? 'warning' : 'error'}>
                    {l.status === 'approved' ? 'Approuvée' : l.status === 'pending' ? 'En attente' : 'Rejetée'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Toutes les annonces ({mockListings.length})</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {mockListings.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.sellerName} · {formatPrice(l.price)} · {l.city}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={l.status === 'approved' ? 'success' : l.status === 'pending' ? 'warning' : 'error'}>
                      {l.status === 'approved' ? 'Approuvée' : l.status === 'pending' ? 'En attente' : 'Rejetée'}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-0.5"><Eye size={11} /> {l.views}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleAction('Approuver', l.title)} title="Approuver" className="p-2 rounded-lg hover:bg-success-50 text-success-600 transition-colors"><CheckCircle size={18} /></button>
                  <button onClick={() => handleAction('Rejeter', l.title)} title="Rejeter" className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors"><XCircle size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Utilisateurs ({mockUsers.length})</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {mockUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-100 shrink-0">
                  {u.avatarUrl ? <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary-600 text-sm">{u.fullName.charAt(0)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={u.verification === 'verified' ? 'success' : u.verification === 'pending' ? 'warning' : 'default'}>
                      {u.verification === 'verified' ? 'Vérifié' : u.verification === 'pending' ? 'En attente' : 'Non vérifié'}
                    </Badge>
                    {u.roles.includes('admin') && <Badge variant="error">Admin</Badge>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleAction('Vérifier', u.fullName)} title="Vérifier" className="p-2 rounded-lg hover:bg-success-50 text-success-600 transition-colors"><BadgeCheck size={18} /></button>
                  <button onClick={() => handleAction('Suspendre', u.fullName)} title="Suspendre" className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors"><Ban size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {mockReports.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={r.status === 'pending' ? 'warning' : r.status === 'reviewed' ? 'primary' : 'success'}>
                      {r.status === 'pending' ? 'En attente' : r.status === 'reviewed' ? 'En cours' : 'Résolu'}
                    </Badge>
                    <Badge variant="default">{r.reason}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Cible: {r.targetType} #{r.targetId} · {timeAgo(r.createdAt)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleAction('Résoudre signalement', r.id)} className="p-2 rounded-lg hover:bg-success-50 text-success-600 transition-colors"><CheckCircle size={18} /></button>
                  <button onClick={() => handleAction('Rejeter signalement', r.id)} className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors"><XCircle size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <div className="bg-warning-50 border border-warning-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-warning-600 shrink-0" />
            <p className="text-sm text-warning-800 font-medium">Revenus de démonstration — Ces montants ne représentent pas de revenus réels</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Abonnements', value: mockPayments.filter((p) => p.type === 'subscription').reduce((s, p) => s + p.amount, 0) },
              { label: 'Boosts', value: mockPayments.filter((p) => p.type === 'boost').reduce((s, p) => s + p.amount, 0) },
              { label: 'Mis en avant', value: mockPayments.filter((p) => p.type === 'featured').reduce((s, p) => s + p.amount, 0) },
              { label: 'Total', value: totalRevenue },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{formatPrice(item.value)}</p>
                <p className="text-[10px] text-warning-600 mt-1">DÉMO</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Transactions (démo)</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {mockPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.reference}</p>
                    <p className="text-xs text-gray-500">{p.type} · {timeAgo(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatPrice(p.amount)}</p>
                    <Badge variant="success">Démo</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeAction}
        title={`${confirmAction?.action} ?`}
        message={`Confirmer l'action "${confirmAction?.action}" sur "${confirmAction?.target}" ? (Mode démo)`}
        confirmLabel="Confirmer"
      />
    </div>
  );
}
