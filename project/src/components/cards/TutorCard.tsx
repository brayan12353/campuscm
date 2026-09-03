import { Link } from 'react-router-dom';
import { Heart, MapPin, Monitor, BookOpen } from 'lucide-react';
import type { Tutor } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Rating } from '@/components/ui/Rating';
import { formatPrice } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('tutor', tutor.id);
  return (
    <Card hover className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link to={`/tutors/${tutor.id}`}>
            <img
              src={tutor.avatarUrl || `https://ui-avatars.com/api/?name=${tutor.name}&background=2563eb&color=fff`}
              alt={tutor.name}
              loading="lazy"
              className="w-14 h-14 rounded-xl object-cover"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link to={`/tutors/${tutor.id}`}>
                <h3 className="font-semibold text-sm text-gray-900 truncate">{tutor.name}</h3>
              </Link>
              <button onClick={() => toggleFavorite('tutor', tutor.id)} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Favori">
                <Heart size={16} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-400')} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="primary" size="sm"><BookOpen size={10} /> {tutor.subject}</Badge>
              <VerifiedBadge verified={tutor.verified} />
            </div>
            <Rating rating={tutor.rating} count={tutor.reviewCount} className="mt-1" />
          </div>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mt-3">{tutor.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} /> {tutor.city}
            <span className="flex items-center gap-0.5"><Monitor size={12} /> {tutor.online ? 'En ligne' : 'Présentiel'}</span>
          </div>
          <span className="font-bold text-primary-600 text-sm">{formatPrice(tutor.pricePerHour)}<span className="text-xs font-normal text-gray-500">/h</span></span>
        </div>
      </div>
    </Card>
  );
}
