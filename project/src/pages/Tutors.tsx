import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, GraduationCap, Monitor } from 'lucide-react';
import { mockTutors } from '@/data/mock';
import { TutorCard } from '@/components/cards/TutorCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import type { TutorSubject } from '@/types';

const subjects: (TutorSubject | 'Toutes')[] = ['Toutes', 'Mathematics', 'Physics', 'Chemistry', 'Programming', 'English', 'French', 'Economics', 'Law', 'Engineering', 'Statistics', 'Computer Science'];

export function Tutors() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState<TutorSubject | 'Toutes'>('Toutes');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockTutors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (subject !== 'Toutes') result = result.filter((t) => t.subject === subject);
    if (onlineOnly) result = result.filter((t) => t.online);
    if (maxPrice) result = result.filter((t) => t.pricePerHour <= parseInt(maxPrice));
    return result;
  }, [search, subject, onlineOnly, maxPrice]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tuteurs</h1>
        <p className="text-sm text-gray-500">Trouvez un tuteur pour vous aider dans vos cours</p>
      </div>

      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un tuteur..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(true)}><SlidersHorizontal size={18} /></Button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {subjects.map((s) => (
          <button key={s} onClick={() => setSubject(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${subject === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setOnlineOnly(!onlineOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${onlineOnly ? 'bg-accent-600 text-white border-accent-600' : 'bg-white text-gray-600 border-gray-200'}`}>
          <Monitor size={12} /> En ligne seulement
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<GraduationCap size={48} />} title="Aucun tuteur trouvé" description="Essayez de modifier vos filtres." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
        </div>
      )}

      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filtres" size="sm">
        <div className="space-y-4">
          <Select label="Matière" value={subject} onChange={(e) => setSubject(e.target.value as TutorSubject | 'Toutes')}>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix max/heure (FCFA)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Ex: 5000" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} className="rounded" />
            <span className="text-sm text-gray-700">Cours en ligne uniquement</span>
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => { setSubject('Toutes'); setMaxPrice(''); setOnlineOnly(false); }}>Réinitialiser</Button>
            <Button fullWidth onClick={() => setShowFilters(false)}>Appliquer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
