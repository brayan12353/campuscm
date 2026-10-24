import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    currentUser,
    authLoading,
    authError,
    signInWithGoogle,
    signInWithPassword,
  } = useApp();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser && !authLoading) navigate('/dashboard', { replace: true });
  }, [authLoading, currentUser, navigate]);

  useEffect(() => {
    const oauthError =
      searchParams.get('error_description') || searchParams.get('error');
    if (oauthError) setError(oauthError);
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      setLoading(false);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "L'email est requis";
    if (!password) nextErrors.password = 'Le mot de passe est requis';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setError('');
    setLoading(true);
    try {
      await signInWithPassword(email.trim(), password);
      showToast('Connexion réussie !', 'success');
    } catch (requestError) {
      setError(errorMessage(requestError));
      setLoading(false);
    }
  };

  const isBusy = loading || authLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte CampusCM</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {(error || authError) && (
            <div role="alert" className="bg-error-50 border border-error-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-error-700">{error || authError}</p>
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
            {loading ? 'Connexion à Google...' : 'Continuer avec Google'}
          </Button>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU AVEC EMAIL</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 font-medium hover:underline">Mot de passe oublié ?</Link>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={isBusy}>
              {loading ? 'Connexion...' : 'Se connecter avec email'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
