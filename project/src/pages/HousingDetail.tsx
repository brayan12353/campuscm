
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Wifi,
  Zap,
  Droplets,
  ShieldCheck,
  Building2,
  Flag,
  MessageCircle,
} from 'lucide-react';

import { mockHousing } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, cn } from '@/utils/format';

const amenityList = [
  {
    key: 'water',
    icon: Droplets,
    label: 'Eau courante',
    color: 'text-primary-600',
  },
  {
    key: 'electricity',
    icon: Zap,
    label: 'Électricité',
    color: 'text-warning-600',
  },
  {
    key: 'internet',
    icon: Wifi,
    label: 'Internet',
    color: 'text-accent-600',
  },
  {
    key: 'security',
    icon: ShieldCheck,
    label: 'Sécurité',
    color: 'text-success-600',
  },
  {
    key: 'furnished',
    icon: Building2,
    label: 'Meublé',
    color: 'text-gray-600',
  },
] as const;

export function HousingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();

  const [imageIdx, setImageIdx] = useState(0);

  const housing = mockHousing.find((item) => item.id === id);

  if (!housing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Logement introuvable
        </h1>

        <Button onClick={() => navigate('/housing')}>
          Retour aux logements
        </Button>
      </div>
    );
  }

  const fav = isFavorite('housing', housing.id);

  const handleContact = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    showToast('Message envoyé ! (Démo)', 'success');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Lien copié', 'success');
    } catch {
      showToast('Impossible de copier le lien', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft size={16} />
        Retour
      </button>

      {/* Housing images */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-4">
        {housing.images.length > 0 && (
          <img
            src={housing.images[imageIdx]}
            alt={housing.title}
            className="w-full h-full object-cover"
          />
        )}

        {housing.verification === 'verified' && (
          <div className="absolute top-3 left-3">
            <Badge variant="success" className="shadow-sm">
              <ShieldCheck size={12} />
              Logement vérifié
            </Badge>
          </div>
        )}

        {housing.images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Image précédente"
              onClick={() =>
                setImageIdx(
                  (index) =>
                    (index - 1 + housing.images.length) %
                    housing.images.length
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label="Image suivante"
              onClick={() =>
                setImageIdx(
                  (index) => (index + 1) % housing.images.length
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label={
            fav ? 'Retirer des favoris' : 'Ajouter aux favoris'
          }
          onClick={() => toggleFavorite('housing', housing.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart
            size={18}
            className={cn(
              fav
                ? 'fill-error-500 text-error-500'
                : 'text-gray-600'
            )}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main information */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {housing.title}
                </h1>

                <p className="text-2xl font-bold text-primary-600">
                  {formatPrice(housing.pricePerMonth)}
                  <span className="text-sm font-normal text-gray-500">
                    /mois
                  </span>
                </p>
              </div>

              <button
                type="button"
                aria-label="Partager le logement"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <Share2 size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Location and room information */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {housing.neighborhood}, {housing.city}
              </span>

              <span className="flex items-center gap-1">
                <BedDouble size={14} />
                {housing.rooms} chambre
                {housing.rooms > 1 ? 's' : ''}
              </span>

              {housing.distanceFromCampus && (
                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                  {housing.distanceFromCampus}
                </span>
              )}
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {amenityList.map(
                ({ key, icon: Icon, label, color }) => {
                  const available = housing[key];

                  return (
                    <div
                      key={key}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl text-center',
                        available
                          ? 'bg-gray-50'
                          : 'bg-gray-50 opacity-40'
                      )}
                    >
                      <Icon
                        size={20}
                        className={
                          available ? color : 'text-gray-400'
                        }
                      />

                      <span className="text-xs text-gray-600">
                        {label}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">
              Description
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {housing.description}
            </p>
          </div>
        </div>

        {/* Landlord information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">
              Propriétaire
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {housing.landlord.charAt(0)}
              </div>

              <div>
                <p className="font-medium text-sm text-gray-900">
                  {housing.landlord}
                </p>

                <VerifiedBadge
                  verified={housing.landlordVerified}
                  className="mt-0.5"
                />
              </div>
            </div>

            {housing.university && (
              <p className="text-xs text-gray-500 mb-3">
                Proche : {housing.university}
              </p>
            )}

            <div className="mb-4">
              {housing.verification === 'verified' ? (
                <div className="flex items-center gap-2 text-success-700 bg-success-50 rounded-xl p-3">
                  <ShieldCheck size={18} />

                  <span className="text-sm font-semibold">
                    Logement vérifié
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-warning-700 bg-warning-50 rounded-xl p-3">
                  <Flag size={18} />

                  <span className="text-sm font-semibold">
                    En attente de vérification
                  </span>
                </div>
              )}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleContact}
            >
              <MessageCircle size={18} />
              Contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
