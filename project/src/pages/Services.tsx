import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Wrench } from 'lucide-react';
import { mockServices } from '@/data/mock';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import type { ServiceCategory } from '@/types';

const categories: (ServiceCategory | 'Toutes')[] = ['Toutes', 'Web Development', 'Graphic Design', 'Video Editing', 'Photography', 'Writing', 'Translation', 'Computer Repair', 'Printing', 'Social Media Management', 'Delivery', 'Other'];

export function Services() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ServiceCategory | 'Toutes'>('Toutes');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockServices];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q));
    }
    if (category !== 'Toutes') result = result.filter((s) => s.category === category);
    if (maxPrice) result = result.filter((s) => s.priceFrom <= parseInt(maxPrice));
    return result;
  }, [search, category, maxPrice]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Services Étudiants</h1>
        <p className="text-sm text-gray-500">Trouvez des services proposés par des étudiants</p>
      </div>

      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un service..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
        <EmptyState icon={<Wrench size={48} />} title="Aucun service trouvé" description="Essayez de modifier vos filtres." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      )}

      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filtres" size="sm">
        <div className="space-y-4">
          <Select label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory | 'Toutes')}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix max (FCFA)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Ex: 50000" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => { setCategory('Toutes'); setMaxPrice(''); }}>Réinitialiser</Button>
            <Button fullWidth onClick={() => setShowFilters(false)}>Appliquer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
