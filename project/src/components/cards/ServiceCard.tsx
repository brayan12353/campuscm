import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import type { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Rating } from '@/components/ui/Rating';
import { formatPrice } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function ServiceCard({ service }: { service: Service }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('service', service.id);
  return (
    <Card hover className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={service.avatarUrl || `https://ui-avatars.com/api/?name=${service.provider}&background=2563eb&color=fff`}
            alt={service.provider}
            loading="lazy"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link to={`/services/${service.id}`}>
                <h3 className="font-semibold text-sm text-gray-900 truncate">{service.title}</h3>
              </Link>
              <button onClick={() => toggleFavorite('service', service.id)} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Favori">
                <Heart size={16} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-400')} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="accent" size="sm">{service.category}</Badge>
              <VerifiedBadge verified={service.providerVerified} />
            </div>
            <Rating rating={service.rating} count={service.reviewCount} className="mt-1" />
          </div>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mt-3">{service.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} /> {service.city}</span>
          <span className="font-bold text-primary-600 text-sm">À partir de {formatPrice(service.priceFrom)}</span>
        </div>
      </div>
    </Card>
  );
}
