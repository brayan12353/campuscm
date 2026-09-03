import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, Share2, Flag, MapPin, Calendar, Eye, ChevronLeft, ChevronRight,
  MessageCircle, Phone, ShieldAlert, ChevronLeft as Back,
} from 'lucide-react';
import { mockListings } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate, timeAgo, buildWhatsAppUrl } from '@/utils/format';
import { cn } from '@/utils/format';

const reportCategories = ['Scam', 'Fake listing', 'Wrong price', 'Inappropriate content', 'Harassment', 'Other'];

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();
  const [imageIdx, setImageIdx] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showContact, setShowContact] = useState(false);

  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Annonce introuvable</h1>
        <Button onClick={() => navigate('/marketplace')}>Retour à la marketplace</Button>
      </div>
    );
  }

  const fav = isFavorite('listing', listing.id);

  const handleReport = () => {
    if (!reportReason) { showToast('Veuillez sélectionner un motif', 'error'); return; }
    showToast('Signalement envoyé. Merci !', 'success');
    setShowReport(false);
    setReportReason('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: listing.title, url: window.location.href }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); showToast('Lien copié', 'success'); } catch {}
    }
  };

  const handleContact = () => {
    if (!currentUser) { navigate('/login'); return; }
    if (listing.contactMethod === 'whatsapp' && listing.contactPhone) {
      window.open(buildWhatsAppUrl(listing.contactPhone, `Bonjour, je suis intéressé par "${listing.title}"`), '_blank');
    } else {
      setShowContact(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <Back size={16} /> Retour
      </button>

      {/* Image gallery */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <img src={listing.images[imageIdx]} alt={listing.title} className="w-full h-full object-cover" />
        {listing.images.length > 1 && (
          <>
            <button
              onClick={() => setImageIdx((i) => (i - 1 + listing.images.length) % listing.images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setImageIdx((i) => (i + 1) % listing.images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {listing.images.map((_, i) => (
                <div key={i} className={cn('w-1.5 h-1.5 rounded-full transition-colors', i === imageIdx ? 'bg-white' : 'bg-white/50')} />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing.featured && <Badge variant="primary">À la une</Badge>}
          <Badge variant="neutral" className="bg-black/60">{listing.condition}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(listing.price)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleFavorite('listing', listing.id)} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Heart size={20} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-600')} />
              </button>
              <button onClick={handleShare} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button onClick={() => setShowReport(true)} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Flag size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><MapPin size={14} /> {listing.neighborhood || listing.city}, {listing.city}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {timeAgo(listing.createdAt)}</span>
            <span className="flex items-center gap-1"><Eye size={14} /> {listing.views} vues</span>
            <Badge variant="primary">{listing.category}</Badge>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Safety warning */}
          <div className="flex items-start gap-3 bg-warning-50 border border-warning-200 rounded-xl p-4">
            <ShieldAlert size={20} className="text-warning-600 shrink-0 mt-0.5" />
            <p className="text-xs text-warning-800">
              Ne versez jamais d'argent à un vendeur sans avoir vérifié son identité et son annonce.
            </p>
          </div>
        </div>

        {/* Seller sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">Vendeur</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {listing.sellerName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{listing.sellerName}</p>
                <VerifiedBadge verified={listing.sellerVerified} className="mt-0.5" />
              </div>
            </div>
            {listing.university && (
              <p className="text-xs text-gray-500 mb-1">{listing.university}</p>
            )}
            {listing.campus && (
              <p className="text-xs text-gray-500 mb-3">{listing.campus}</p>
            )}
            <div className="space-y-2">
              <Button fullWidth onClick={handleContact}>
                <MessageCircle size={18} /> Contacter le vendeur
              </Button>
              {listing.contactMethod === 'whatsapp' && listing.contactPhone && (
                <Button fullWidth variant="success" onClick={() => window.open(buildWhatsAppUrl(listing.contactPhone!, `Bonjour, je suis intéressé par "${listing.title}"`), '_blank')}>
                  <Phone size={18} /> WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report modal */}
      <Modal open={showReport} onClose={() => setShowReport(false)} title="Signaler cette annonce" size="sm">
        <div className="space-y-3">
          {reportCategories.map((reason) => (
            <button
              key={reason}
              onClick={() => setReportReason(reason)}
              className={cn(
                'w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all',
                reportReason === reason ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-300 text-gray-700',
              )}
            >
              {reason}
            </button>
          ))}
          <Button fullWidth onClick={handleReport} disabled={!reportReason}>Envoyer le signalement</Button>
        </div>
      </Modal>

      {/* Contact info modal */}
      <Modal open={showContact} onClose={() => setShowContact(false)} title="Contacter le vendeur" size="sm">
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 text-primary-600">
            <MessageCircle size={28} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            La messagerie CampusCM vous permet de discuter en toute sécurité. Votre numéro de téléphone n'est pas partagé.
          </p>
          <Button fullWidth onClick={() => { setShowContact(false); navigate('/messages'); }}>
            Ouvrir la messagerie
          </Button>
        </div>
      </Modal>
    </div>
  );
}
