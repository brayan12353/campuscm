import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { mockServices } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Rating } from '@/components/ui/Rating';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate, buildWhatsAppUrl, cn } from '@/utils/format';

export function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();
  const service = mockServices.find((s) => s.id === id);

  if (!service) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Service introuvable</h1>
      <Button onClick={() => navigate('/services')}>Retour aux services</Button>
    </div>
  );

  const fav = isFavorite('service', service.id);

  const handleContact = () => {
    if (!currentUser) { navigate('/login'); return; }
    if (service.contactMethod === 'whatsapp' && service.contactPhone) {
      window.open(buildWhatsAppUrl(service.contactPhone, `Bonjour, je suis intéressé par votre service "${service.title}"`), '_blank');
    } else {
      showToast('Message envoyé ! (Démo)', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start gap-4 mb-4">
          <img src={service.avatarUrl || `https://ui-avatars.com/api/?name=${service.provider}&background=2563eb&color=fff&size=80`} alt={service.provider} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{service.title}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{service.provider}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="accent">{service.category}</Badge>
                  <VerifiedBadge verified={service.providerVerified} />
                </div>
              </div>
              <button onClick={() => toggleFavorite('service', service.id)} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200">
                <Heart size={18} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-600')} />
              </button>
            </div>
            <Rating rating={service.rating} count={service.reviewCount} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-primary-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">À partir de</p>
            <p className="font-bold text-primary-600">{formatPrice(service.priceFrom)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Localisation</p>
            <p className="font-semibold text-gray-900 text-sm flex items-center justify-center gap-1"><MapPin size={12} /> {service.city}</p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.description}</p>

        {service.portfolio.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {service.portfolio.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {service.reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Avis ({service.reviewCount})</h3>
          <div className="space-y-3">
            {service.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{review.customerName}</span>
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

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
        <Button fullWidth size="lg" onClick={handleContact}><MessageCircle size={18} /> Contacter le prestataire</Button>
        {service.contactMethod === 'whatsapp' && service.contactPhone && (
          <Button fullWidth variant="success" onClick={() => window.open(buildWhatsAppUrl(service.contactPhone!, `Bonjour, je suis intéressé par votre service "${service.title}"`), '_blank')}>
            <Phone size={18} /> WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
