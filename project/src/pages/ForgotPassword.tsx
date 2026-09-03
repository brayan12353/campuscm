import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    showToast('Email envoyé ! (Démo)', 'success');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" to="/" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-sm text-gray-500 mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4"><Mail size={28} className="text-success-600" /></div>
              <h3 className="font-bold text-gray-900 mb-2">Email envoyé !</h3>
              <p className="text-sm text-gray-500 mb-4">Vérifiez votre boîte de réception (démo uniquement).</p>
              <Link to="/login"><Button fullWidth>Retour à la connexion</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Adresse email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" icon={<Mail size={18} />} />
              <Button type="submit" fullWidth size="lg" disabled={loading || !email}>
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
