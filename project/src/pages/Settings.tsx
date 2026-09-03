import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, Shield, LogOut, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/config/app';
import { cn } from '@/utils/format';

export function Settings() {
  const { currentUser, logout, selectedCity, setSelectedCity } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [notifs, setNotifs] = useState({ messages: true, listings: true, jobs: true });

  if (!currentUser) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <Button onClick={() => navigate('/login')}>Se connecter</Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        {[
          { key: 'messages', label: 'Nouveaux messages', desc: 'Alertes pour les messages reçus' },
          { key: 'listings', label: 'Annonces', desc: 'Statut de vos annonces' },
          { key: 'jobs', label: 'Jobs', desc: 'Nouvelles offres correspondantes' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotifs((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              className={cn('w-11 h-6 rounded-full transition-colors relative', notifs[item.key as keyof typeof notifs] ? 'bg-primary-600' : 'bg-gray-200')}
            >
              <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform', notifs[item.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5')} />
            </button>
          </div>
        ))}
      </Section>

      {/* Localisation */}
      <Section title="Localisation" icon={Globe}>
        <div className="py-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville par défaut</label>
          <div className="flex flex-wrap gap-2">
            {APP_CONFIG.cities.map((city) => (
              <button key={city} onClick={() => { setSelectedCity(city); showToast(`Ville changée en ${city}`, 'success'); }} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', city === selectedCity ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                {city}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Confidentialité */}
      <Section title="Confidentialité" icon={Shield}>
        <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-900">Profil public</p>
            <p className="text-xs text-gray-500">Les autres utilisateurs peuvent voir votre profil</p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-900">Voir les Termes</p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </Section>

      {/* Compte */}
      <Section title="Compte" icon={LogOut}>
        <button onClick={() => setShowLogout(true)} className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors">
          <LogOut size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Se déconnecter</span>
        </button>
        <button onClick={() => setShowDelete(true)} className="w-full flex items-center gap-3 py-3 text-left hover:bg-error-50 rounded-xl px-1 transition-colors">
          <Trash2 size={18} className="text-error-600" />
          <span className="text-sm font-medium text-error-600">Supprimer mon compte</span>
        </button>
      </Section>

      <ConfirmDialog open={showLogout} onClose={() => setShowLogout(false)} onConfirm={() => { logout(); navigate('/'); }} title="Se déconnecter" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Déconnecter" />
      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { logout(); navigate('/'); showToast('Compte supprimé (Démo)', 'success'); }} title="Supprimer le compte" message="Cette action est irréversible en production. En démo, vous serez simplement déconnecté." confirmLabel="Supprimer" danger />
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: string | number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
