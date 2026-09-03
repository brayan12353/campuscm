import { useState, useMemo } from 'react';
import { Search, CalendarDays } from 'lucide-react';
import { mockEvents } from '@/data/mock';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { APP_CONFIG } from '@/config/app';

const categories = ['Tous', 'Culture', 'Tech', 'Musique', 'Sport', 'Autres'];

export function Events() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [city, setCity] = useState('Toutes');

  const filtered = useMemo(() => {
    let result = [...mockEvents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (category !== 'Tous') result = result.filter((e) => e.category === category);
    if (city !== 'Toutes') result = result.filter((e) => e.city === city);
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [search, category, city]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Événements</h1>
        <p className="text-sm text-gray-500">Découvrez les événements près de votre campus</p>
      </div>

      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un événement..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {['Toutes', ...APP_CONFIG.cities].map((c) => (
          <button key={c} onClick={() => setCity(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${city === c ? 'bg-accent-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays size={48} />} title="Aucun événement trouvé" description="Vérifiez vos filtres ou revenez plus tard." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}
