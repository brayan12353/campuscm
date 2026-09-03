import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Clock, Users } from 'lucide-react';
import type { CampusEvent } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function EventCard({ event }: { event: CampusEvent }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('event', event.id);
  return (
    <Card hover className="overflow-hidden group">
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <Badge variant="primary" className="mb-1">{event.category}</Badge>
            <h3 className="text-white font-bold text-sm line-clamp-1">{event.name}</h3>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite('event', event.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
            aria-label="Favori"
          >
            <Heart size={16} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-500')} />
          </button>
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(event.date)}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} /> {event.city}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><Users size={12} /> {event.registered}/{event.capacity}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className="font-bold text-primary-600 text-sm">{event.ticketPrice === 0 ? 'Gratuit' : formatPrice(event.ticketPrice)}</span>
          <span className="text-xs text-gray-400">{event.organizer}</span>
        </div>
      </div>
    </Card>
  );
}
