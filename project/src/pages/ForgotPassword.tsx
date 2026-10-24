import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ChevronLeft, Lock } from 'lucide-react';
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

export function ForgotPassword() {
  const { requestPasswordReset, updatePassword } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRecovery = searchParams.get('recovery') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const recoveryError =
      searchParams.get('error_description') || searchParams.get('error');
    if (recoveryError) setError(recoveryError);
  }, [searchParams]);

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
      showToast('Demande de réinitialisation envoyée.', 'success');
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await updatePassword(password);
      showToast('Votre mot de passe a été mis à jour.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isRecovery ? 'Choisir un nouveau mot de passe' : 'Mot de passe oublié'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRecovery
              ? 'Saisissez et confirmez votre nouveau mot de passe.'
              : 'Entrez votre email pour recevoir un lien de réinitialisation'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {error && (
            <div role="alert" className="bg-error-50 border border-error-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {isRecovery ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Input
                label="Nouveau mot de passe"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                icon={<Lock size={18} />}
                autoComplete="new-password"
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                icon={<Lock size={18} />}
                autoComplete="new-password"
              />
              <Button type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </Button>
            </form>
          ) : sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4"><Mail size={28} className="text-success-600" /></div>
              <h3 className="font-bold text-gray-900 mb-2">Demande envoyée</h3>
              <p className="text-sm text-gray-500 mb-4">
                Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation.
              </p>
              <Link to="/login"><Button fullWidth>Retour à la connexion</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <Input
                label="Adresse email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@exemple.com"
                icon={<Mail size={18} />}
                autoComplete="email"
              />
              <Button type="submit" fullWidth size="lg" disabled={loading || !email.trim()}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </form>
          )}
        </div>

        <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-6 hover:text-gray-700">
          <ChevronLeft size={16} /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
