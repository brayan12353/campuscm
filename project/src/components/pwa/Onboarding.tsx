import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { APP_CONFIG } from '@/config/app';
import { mockUniversities } from '@/data/mock';
import { ShoppingBag, Briefcase, Building2, GraduationCap, Wrench, CalendarDays } from 'lucide-react';
import { cn } from '@/utils/format';

const interests = [
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'text-primary-600 bg-primary-50' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, color: 'text-accent-600 bg-accent-50' },
  { id: 'housing', label: 'Logement', icon: Building2, color: 'text-success-600 bg-success-50' },
  { id: 'tutoring', label: 'Tutorat', icon: GraduationCap, color: 'text-warning-600 bg-warning-50' },
  { id: 'services', label: 'Services', icon: Wrench, color: 'text-error-600 bg-error-50' },
  { id: 'events', label: 'Événements', icon: CalendarDays, color: 'text-primary-600 bg-primary-50' },
];

export function Onboarding() {
  const { onboardingCompleted, setOnboardingCompleted, setSelectedCity } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  if (onboardingCompleted) return null;

  const handleSkip = () => {
    setOnboardingCompleted(true);
  };

  const handleFinish = () => {
    if (city) setSelectedCity(city);
    setOnboardingCompleted(true);
    if (selectedInterests.length > 0) {
      navigate(`/${selectedInterests[0] === 'tutoring' ? 'tutors' : selectedInterests[0]}`);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const citiesWithUnis = APP_CONFIG.cities.filter((c) => mockUniversities.some((u) => u.city === c));

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      <div className="flex justify-between items-center p-4">
        <Logo size="sm" />
        <button onClick={handleSkip} className="text-sm text-gray-500 font-medium hover:text-gray-700">Passer</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full">
        {step === 0 && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M7 9v6c0 2.2 1.8 4 4 4s4-1.8 4-4V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="7" cy="7" r="1.5" fill="white"/>
                <circle cx="12" cy="7" r="1.5" fill="white"/>
                <circle cx="17" cy="7" r="1.5" fill="white"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur CampusCM 👋</h1>
            <p className="text-gray-500 mb-8">{APP_CONFIG.tagline}</p>
            <Button size="lg" fullWidth onClick={() => setStep(1)}>Commencer</Button>
          </div>
        )}

        {step === 1 && (
          <div className="w-full animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Dans quelle ville étudies-tu ?</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Nous personnaliserons votre expérience</p>
            <div className="grid grid-cols-2 gap-3">
              {citiesWithUnis.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setStep(2); }}
                  className={cn(
                    'p-4 rounded-2xl border-2 text-sm font-semibold transition-all',
                    city === c ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-300 text-gray-700',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Quelle est ton université ?</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Facultatif — vous pouvez passer</p>
            <div className="space-y-2">
              {mockUniversities.filter((u) => !city || u.city === city).map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setUniversity(u.name); setStep(3); }}
                  className={cn(
                    'w-full p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all',
                    university === u.name ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-300 text-gray-700',
                  )}
                >
                  {u.name}
                  <span className="block text-xs font-normal text-gray-400">{u.city}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" fullWidth className="mt-4" onClick={() => setStep(3)}>Passer cette étape</Button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Que veux-tu découvrir ?</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Sélectionnez vos centres d'intérêt</p>
            <div className="grid grid-cols-2 gap-3">
              {interests.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border-2 text-sm font-semibold transition-all',
                    selectedInterests.includes(item.id) ? 'border-primary-600 bg-primary-50' : 'border-gray-100 hover:border-primary-300',
                  )}
                >
                  <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center', item.color)}>
                    <item.icon size={18} />
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
            <Button size="lg" fullWidth className="mt-6" onClick={handleFinish}>
              {selectedInterests.length > 0 ? 'Terminer' : 'Passer et explorer'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn('h-2 rounded-full transition-all', i === step ? 'w-8 bg-primary-600' : 'w-2 bg-gray-200')}
          />
        ))}
      </div>
    </div>
  );
}
