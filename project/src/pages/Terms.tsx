import { AlertTriangle } from 'lucide-react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Conditions d'utilisation</h1>
      <p className="text-sm text-gray-500 mb-6">Dernière mise à jour: Septembre 2026</p>

      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertTriangle size={20} className="text-warning-600 shrink-0 mt-0.5" />
        <p className="text-sm text-warning-800">
          <strong>Avertissement légal:</strong> Cette page contient des mentions légales provisoires. Ces conditions doivent être révisées par un professionnel juridique qualifié avant mise en production. Elles ne constituent pas un avis juridique définitif.
        </p>
      </div>

      {[
        { title: '1. Acceptation des conditions', content: 'En utilisant CampusCM, vous acceptez ces conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.' },
        { title: '2. Description du service', content: 'CampusCM est une plateforme numérique destinée aux étudiants camerounais. Elle permet la publication d\'annonces, la recherche de jobs, de logements, de services et de tuteurs.' },
        { title: '3. Inscription et compte', content: 'Vous devez fournir des informations exactes lors de votre inscription. Vous êtes responsable de la sécurité de votre compte et de toutes les activités qui en découlent.' },
        { title: '4. Contenu des utilisateurs', content: 'Vous êtes responsable du contenu que vous publiez sur CampusCM. Vous ne pouvez pas publier de contenu illégal, trompeur, diffamatoire ou qui viole les droits de tiers.' },
        { title: '5. Transactions', content: 'CampusCM est une plateforme de mise en relation. Les transactions se font directement entre utilisateurs. CampusCM n\'est pas responsable des transactions effectuées entre utilisateurs. Ne versez jamais d\'argent sans avoir vérifié l\'identité du vendeur.' },
        { title: '6. Paiements', content: 'En mode démonstration actuel, aucun paiement réel n\'est traité. Les fonctionnalités de paiement sont simulées à des fins de démonstration uniquement.' },
        { title: '7. Confidentialité', content: 'Votre vie privée est importante pour nous. Consultez notre politique de confidentialité pour comprendre comment nous traitons vos données.' },
        { title: '8. Modifications', content: 'CampusCM se réserve le droit de modifier ces conditions. Les utilisateurs seront informés des modifications importantes.' },
        { title: '9. Contact', content: 'Pour toute question concernant ces conditions, contactez-nous à support@campuscm.cm.' },
      ].map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-2">{section.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
