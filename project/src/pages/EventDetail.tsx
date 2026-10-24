import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Clock, Users, Heart, Share2, Ticket } from 'lucide-react';
import { mockEvents } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate, cn } from '@/utils/format';

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, currentUser } = useApp();
  const { showToast } = useToast();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Événement introuvable</h1>
      <Button onClick={() => navigate('/events')}>Retour aux événements</Button>
    </div>
  );

  const fav = isFavorite('event', event.id);
  const spotsLeft = event.capacity - event.registered;
  const isFull = spotsLeft <= 0;

  const handleRegister = () => {
    if (!currentUser) { navigate('/login'); return; }
    showToast(event.ticketPrice === 0 ? 'Inscription enregistrée ! (Démo)' : 'Ticket réservé ! (Démo)', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Retour
      </button>

      {event.imageUrl && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-4">
          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="primary" className="mb-2">{event.category}</Badge>
            <h1 className="text-white text-xl sm:text-2xl font-bold">{event.name}</h1>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => toggleFavorite('event', event.id)} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Heart size={18} className={cn(fav ? 'fill-error-500 text-error-500' : 'text-gray-600')} />
            </button>
            <button onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                showToast('Lien copié', 'success');
              } catch {
                showToast('Impossible de copier le lien.', 'error');
              }
            }} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-primary-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} /> Date</p>
                <p className="font-semibold text-gray-900 text-sm">{formatDate(event.date)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12} /> Heure</p>
                <p className="font-semibold text-gray-900 text-sm">{event.time}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Users size={12} /> Places</p>
                <p className="font-semibold text-gray-900 text-sm">{event.registered}/{event.capacity}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <MapPin size={16} className="text-primary-600 shrink-0" />
              <span>{event.location}, {event.city}</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-primary-600 mb-0.5">
                {event.ticketPrice === 0 ? 'Gratuit' : formatPrice(event.ticketPrice)}
              </p>
              {event.ticketPrice > 0 && <p className="text-xs text-gray-500">par ticket</p>}
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Places restantes</span>
                <span className={cn('font-semibold', isFull ? 'text-error-600' : spotsLeft < 20 ? 'text-warning-600' : 'text-success-600')}>{isFull ? 'Complet' : spotsLeft}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
              </div>
            </div>

            <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-warning-800 flex items-center gap-1"><Ticket size={12} /> Mode démo — Aucun paiement réel</p>
            </div>

            <Button fullWidth size="lg" disabled={isFull} onClick={handleRegister}>
              {isFull ? 'Complet' : event.ticketPrice === 0 ? "S'inscrire gratuitement" : 'Réserver un ticket'}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">Organisé par {event.organizer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
