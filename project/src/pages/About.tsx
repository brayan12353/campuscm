import { Github, Linkedin, Mail, Target, Rocket, MapPin, Calendar } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

const timeline = [
  { year: '2026', label: 'Concept CampusCM', desc: 'Idée et vision initiale de la plateforme', done: true },
  { year: '2026', label: 'MVP Douala', desc: 'Première version fonctionnelle à Douala', done: true },
  { year: 'Futur', label: 'Expansion nationale', desc: 'Extension aux autres campus camerounais', done: false },
  { year: 'Futur', label: 'Intégrations Mobile Money', desc: 'Paiements MTN et Orange Money', done: false },
];

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center mx-auto mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M7 9v6c0 2.2 1.8 4 4 4s4-1.8 4-4V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="7" cy="7" r="1.5" fill="white"/>
            <circle cx="12" cy="7" r="1.5" fill="white"/>
            <circle cx="17" cy="7" r="1.5" fill="white"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">À propos de CampusCM</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{APP_CONFIG.tagline}</p>
      </div>

      {/* Mission */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <Target size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Notre mission</h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          CampusCM a pour ambition de simplifier la vie étudiante au Cameroun en réunissant au même endroit les opportunités, services et ressources dont les étudiants ont besoin. Marketplace, jobs, logement, tutorat, services et événements — tout en un seul endroit.
        </p>
      </section>

      {/* Founder */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Le fondateur</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-2xl bg-primary-100 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/9301461/pexels-photo-9301461.jpeg?auto=compress&cs=tinysrgb&h=200&w=200"
              alt={APP_CONFIG.founder.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900">{APP_CONFIG.founder.name}</h3>
            <p className="text-primary-600 font-semibold text-sm mt-0.5">{APP_CONFIG.founder.role}</p>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{APP_CONFIG.founder.bio}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              <a href={APP_CONFIG.founder.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                <Github size={16} /> GitHub
              </a>
              <a href={APP_CONFIG.founder.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={`mailto:${APP_CONFIG.founder.email}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                <Mail size={16} /> Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600">
            <Rocket size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Notre vision</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6">
          Construire progressivement une plateforme numérique pensée pour les étudiants camerounais, en commençant par Douala pour s'étendre progressivement à toutes les grandes villes universitaires du pays.
        </p>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center z-10 ${item.done ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Calendar size={16} />
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${item.done ? 'text-primary-600' : 'text-gray-400'}`}>{item.year}</span>
                    {!item.done && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">À venir</span>}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Villes cibles</h2>
        <div className="flex flex-wrap gap-2">
          {APP_CONFIG.cities.map((city, i) => (
            <div key={city} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${i === 0 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <MapPin size={14} /> {city} {i === 0 && '(Actif)'}
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6">
        <p className="text-sm text-gray-400">Built with ❤️ by {APP_CONFIG.founder.name}</p>
        <p className="text-xs text-gray-400 mt-1">© 2026 CampusCM. Tous droits réservés.</p>
      </div>
    </div>
  );
}
