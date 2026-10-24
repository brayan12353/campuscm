import { useState } from 'react';
import { Check, Crown, Zap, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { PaymentService } from '@/services/payment';
import { subscriptionPlans, boostOptions } from '@/data/mock';
import { formatPrice } from '@/utils/format';

const planIcons = { free: Zap, premium: Crown, business: Building2 };
const planColors = { free: 'border-gray-200', premium: 'border-primary-400 ring-2 ring-primary-100', business: 'border-accent-400 ring-2 ring-accent-100' };

export function Subscription() {
  const { currentUser } = useApp();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStep, setPayStep] = useState<'select' | 'processing' | 'done' | 'failed'>('select');
  const [paymentError, setPaymentError] = useState('');

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setSelectedBoost(null);
    setShowPayModal(true);
    setPayStep('select');
  };

  const handleSelectBoost = (boostId: string) => {
    setSelectedBoost(boostId);
    setSelectedPlan(null);
    setShowPayModal(true);
    setPayStep('select');
  };

  const handlePay = async () => {
    if (loading) return;

    const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
    const boost = boostOptions.find((b) => b.id === selectedBoost);
    const amount = plan ? plan.price : boost ? boost.price : 0;
    if (amount === 0) {
      showToast('Le plan gratuit ne nécessite aucun paiement.', 'info');
      setShowPayModal(false);
      return;
    }

    setLoading(true);
    setPaymentError('');
    setPayStep('processing');
    try {
      const result = await PaymentService.createPayment({
        userId: currentUser?.id || 'demo',
        amount,
        type: selectedPlan ? 'subscription' : 'boost',
      });

      if (!result.success) {
        setPaymentError(result.message);
        setPayStep('failed');
        showToast(result.message, 'error');
        return;
      }

      setPayStep('done');
      showToast(result.message, result.demoMode ? 'info' : 'success');
    } catch (error) {
      console.error('Could not process CampusCM payment.', error);
      const message = 'Le paiement est temporairement indisponible. Veuillez réessayer.';
      setPaymentError(message);
      setPayStep('failed');
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = subscriptionPlans.find((p) => p.id === selectedPlan) || boostOptions.find((b) => b.id === selectedBoost);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Abonnement</h1>
      <p className="text-sm text-gray-500 mb-6">Choisissez le plan adapté à vos besoins</p>

      {/* Demo banner */}
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-6 flex items-center gap-3">
        <AlertCircle size={18} className="text-warning-600 shrink-0" />
        <p className="text-sm text-warning-800 font-medium">Mode démonstration — Aucun paiement réel ne sera effectué</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {subscriptionPlans.map((plan) => {
          const Icon = planIcons[plan.id as keyof typeof planIcons];
          const isCurrent = currentUser?.subscriptionPlan === plan.id;
          return (
            <div key={plan.id} className={`bg-white rounded-2xl border p-5 flex flex-col ${planColors[plan.id as keyof typeof planColors]}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={22} className={plan.id === 'premium' ? 'text-primary-600' : plan.id === 'business' ? 'text-accent-600' : 'text-gray-400'} />
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                {isCurrent && <span className="ml-auto text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full font-medium">Actuel</span>}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{plan.price === 0 ? 'Gratuit' : formatPrice(plan.price)}</p>
              {plan.price > 0 && <p className="text-xs text-gray-500 mb-4">par mois</p>}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-success-600 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.id === 'premium' ? 'primary' : 'outline'}
                fullWidth
                disabled={isCurrent}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {isCurrent ? 'Plan actuel' : plan.price === 0 ? 'Activer' : 'Choisir'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Boosts */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">Booster une annonce</h2>
      <p className="text-sm text-gray-500 mb-4">Augmentez la visibilité de vos annonces pendant une durée limitée</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {boostOptions.map((boost) => (
          <div key={boost.id} className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="font-bold text-gray-900 mb-1">{boost.name}</h4>
            <p className="text-2xl font-bold text-primary-600 mb-0.5">{formatPrice(boost.price)}</p>
            <p className="text-xs text-gray-500 mb-4">Durée: {boost.duration}</p>
            <Button variant="outline" fullWidth size="sm" onClick={() => handleSelectBoost(boost.id)}>Booster</Button>
          </div>
        ))}
      </div>

      {/* Payment modal */}
      <Modal open={showPayModal} onClose={() => setShowPayModal(false)} title="Paiement" size="sm">
        {payStep === 'select' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Sélection</p>
              <p className="font-bold text-gray-900">{selectedItem && 'name' in selectedItem ? selectedItem.name : ''}</p>
              <p className="text-xl font-bold text-primary-600">{'price' in (selectedItem || {}) ? formatPrice((selectedItem as { price: number }).price) : ''}</p>
            </div>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-3">
              <p className="text-xs text-warning-800 font-semibold text-center">Mode DÉMO — Aucun paiement réel</p>
              <p className="text-xs text-warning-700 text-center mt-0.5">Référence simulée uniquement</p>
            </div>
            <Button fullWidth size="lg" onClick={handlePay} disabled={loading}>Simuler le paiement</Button>
            <Button variant="ghost" fullWidth onClick={() => setShowPayModal(false)} disabled={loading}>Annuler</Button>
          </div>
        )}
        {payStep === 'processing' && (
          <div className="text-center py-8">
            <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-900">Traitement en cours...</p>
          </div>
        )}
        {payStep === 'done' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-success-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Paiement simulé !</h3>
            <p className="text-sm text-gray-500 mb-1">Transaction de démonstration enregistrée.</p>
            <p className="text-xs text-gray-400 mb-6">Aucun montant réel n'a été débité.</p>
            <Button fullWidth onClick={() => setShowPayModal(false)}>Fermer</Button>
          </div>
        )}
        {payStep === 'failed' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-error-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Paiement indisponible</h3>
            <p className="text-sm text-gray-500 mb-6">{paymentError}</p>
            <Button fullWidth onClick={() => setPayStep('select')}>Réessayer</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
