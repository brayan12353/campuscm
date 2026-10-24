import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import { mockListings } from '@/data/mock';
import { ListingCard } from '@/components/cards/ListingCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import type { ListingCategory, ListingCondition } from '@/types';
import { APP_CONFIG } from '@/config/app';

const categories: (ListingCategory | 'Toutes')[] = ['Toutes', 'Electronics', 'Phones', 'Computers', 'Books', 'Fashion', 'Furniture', 'Accessories', 'School supplies', 'Services', 'Other'];
const conditions: (ListingCondition | 'Toutes')[] = ['Toutes', 'New', 'Like New', 'Good', 'Used'];
const sortOptions = [
  { value: 'newest', label: 'Plus récentes' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
];

export function Marketplace() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<ListingCategory | 'Toutes'>('Toutes');
  const [condition, setCondition] = useState<ListingCondition | 'Toutes'>('Toutes');
  const [city, setCity] = useState('Toutes');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = mockListings.filter((l) => l.status === 'approved');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (category !== 'Toutes') result = result.filter((l) => l.category === category);
    if (condition !== 'Toutes') result = result.filter((l) => l.condition === condition);
    if (city !== 'Toutes') result = result.filter((l) => l.city === city);
    if (minPrice) result = result.filter((l) => l.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((l) => l.price <= parseInt(maxPrice));
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [search, category, condition, city, minPrice, maxPrice, sort]);

  const resetFilters = () => {
    setCategory('Toutes'); setCondition('Toutes'); setCity('Toutes');
    setMinPrice(''); setMaxPrice(''); setSort('newest');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketplace</h1>
        <p className="text-sm text-gray-500">Achetez et vendez entre étudiants</p>
      </div>

      {/* Search + filter bar */}
      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={18} /> <span className="hidden sm:inline">Filtres</span>
          </Button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={48} />}
          title="Aucune annonce trouvée"
          description="Essayez de modifier vos filtres ou votre recherche."
          action={<Button onClick={resetFilters} variant="outline">Réinitialiser les filtres</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Filter modal */}
      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filtres">
        <div className="space-y-4">
          <Select label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as ListingCategory | 'Toutes')}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select label="État" value={condition} onChange={(e) => setCondition(e.target.value as ListingCondition | 'Toutes')}>
            {conditions.map((c) => <option key={c} value={c}>{c === 'New' ? 'Neuf' : c === 'Like New' ? 'Comme neuf' : c === 'Good' ? 'Bon' : c === 'Used' ? 'Utilisé' : c}</option>)}
          </Select>
          <Select label="Ville" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="Toutes">Toutes les villes</option>
            {APP_CONFIG.cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix min</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix max</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="∞" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <Select label="Trier par" value={sort} onChange={(e) => setSort(e.target.value)}>
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={resetFilters}>Réinitialiser</Button>
            <Button fullWidth onClick={() => setShowFilters(false)}>Appliquer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
