import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { mockListings } from '@/data/mock';
import { formatPrice, timeAgo } from '@/utils/format';
import { useState } from 'react';

export function MyListings() {
  const { currentUser, userListings, removeUserListing } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!currentUser) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <Button onClick={() => navigate('/login')}>Se connecter</Button>
    </div>
  );

  const demoListings = mockListings.filter((l) => l.sellerId === currentUser.id);
  const allListings = [...userListings, ...demoListings];

  const statusLabel: Record<string, string> = { pending: 'En attente', approved: 'Approuvée', rejected: 'Rejetée' };
  const statusColor: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes annonces</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allListings.length} annonce{allListings.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/create-listing')}><Plus size={18} /> Créer</Button>
      </div>

      {allListings.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} />}
          title="Aucune annonce publiée"
          description="Publiez votre première annonce pour commencer à vendre."
          action={<Button onClick={() => navigate('/create-listing')}><Plus size={18} /> Créer une annonce</Button>}
        />
      ) : (
        <div className="space-y-3">
          {allListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
              <Link to={`/marketplace/${listing.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {listing.images[0] && <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/marketplace/${listing.id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{listing.title}</h3>
                </Link>
                <p className="text-primary-600 font-bold text-sm mt-0.5">{formatPrice(listing.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={statusColor[listing.status]}>{statusLabel[listing.status]}</Badge>
                  <span className="text-xs text-gray-400">{timeAgo(listing.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Eye size={12} /> {listing.views} vues
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Modifier">
                  <Edit size={16} />
                </button>
                {userListings.some((l) => l.id === listing.id) && (
                  <button onClick={() => setDeleteId(listing.id)} className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { removeUserListing(deleteId); showToast('Annonce supprimée', 'success'); setDeleteId(null); } }}
        title="Supprimer l'annonce"
        message="Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
      />
    </div>
  );
}
