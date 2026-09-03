import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag, Briefcase, GraduationCap, Building2, Wrench, CalendarDays, Clock, X } from 'lucide-react';
import { mockListings, mockJobs, mockTutors, mockHousing, mockServices, mockEvents } from '@/data/mock';
import { ListingCard } from '@/components/cards/ListingCard';
import { JobCard } from '@/components/cards/JobCard';
import { TutorCard } from '@/components/cards/TutorCard';
import { HousingCard } from '@/components/cards/HousingCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { normalizeAccents } from '@/utils/format';

const RECENT_KEY = 'campuscm_recent_searches';
const MAX_RECENT = 5;

const categories = [
  { id: 'all', label: 'Tout', icon: Search },
  { id: 'listings', label: 'Marketplace', icon: ShoppingBag },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'tutors', label: 'Tuteurs', icon: GraduationCap },
  { id: 'housing', label: 'Logement', icon: Building2 },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'events', label: 'Événements', icon: CalendarDays },
];

const popular = ['HP EliteBook', 'Logement étudiant', 'Community Manager', 'Cours de maths', 'Développeur React'];

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
  });

  const normalize = (s: string) => normalizeAccents(s);

  const saveRecent = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((r) => r !== term)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handleSearch = (term: string) => {
    setQuery(term);
    setActiveQuery(term);
    saveRecent(term);
    setSearchParams(term ? { q: term } : {});
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  };

  useEffect(() => {
    if (initialQuery) { setActiveQuery(initialQuery); }
  }, [initialQuery]);

  const results = useMemo(() => {
    if (!activeQuery.trim()) return null;
    const q = normalize(activeQuery);
    return {
      listings: mockListings.filter((l) => l.status === 'approved' && (normalize(l.title).includes(q) || normalize(l.description).includes(q))),
      jobs: mockJobs.filter((j) => normalize(j.title).includes(q) || normalize(j.description).includes(q)),
      tutors: mockTutors.filter((t) => normalize(t.name).includes(q) || normalize(t.subject).includes(q)),
      housing: mockHousing.filter((h) => normalize(h.title).includes(q) || normalize(h.neighborhood).includes(q)),
      services: mockServices.filter((s) => normalize(s.title).includes(q) || normalize(s.provider).includes(q)),
      events: mockEvents.filter((e) => normalize(e.name).includes(q) || normalize(e.description).includes(q)),
    };
  }, [activeQuery]);

  const totalResults = results ? Object.values(results).reduce((s, r) => s + r.length, 0) : 0;

  const filteredResults = results ? (
    activeCategory === 'all' ? results :
    activeCategory === 'listings' ? { ...results, jobs: [], tutors: [], housing: [], services: [], events: [] } :
    activeCategory === 'jobs' ? { ...results, listings: [], tutors: [], housing: [], services: [], events: [] } :
    activeCategory === 'tutors' ? { ...results, listings: [], jobs: [], housing: [], services: [], events: [] } :
    activeCategory === 'housing' ? { ...results, listings: [], jobs: [], tutors: [], services: [], events: [] } :
    activeCategory === 'services' ? { ...results, listings: [], jobs: [], tutors: [], housing: [], events: [] } :
    { ...results, listings: [], jobs: [], tutors: [], housing: [], services: [] }
  ) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Explorer</h1>

      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); }}
          placeholder="Que recherchez-vous ?"
          className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          autoFocus
        />
        {query && (
          <button onClick={() => { setQuery(''); setActiveQuery(''); setSearchParams({}); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {!activeQuery && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Recherches récentes</h3>
                <button onClick={clearRecent} className="text-xs text-primary-600">Effacer</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((r) => (
                  <button key={r} onClick={() => handleSearch(r)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                    <Clock size={14} className="text-gray-400" /> {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Recherches populaires</h3>
            <div className="flex flex-wrap gap-2">
              {popular.map((p) => (
                <button key={p} onClick={() => handleSearch(p)} className="px-3 py-1.5 rounded-full bg-primary-50 text-sm text-primary-700 font-medium hover:bg-primary-100 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Catégories</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.slice(1).map((cat) => (
                <Link key={cat.id} to={`/${cat.id === 'listings' ? 'marketplace' : cat.id}`} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-center hover:border-primary-300 transition-colors">
                  <cat.icon size={20} className="text-primary-600" />
                  <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeQuery && filteredResults && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{totalResults}</span> résultat{totalResults !== 1 ? 's' : ''} pour "<span className="text-primary-600">{activeQuery}</span>"</p>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {totalResults === 0 ? (
            <EmptyState icon={<Search size={48} />} title="Aucun résultat" description={`Aucun résultat pour "${activeQuery}". Essayez un autre mot-clé.`} />
          ) : (
            <div className="space-y-6">
              {filteredResults.listings.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><ShoppingBag size={18} /> Marketplace ({filteredResults.listings.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredResults.listings.slice(0, 6).map((l) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </section>
              )}
              {filteredResults.jobs.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Briefcase size={18} /> Jobs ({filteredResults.jobs.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredResults.jobs.slice(0, 4).map((j) => <JobCard key={j.id} job={j} />)}
                  </div>
                </section>
              )}
              {filteredResults.tutors.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><GraduationCap size={18} /> Tuteurs ({filteredResults.tutors.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredResults.tutors.slice(0, 3).map((t) => <TutorCard key={t.id} tutor={t} />)}
                  </div>
                </section>
              )}
              {filteredResults.housing.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Building2 size={18} /> Logements ({filteredResults.housing.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredResults.housing.slice(0, 4).map((h) => <HousingCard key={h.id} housing={h} />)}
                  </div>
                </section>
              )}
              {filteredResults.events.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CalendarDays size={18} /> Événements ({filteredResults.events.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredResults.events.slice(0, 4).map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
