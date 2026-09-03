import { Link } from 'react-router-dom';
import { Heart, MapPin, Eye } from 'lucide-react';
import type { Listing } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatPrice, timeAgo } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('listing', listing.id);

  return (
    <Card hover className="overflow-hidden group">
      <Link to={`/marketplace/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            {listing.featured && <Badge variant="primary">À la une</Badge>}
            <Badge variant="neutral" className="bg-black/60">{listing.condition}</Badge>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite('listing', listing.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label="Ajouter aux favoris"
          >
            <Heart size={16} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-500')} />
          </button>
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/marketplace/${listing.id}`}>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">{listing.title}</h3>
        </Link>
        <p className="text-lg font-bold text-primary-600 mb-2">{formatPrice(listing.price)}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1"><MapPin size={12} /> {listing.neighborhood || listing.city}</span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <VerifiedBadge verified={listing.sellerVerified} />
          <span className="flex items-center gap-1 text-xs text-gray-400"><Eye size={12} /> {listing.views}</span>
        </div>
      </div>
    </Card>
  );
}
