import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Briefcase, GraduationCap, Building2, Wrench, CalendarDays, ShieldCheck, MapPin, Zap, Users } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockListings, mockJobs, mockHousing, mockTutors, mockEvents } from '@/data/mock';
import { ListingCard } from '@/components/cards/ListingCard';
import { JobCard } from '@/components/cards/JobCard';
import { HousingCard } from '@/components/cards/HousingCard';
import { TutorCard } from '@/components/cards/TutorCard';
import { EventCard } from '@/components/cards/EventCard';
import { Button } from '@/components/ui/Button';

const categories = [
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'bg-primary-50 text-primary-600' },
  { to: '/jobs', label: 'Jobs', icon: Briefcase, color: 'bg-accent-50 text-accent-600' },
  { to: '/tutors', label: 'Tutorat', icon: GraduationCap, color: 'bg-warning-50 text-warning-600' },
  { to: '/housing', label: 'Logement', icon: Building2, color: 'bg-success-50 text-success-600' },
  { to: '/services', label: 'Services', icon: Wrench, color: 'bg-error-50 text-error-600' },
  { to: '/events', label: 'Événements', icon: CalendarDays, color: 'bg-primary-50 text-primary-600' },
];

const features = [
  { icon: Zap, title: 'Simple', desc: 'Une plateforme unique pour tous vos besoins' },
  { icon: MapPin, title: 'Local', desc: 'Pensé pour les étudiants camerounais' },
  { icon: ShieldCheck, title: 'Vérifié', desc: 'Annonces et utilisateurs vérifiés' },
  { icon: Users, title: 'Étudiants', desc: 'Conçu par et pour les étudiants' },
];

export function Home() {
  const { selectedCity } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query)}`);
    else navigate('/explore');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3">
              Tout ce dont un étudiant a besoin, au même endroit.
            </h1>
            <p className="text-primary-100 text-sm sm:text-lg mb-8">
              Achetez, vendez, trouvez un job, un logement ou un service près de votre campus.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Que recherchez-vous ?"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <Button type="submit" size="lg" variant="secondary" className="shadow-lg">Rechercher</Button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-100">
              <MapPin size={16} /> {selectedCity}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 card-hover"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                <cat.icon size={20} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Listings */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Annonces tendance</h2>
          <Link to="/marketplace" className="text-sm text-primary-600 font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {mockListings.filter((l) => l.status === 'approved').slice(0, 4).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Jobs récents</h2>
          <Link to="/jobs" className="text-sm text-primary-600 font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {mockJobs.slice(0, 2).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Nearby Housing */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Logements à proximité</h2>
          <Link to="/housing" className="text-sm text-primary-600 font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockHousing.slice(0, 3).map((housing) => (
            <HousingCard key={housing.id} housing={housing} />
          ))}
        </div>
      </section>

      {/* Popular Tutors */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Tuteurs populaires</h2>
          <Link to="/tutors" className="text-sm text-primary-600 font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockTutors.slice(0, 3).map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Événements à venir</h2>
          <Link to="/events" className="text-sm text-primary-600 font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Why CampusCM */}
      <section className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Pourquoi CampusCM ?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3 text-primary-600">
                  <f.icon size={24} />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety warning */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-12">
        <div className="flex items-start gap-3 bg-warning-50 border border-warning-200 rounded-2xl p-4">
          <ShieldCheck size={20} className="text-warning-600 shrink-0 mt-0.5" />
          <p className="text-sm text-warning-800">
            Ne versez jamais d'argent à un vendeur sans avoir vérifié son identité et son annonce.
          </p>
        </div>
      </section>
    </div>
  );
}
