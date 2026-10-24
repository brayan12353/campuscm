import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Une erreur est survenue. Veuillez réessayer.';
}

export function Register() {
  const navigate = useNavigate();
  const {
    currentUser,
    authLoading,
    authError,
    signInWithGoogle,
    signUpWithPassword,
  } = useApp();
  const { showToast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState('');
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  useEffect(() => {
    if (currentUser && !authLoading) navigate('/dashboard', { replace: true });
  }, [authLoading, currentUser, navigate]);

  const update = (field: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleGoogleSignIn = async () => {
    setRequestError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      setLoading(false);
    } catch (error) {
      setRequestError(errorMessage(error));
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Le nom est requis';
    if (!form.email.trim()) nextErrors.email = "L'email est requis";
    if (form.password.length < 6) nextErrors.password = 'Minimum 6 caractères';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setRequestError('');
    setEmailConfirmationRequired(false);
    setLoading(true);
    try {
      const confirmationRequired = await signUpWithPassword(
        form.email.trim(),
        form.password,
        form.fullName.trim(),
      );
      if (confirmationRequired) {
        setEmailConfirmationRequired(true);
        showToast('Vérifiez votre adresse email pour terminer votre inscription.', 'info');
      } else {
        showToast('Compte créé ! Bienvenue sur CampusCM.', 'success');
      }
    } catch (error) {
      setRequestError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || authLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">Rejoignez la communauté CampusCM</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {(requestError || authError) && (
            <div role="alert" className="bg-error-50 border border-error-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-error-700">{requestError || authError}</p>
            </div>
          )}

          {emailConfirmationRequired && (
            <div role="status" className="bg-success-50 border border-success-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-success-700">
                Inscription enregistrée. Confirmez votre adresse email avant de vous connecter.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
          >
            <span aria-hidden="true" className="font-bold text-base">G</span>
            {loading ? 'Connexion à Google...' : 'S’inscrire avec Google'}
          </Button>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU AVEC EMAIL</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom complet"
              value={form.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              placeholder="Votre nom complet"
              icon={<User size={18} />}
              error={errors.fullName}
              autoComplete="name"
            />
            <Input
              label="Adresse email"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="vous@exemple.com"
              icon={<Mail size={18} />}
              error={errors.email}
              autoComplete="email"
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  placeholder="Minimum 6 caractères"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-error-400' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error-600">{errors.password}</p>}
            </div>
            <Button type="submit" fullWidth size="lg" disabled={isBusy}>
              {loading ? 'Création du compte...' : 'Créer mon compte avec email'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
