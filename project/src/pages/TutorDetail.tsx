import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Monitor, BookOpen, Star, Clock, Heart, MessageCircle } from 'lucide-react';
import { mockTutors } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Rating } from '@/components/ui/Rating';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate, cn } from '@/utils/format';

export function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();
  const tutor = mockTutors.find((t) => t.id === id);

  if (!tutor) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Tuteur introuvable</h1>
      <Button onClick={() => navigate('/tutors')}>Retour aux tuteurs</Button>
    </div>
  );

  const fav = isFavorite('tutor', tutor.id);

  const handleContact = () => {
    if (!currentUser) { navigate('/login'); return; }
    showToast('Message envoyé ! (Démo)', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start gap-4">
          <img
            src={tutor.avatarUrl || `https://ui-avatars.com/api/?name=${tutor.name}&background=2563eb&color=fff&size=96`}
            alt={tutor.name}
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{tutor.name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="primary"><BookOpen size={12} /> {tutor.subject}</Badge>
                  <Badge variant="default">{tutor.level}</Badge>
                  <VerifiedBadge verified={tutor.verified} />
                </div>
              </div>
              <button onClick={() => toggleFavorite('tutor', tutor.id)} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
                <Heart size={18} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-600')} />
              </button>
            </div>
            <Rating rating={tutor.rating} count={tutor.reviewCount} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-primary-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Tarif/heure</p>
            <p className="font-bold text-primary-600 text-sm">{formatPrice(tutor.pricePerHour)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Mode</p>
            <p className="font-semibold text-gray-900 text-sm flex items-center justify-center gap-1"><Monitor size={12} /> {tutor.online ? 'En ligne' : 'Présentiel'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Ville</p>
            <p className="font-semibold text-gray-900 text-sm flex items-center justify-center gap-1"><MapPin size={12} /> {tutor.city}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Université</p>
            <p className="font-semibold text-gray-900 text-xs text-center">{tutor.university}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{tutor.description}</p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} className="text-primary-600" />
          <span>Disponibilité: <span className="font-medium text-gray-700">{tutor.availability}</span></span>
        </div>
      </div>

      {tutor.reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Avis ({tutor.reviewCount})</h3>
          <div className="space-y-3">
            {tutor.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900">{review.studentName}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-warning-400 text-warning-400" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(review.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <Button fullWidth size="lg" onClick={handleContact}><MessageCircle size={18} /> Contacter ce tuteur</Button>
      </div>
    </div>
  );
}
