import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

const faqs = [
  { q: 'Comment créer une annonce ?', a: "Cliquez sur le bouton '+' en bas de l'écran ou sur 'Créer une annonce'. Suivez les étapes : catégorie, photos, informations, prix, puis publiez." },
  { q: 'Mon annonce est-elle visible immédiatement ?', a: "Les annonces sont soumises à validation par notre équipe avant d'être publiées. Cela peut prendre jusqu'à 24h." },
  { q: 'Comment contacter un vendeur ?', a: "Sur la page d'une annonce, cliquez sur 'Contacter le vendeur' ou 'WhatsApp' si le vendeur a fourni son numéro." },
  { q: 'Comment signaler une annonce frauduleuse ?', a: "Sur la page de l'annonce, cliquez sur l'icône de signalement et sélectionnez le motif approprié. Notre équipe examinera le signalement." },
  { q: 'Comment devenir tuteur ?', a: "Rendez-vous sur la section Tutorat et créez votre profil de tuteur avec vos matières, tarifs et disponibilités." },
  { q: 'Les logements sont-ils vérifiés ?', a: "Nous vérifions les logements sur demande. Les logements affichant le badge 'Vérifié' ont été contrôlés par notre équipe." },
  { q: "Qu'est-ce que l'abonnement Premium ?", a: "L'abonnement Premium (1 000 FCFA/mois) vous permet de publier des annonces illimitées et de bénéficier d'une meilleure visibilité. En mode démo, aucun paiement réel n'est effectué." },
  { q: 'Comment puis-je supprimer mon compte ?', a: "Allez dans Paramètres > Compte > Supprimer mon compte. En mode démo, vous serez simplement déconnecté." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-3">
        <span className="font-medium text-sm text-gray-900">{q}</span>
        {open ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && <p className="text-sm text-gray-600 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
}

export function Help() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4 text-primary-600"><HelpCircle size={28} /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Centre d'aide</h1>
        <p className="text-gray-500">Trouvez des réponses à vos questions</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-1">Questions fréquentes</h2>
        <p className="text-sm text-gray-500 mb-4">Retrouvez les réponses aux questions les plus courantes</p>
        {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
      </div>

      <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
        <h3 className="font-bold text-gray-900 mb-1">Besoin d'aide supplémentaire ?</h3>
        <p className="text-sm text-gray-600 mb-4">Notre équipe est là pour vous aider.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`mailto:${APP_CONFIG.supportEmail}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Mail size={18} className="text-primary-600" /> {APP_CONFIG.supportEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
