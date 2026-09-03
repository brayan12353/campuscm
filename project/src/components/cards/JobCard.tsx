import { Link } from 'react-router-dom';
import { Heart, MapPin, Briefcase, Clock } from 'lucide-react';
import type { Job } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatPrice, timeAgo } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';

export function JobCard({ job }: { job: Job }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite('job', job.id);
  return (
    <Card hover className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/jobs/${job.id}`} className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
          </Link>
          <button
            onClick={() => toggleFavorite('job', job.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Sauvegarder"
          >
            <Heart size={18} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-400')} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="accent">{job.category}</Badge>
          <VerifiedBadge verified={job.employerVerified} label={job.employerVerified ? 'Vérifié' : ''} />
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><Briefcase size={12} /> {job.employer}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="font-bold text-primary-600">{formatPrice(job.budget)}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} /> {timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
