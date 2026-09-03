import { AlertTriangle } from 'lucide-react';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-gray-500 mb-6">Dernière mise à jour: Septembre 2026</p>

      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertTriangle size={20} className="text-warning-600 shrink-0 mt-0.5" />
        <p className="text-sm text-warning-800">
          <strong>Avertissement légal:</strong> Cette politique de confidentialité est provisoire et doit être révisée par un professionnel juridique qualifié avant mise en production. Elle ne constitue pas un document légal définitif.
        </p>
      </div>

      {[
        { title: '1. Informations collectées', content: 'Nous collectons les informations que vous nous fournissez lors de votre inscription (nom, email, ville, université), ainsi que les données d\'utilisation de la plateforme.' },
        { title: '2. Utilisation des données', content: 'Vos données sont utilisées pour vous fournir nos services, améliorer la plateforme, et vous envoyer des notifications pertinentes. Nous ne vendons pas vos données à des tiers.' },
        { title: '3. Partage des données', content: 'Vos informations publiques (nom, annonces, avis) sont visibles par les autres utilisateurs. Vos informations privées (email, téléphone) ne sont jamais affichées publiquement.' },
        { title: '4. Sécurité', content: 'Nous mettons en œuvre des mesures de sécurité pour protéger vos données. Cependant, aucun système n\'est parfaitement sécurisé. Utilisez un mot de passe fort et ne partagez pas vos identifiants.' },
        { title: '5. Cookies', content: 'Nous utilisons le stockage local du navigateur pour sauvegarder vos préférences (ville, favoris). En mode démo, aucune donnée sensible n\'est stockée.' },
        { title: '6. Vos droits', content: 'Vous avez le droit d\'accéder, corriger ou supprimer vos données. Pour exercer ces droits, contactez-nous à support@campuscm.cm.' },
        { title: '7. Contact', content: 'Pour toute question relative à la confidentialité, contactez-nous à support@campuscm.cm.' },
      ].map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-2">{section.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
