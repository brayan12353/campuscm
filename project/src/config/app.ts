export const APP_CONFIG = {
  name: 'CampusCM',
  tagline: 'Tout ce dont un étudiant a besoin, au même endroit.',
  shortTagline: 'La vie étudiante, simplifiée.',
  description:
    'Achetez, vendez, trouvez un job, un logement ou un service près de votre campus.',
  currency: 'FCFA',
  currencyCode: 'XAF',
  country: 'Cameroun',
  primaryCity: 'Douala',
  language: 'fr',
  paymentMode: 'DEMO' as const,
  demoMode: true,
  founder: {
    name: 'Brayan Nelson Sop Kuate',
    role: 'Founder & Developer',
    bio: 'Étudiant en Software Engineering et passionné par la technologie, le développement logiciel et la création de solutions numériques adaptées aux besoins locaux.',
    github: 'https://github.com/brayankuate',
    linkedin: 'https://linkedin.com/in/brayankuate',
    email: 'contact@campuscm.cm',
  },
  supportEmail: 'support@campuscm.cm',
  social: {
    facebook: 'https://facebook.com/campuscm',
    twitter: 'https://twitter.com/campuscm',
    instagram: 'https://instagram.com/campuscm',
  },
  cities: ['Douala', 'Yaoundé', 'Buea', 'Bafoussam', 'Dschang', 'Bamenda', 'Ngaoundéré', 'Garoua'],
  featureFlags: {
    realTimeMessaging: false,
    pushNotifications: false,
    realPayments: false,
    emailNotifications: false,
  },
};

export type PaymentMode = typeof APP_CONFIG.paymentMode;
