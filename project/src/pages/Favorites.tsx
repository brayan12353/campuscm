import { useMemo, useState } from 'react';
import { Heart, ShoppingBag, Briefcase, GraduationCap, Building2, Wrench, CalendarDays } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/cards/ListingCard';
import { JobCard } from '@/components/cards/JobCard';
import { TutorCard } from '@/components/cards/TutorCard';
import { HousingCard } from '@/components/cards/HousingCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { mockListings, mockJobs, mockTutors, mockHousing, mockServices, mockEvents } from '@/data/mock';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/format';

const tabs = [
  { id: 'listing', label: 'Annonces', icon: ShoppingBag },
  { id: 'job', label: 'Jobs', icon: Briefcase },
  { id: 'tutor', label: 'Tuteurs', icon: GraduationCap },
  { id: 'housing', label: 'Logement', icon: Building2 },
  { id: 'service', label: 'Services', icon: Wrench },
  { id: 'event', label: 'Événements', icon: CalendarDays },
] as const;

type TabId = typeof tabs[number]['id'];

export function Favorites() {
  const { favorites } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('listing');

  const favListings = useMemo(() => mockListings.filter((l) => favorites.some((f) => f.targetType === 'listing' && f.targetId === l.id)), [favorites]);
  const favJobs = useMemo(() => mockJobs.filter((j) => favorites.some((f) => f.targetType === 'job' && f.targetId === j.id)), [favorites]);
  const favTutors = useMemo(() => mockTutors.filter((t) => favorites.some((f) => f.targetType === 'tutor' && f.targetId === t.id)), [favorites]);
  const favHousing = useMemo(() => mockHousing.filter((h) => favorites.some((f) => f.targetType === 'housing' && f.targetId === h.id)), [favorites]);
  const favServices = useMemo(() => mockServices.filter((s) => favorites.some((f) => f.targetType === 'service' && f.targetId === s.id)), [favorites]);
  const favEvents = useMemo(() => mockEvents.filter((e) => favorites.some((f) => f.targetType === 'event' && f.targetId === e.id)), [favorites]);

  const counts: Record<TabId, number> = { listing: favListings.length, job: favJobs.length, tutor: favTutors.length, housing: favHousing.length, service: favServices.length, event: favEvents.length };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mes favoris</h1>

      {total === 0 ? (
        <EmptyState
          icon={<Heart size={48} />}
          title="Aucun favori pour le moment"
          description="Sauvegardez des annonces, jobs, logements et plus en cliquant sur le cœur."
          action={<Button onClick={() => navigate('/marketplace')}>Parcourir la marketplace</Button>}
        />
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors', activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200')}>
                <tab.icon size={12} /> {tab.label} {counts[tab.id] > 0 && `(${counts[tab.id]})`}
              </button>
            ))}
          </div>

          {activeTab === 'listing' && (favListings.length === 0 ? <EmptyState icon={<ShoppingBag size={40} />} title="Aucune annonce sauvegardée" /> : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{favListings.map((l) => <ListingCard key={l.id} listing={l} />)}</div>)}
          {activeTab === 'job' && (favJobs.length === 0 ? <EmptyState icon={<Briefcase size={40} />} title="Aucun job sauvegardé" /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>)}
          {activeTab === 'tutor' && (favTutors.length === 0 ? <EmptyState icon={<GraduationCap size={40} />} title="Aucun tuteur sauvegardé" /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favTutors.map((t) => <TutorCard key={t.id} tutor={t} />)}</div>)}
          {activeTab === 'housing' && (favHousing.length === 0 ? <EmptyState icon={<Building2 size={40} />} title="Aucun logement sauvegardé" /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favHousing.map((h) => <HousingCard key={h.id} housing={h} />)}</div>)}
          {activeTab === 'service' && (favServices.length === 0 ? <EmptyState icon={<Wrench size={40} />} title="Aucun service sauvegardé" /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favServices.map((s) => <ServiceCard key={s.id} service={s} />)}</div>)}
          {activeTab === 'event' && (favEvents.length === 0 ? <EmptyState icon={<CalendarDays size={40} />} title="Aucun événement sauvegardé" /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favEvents.map((e) => <EventCard key={e.id} event={e} />)}</div>)}
        </>
      )}
    </div>
  );
}
