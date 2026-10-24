
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  MapPin,
  GraduationCap,
  Star,
  Camera,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { mockUniversities } from '@/data/mock';
import { APP_CONFIG } from '@/config/app';

interface ProfileForm {
  fullName: string;
  bio: string;
  city: string;
  university: string;
}

export function Profile() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    fullName: currentUser?.fullName ?? '',
    bio: currentUser?.bio ?? '',
    city: currentUser?.city ?? '',
    university: currentUser?.university ?? '',
  });

  // Keep the form synchronized with the current user.
  useEffect(() => {
    if (!currentUser) return;

    setForm({
      fullName: currentUser.fullName,
      bio: currentUser.bio ?? '',
      city: currentUser.city,
      university: currentUser.university ?? '',
    });
  }, [currentUser]);

  const update = (field: keyof ProfileForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (currentUser) {
      setForm({
        fullName: currentUser.fullName,
        bio: currentUser.bio ?? '',
        city: currentUser.city,
        university: currentUser.university ?? '',
      });
    }

    setEditing(false);
  };

  const handleSave = () => {
    // This page does not yet persist profile changes.
    showToast(
      'La sauvegarde du profil sera disponible après la connexion à la base de données.',
      'info',
    );
  };

  const verificationLabel: Record<string, string> = {
    unverified: 'Non vérifié',
    pending: 'En attente',
    verified: 'Vérifié',
    rejected: 'Refusé',
  };

  const verificationColor: Record<
    string,
    'default' | 'success' | 'warning' | 'error'
  > = {
    unverified: 'default',
    pending: 'warning',
    verified: 'success',
    rejected: 'error',
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Connectez-vous pour voir votre profil
        </h1>

        <Button onClick={() => navigate('/login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  const verification =
    verificationColor[currentUser.verification] ?? 'default';

  const verificationText =
    verificationLabel[currentUser.verification] ?? 'Non vérifié';

  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>

        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            Modifier
          </Button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary-100">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={`Photo de ${currentUser.fullName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary-600">
                {currentUser.fullName?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>

          {editing && (
            <button
              type="button"
              aria-label="Modifier la photo de profil"
              title="Modification de la photo bientôt disponible"
              onClick={() =>
                showToast(
                  'La modification de la photo sera ajoutée ultérieurement.',
                  'info',
                )
              }
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md"
            >
              <Camera size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant={verification}>{verificationText}</Badge>

          {currentUser.verification === 'verified' && (
            <BadgeCheck size={18} className="text-accent-600" />
          )}
        </div>
      </div>

      {editing ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <Input
            label="Nom complet"
            value={form.fullName}
            onChange={(event) => update('fullName', event.target.value)}
          />

          <Textarea
            label="Biographie"
            value={form.bio}
            onChange={(event) => update('bio', event.target.value)}
            placeholder="Décrivez-vous en quelques mots..."
            rows={3}
          />

          <Select
            label="Ville"
            value={form.city}
            onChange={(event) => update('city', event.target.value)}
          >
            <option value="">Choisir une ville</option>
            {APP_CONFIG.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>

          <Select
            label="Université"
            value={form.university}
            onChange={(event) =>
              update('university', event.target.value)
            }
          >
            <option value="">Aucune</option>
            {mockUniversities.map((university) => (
              <option key={university.id} value={university.name}>
                {university.name}
              </option>
            ))}
          </Select>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={handleCancel}
            >
              Annuler
            </Button>

            <Button fullWidth onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {currentUser.fullName}
            </h2>

            <p className="text-sm text-gray-500 mt-0.5">
              {currentUser.email}
            </p>
          </div>

          {currentUser.bio && (
            <p className="text-sm text-gray-600">
              {currentUser.bio}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-primary-600 shrink-0"
              />
              <span>{currentUser.city || 'Ville non renseignée'}</span>
            </div>

            {currentUser.university && (
              <div className="flex items-center gap-2">
                <GraduationCap
                  size={16}
                  className="text-primary-600 shrink-0"
                />
                <span className="truncate">
                  {currentUser.university}
                </span>
              </div>
            )}

            {currentUser.rating > 0 && (
              <div className="flex items-center gap-2">
                <Star
                  size={16}
                  className="fill-warning-400 text-warning-400 shrink-0"
                />
                <span>
                  {currentUser.rating.toFixed(1)} (
                  {currentUser.reviewCount} avis)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.roles.map((role) => (
              <Badge key={role} variant="primary">
                {role}
              </Badge>
            ))}
          </div>

          {memberSince && (
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs text-gray-400">
                Membre depuis {memberSince}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
