import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { mockUniversities } from '@/data/mock';
import { APP_CONFIG } from '@/config/app';

export function Register() {
  const navigate = useNavigate();
  const { register } = useApp();
  const { showToast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', city: 'Douala', university: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName) errs.fullName = 'Le nom est requis';
    if (!form.email) errs.email = "L'email est requis";
    if (!form.password || form.password.length < 6) errs.password = 'Minimum 6 caractères';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    register(form.email, form.fullName);
    showToast('Compte créé ! Bienvenue sur CampusCM.', 'success');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">Rejoignez la communauté CampusCM</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-warning-800 text-center font-medium">Mode démonstration — Aucune vraie authentification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nom complet" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Votre nom complet" icon={<User size={18} />} error={errors.fullName} autoComplete="name" />
            <Input label="Adresse email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="vous@exemple.com" icon={<Mail size={18} />} error={errors.email} autoComplete="email" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Minimum 6 caractères" autoComplete="new-password" className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-error-400' : 'border-gray-200'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error-600">{errors.password}</p>}
            </div>
            <Select label="Ville" value={form.city} onChange={(e) => update('city', e.target.value)}>
              {APP_CONFIG.cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Université (optionnel)" value={form.university} onChange={(e) => update('university', e.target.value)}>
              <option value="">Sélectionner une université</option>
              {mockUniversities.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </Select>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Création du compte...' : "Créer mon compte"}
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
