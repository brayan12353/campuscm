import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 text-center">
      <Logo size="md" className="mb-8" />
      <div className="mb-6">
        <p className="text-8xl font-black text-primary-600 leading-none">404</p>
        <div className="w-16 h-1 bg-primary-200 rounded-full mx-auto my-4" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cette page n'existe pas.</h1>
      <p className="text-gray-500 max-w-sm mb-8">La page que vous cherchez est introuvable. Vérifiez l'URL ou revenez à l'accueil.</p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/"><Button size="lg"><Home size={18} /> Retour à l'accueil</Button></Link>
        <Link to="/explore"><Button size="lg" variant="outline"><Search size={18} /> Explorer</Button></Link>
      </div>
    </div>
  );
}
