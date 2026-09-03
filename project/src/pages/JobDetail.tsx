import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Calendar, Flag, Heart, Share2, ChevronLeft, Phone, MessageCircle } from 'lucide-react';
import { mockJobs } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate, timeAgo, buildWhatsAppUrl, cn } from '@/utils/format';

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();
  const job = mockJobs.find((j) => j.id === id);

  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Job introuvable</h1>
      <Button onClick={() => navigate('/jobs')}>Retour aux jobs</Button>
    </div>
  );

  const fav = isFavorite('job', job.id);

  const handleApply = () => {
    if (!currentUser) { navigate('/login'); return; }
    if (job.contactMethod === 'whatsapp' && job.contactPhone) {
      window.open(buildWhatsAppUrl(job.contactPhone, `Bonjour, je souhaite postuler pour "${job.title}"`), '_blank');
    } else {
      showToast('Candidature envoyée ! (Démo)', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="accent">{job.category}</Badge>
              <VerifiedBadge verified={job.employerVerified} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleFavorite('job', job.id)} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
              <Heart size={18} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-600')} />
            </button>
            <button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); showToast('Lien copié', 'success'); } catch {} }} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-primary-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Budget</p>
            <p className="font-bold text-primary-600 text-sm">{formatPrice(job.budget)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Ville</p>
            <p className="font-semibold text-gray-900 text-sm">{job.location}</p>
          </div>
          {job.duration && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Durée</p>
              <p className="font-semibold text-gray-900 text-sm">{job.duration}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Deadline</p>
            <p className="font-semibold text-gray-900 text-sm">{formatDate(job.deadline)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Briefcase size={14} /> {job.employer}</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> Publié {timeAgo(job.createdAt)}</span>
          {job.date && <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(job.date)}</span>}
        </div>

        <div className="border-t border-gray-50 pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Postuler</h3>
        <p className="text-sm text-gray-500 mb-4">Deadline: <span className="font-medium text-gray-700">{formatDate(job.deadline)}</span></p>
        <div className="space-y-2">
          <Button fullWidth size="lg" onClick={handleApply}><MessageCircle size={18} /> Postuler maintenant</Button>
          {job.contactMethod === 'whatsapp' && job.contactPhone && (
            <Button fullWidth variant="success" onClick={() => window.open(buildWhatsAppUrl(job.contactPhone!, `Bonjour, je souhaite postuler pour "${job.title}"`), '_blank')}>
              <Phone size={18} /> Contacter via WhatsApp
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
