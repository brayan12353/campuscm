import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Wifi, Zap, Droplets, ShieldCheck } from 'lucide-react';
import type { Housing } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function HousingCard({ housing }: { housing: Housing }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('housing', housing.id);
  return (
    <Card hover className="overflow-hidden group">
      <Link to={`/housing/${housing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img src={housing.images[0]} alt={housing.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          {housing.verification === 'verified' && (
            <div className="absolute top-2 left-2">
              <Badge variant="success" className="shadow-sm"><ShieldCheck size={12} /> Logement vérifié</Badge>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite('housing', housing.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
            aria-label="Favori"
          >
            <Heart size={16} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-500')} />
          </button>
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/housing/${housing.id}`}>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{housing.title}</h3>
        </Link>
        <p className="text-lg font-bold text-primary-600 mb-2">{formatPrice(housing.pricePerMonth)}<span className="text-xs font-normal text-gray-500">/mois</span></p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={12} /> {housing.neighborhood}, {housing.city}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-0.5"><BedDouble size={12} /> {housing.rooms}</span>
          {housing.internet && <Wifi size={12} className="text-accent-600" />}
          {housing.electricity && <Zap size={12} className="text-warning-500" />}
          {housing.water && <Droplets size={12} className="text-primary-500" />}
          {housing.security && <ShieldCheck size={12} className="text-success-600" />}
        </div>
        {housing.distanceFromCampus && (
          <p className="text-xs text-gray-400">{housing.distanceFromCampus}</p>
        )}
      </div>
    </Card>
  );
}
