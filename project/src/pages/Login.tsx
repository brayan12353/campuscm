import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'L\'email est requis';
    if (!password) errs.password = 'Le mot de passe est requis';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email);
    showToast('Connexion réussie !', 'success');
    navigate('/dashboard');
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login('brayan.kuate@campuscm.cm');
    showToast('Connexion démo réussie !', 'success');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte CampusCM</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-error-400' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error-600">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 font-medium hover:underline">Mot de passe oublié ?</Link>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-warning-800 text-center font-medium">Mode démonstration — Aucune vraie authentification</p>
          </div>

          <Button variant="outline" fullWidth onClick={handleDemoLogin} disabled={loading}>
            Connexion démo (admin)
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
