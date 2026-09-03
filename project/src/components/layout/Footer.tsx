import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { APP_CONFIG } from '@/config/app';
import { Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/tutors', label: 'Tutorat' },
  { to: '/housing', label: 'Logement' },
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Événements' },
  { to: '/about', label: 'À propos' },
  { to: '/help', label: 'Aide' },
  { to: '/terms', label: 'Conditions' },
  { to: '/privacy', label: 'Confidentialité' },
];

export function Footer() {
  return (
    <footer className="hidden lg:block bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="text-sm text-gray-500 mt-3 max-w-xs">{APP_CONFIG.tagline}</p>
            <div className="flex gap-3 mt-4">
              <a href={APP_CONFIG.founder.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Github size={18} />
              </a>
              <a href={APP_CONFIG.founder.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${APP_CONFIG.supportEmail}`} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations</h4>
            <ul className="space-y-2">
              {footerLinks.slice(5).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">Built by {APP_CONFIG.founder.name}</p>
          <p className="text-xs text-gray-400">© 2026 CampusCM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
