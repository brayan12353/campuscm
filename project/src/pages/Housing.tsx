import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { mockHousing } from '@/data/mock';
import { HousingCard } from '@/components/cards/HousingCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { APP_CONFIG } from '@/config/app';
import { mockUniversities } from '@/data/mock';

export function Housing() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Toutes');
  const [university, setUniversity] = useState('Toutes');
  const [maxPrice, setMaxPrice] = useState('');
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [internetRequired, setInternetRequired] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockHousing];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((h) => h.title.toLowerCase().includes(q) || h.neighborhood.toLowerCase().includes(q));
    }
    if (city !== 'Toutes') result = result.filter((h) => h.city === city);
    if (university !== 'Toutes') result = result.filter((h) => h.university === university);
    if (maxPrice) result = result.filter((h) => h.pricePerMonth <= parseInt(maxPrice));
    if (furnishedOnly) result = result.filter((h) => h.furnished);
    if (internetRequired) result = result.filter((h) => h.internet);
    if (verifiedOnly) result = result.filter((h) => h.verification === 'verified');
    return result;
  }, [search, city, university, maxPrice, furnishedOnly, internetRequired, verifiedOnly]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Logement Étudiant</h1>
        <p className="text-sm text-gray-500">Trouvez un logement proche de votre campus</p>
      </div>

      <div className="sticky top-16 z-20 bg-gray-50 py-3 -mx-4 px-4 mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un logement..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(true)}><SlidersHorizontal size={18} /></Button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {['Tous', 'Meublé', 'Internet', 'Vérifié'].map((chip) => {
          const active = chip === 'Meublé' ? furnishedOnly : chip === 'Internet' ? internetRequired : chip === 'Vérifié' ? verifiedOnly : false;
          return (
            <button key={chip} onClick={() => {
              if (chip === 'Meublé') setFurnishedOnly(!furnishedOnly);
              else if (chip === 'Internet') setInternetRequired(!internetRequired);
              else if (chip === 'Vérifié') setVerifiedOnly(!verifiedOnly);
              else { setFurnishedOnly(false); setInternetRequired(false); setVerifiedOnly(false); }
            }} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${active ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {chip}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Building2 size={48} />} title="Aucun logement disponible" description="Essayez d'élargir vos critères de recherche." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h) => <HousingCard key={h.id} housing={h} />)}
        </div>
      )}

      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filtres" size="sm">
        <div className="space-y-4">
          <Select label="Ville" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="Toutes">Toutes les villes</option>
            {APP_CONFIG.cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select label="Université" value={university} onChange={(e) => setUniversity(e.target.value)}>
            <option value="Toutes">Toutes les universités</option>
            {mockUniversities.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix max/mois (FCFA)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Ex: 80000" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="space-y-2">
            {[{ label: 'Meublé uniquement', state: furnishedOnly, set: setFurnishedOnly },
              { label: 'Internet inclus', state: internetRequired, set: setInternetRequired },
              { label: 'Vérifié uniquement', state: verifiedOnly, set: setVerifiedOnly }].map((item) => (
              <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.state} onChange={(e) => item.set(e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => { setCity('Toutes'); setUniversity('Toutes'); setMaxPrice(''); setFurnishedOnly(false); setInternetRequired(false); setVerifiedOnly(false); }}>Réinitialiser</Button>
            <Button fullWidth onClick={() => setShowFilters(false)}>Appliquer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
