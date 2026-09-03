import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react';
import { mockJobs } from '@/data/mock';
import { JobCard } from '@/components/cards/JobCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { APP_CONFIG } from '@/config/app';
import type { JobCategory } from '@/types';

const categories: (JobCategory | 'Toutes')[] = ['Toutes', 'Part-time', 'Freelance', 'Event work', 'Delivery', 'Programming', 'Graphic Design', 'Marketing', 'Photography', 'Tutoring', 'Customer Service', 'Other'];

export function Jobs() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<JobCategory | 'Toutes'>('Toutes');
  const [city, setCity] = useState('Toutes');
  const [maxBudget, setMaxBudget] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = mockJobs.filter((j) => j.status === 'approved');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
    }
    if (category !== 'Toutes') result = result.filter((j) => j.category === category);
    if (city !== 'Toutes') result = result.filter((j) => j.city === city);
    if (maxBudget) result = result.filter((j) => j.budget <= parseInt(maxBudget));
    return result;
  }, [search, category, city, maxBudget]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Jobs Étudiants</h1>
        <p className="text-sm text-gray-500">Trouvez des opportunités adaptées à votre emploi du temps</p>
      </div>

      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un job..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(true)}><SlidersHorizontal size={18} /></Button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Briefcase size={48} />} title="Aucun job correspondant" description="Modifiez vos filtres pour trouver des opportunités." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}

      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filtres" size="sm">
        <div className="space-y-4">
          <Select label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as JobCategory | 'Toutes')}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select label="Ville" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="Toutes">Toutes les villes</option>
            {APP_CONFIG.cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget max (FCFA)</label>
            <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} placeholder="Ex: 100000" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => { setCategory('Toutes'); setCity('Toutes'); setMaxBudget(''); }}>Réinitialiser</Button>
            <Button fullWidth onClick={() => setShowFilters(false)}>Appliquer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
