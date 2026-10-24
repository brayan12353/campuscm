import { APP_CONFIG } from '@/config/app';
import type { Payment } from '@/types';
import { generateId } from '@/utils/format';

const demoPayments = new Map<string, Payment>();

export interface PaymentRequest {
  userId: string;
  amount: number;
  type: 'subscription' | 'boost' | 'featured';
}

export interface PaymentResult {
  success: boolean;
  payment?: Payment;
  message: string;
  demoMode: boolean;
}

export const PaymentService = {
  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    if (APP_CONFIG.paymentMode === 'DEMO') {
      await new Promise((r) => setTimeout(r, 1500));
      const payment: Payment = {
        id: generateId(),
        userId: req.userId,
        amount: req.amount,
        type: req.type,
        status: 'completed',
        method: 'demo',
        createdAt: new Date().toISOString(),
        reference: `DEMO-${req.type.toUpperCase()}-${generateId().slice(0, 6)}`,
      };
      demoPayments.set(payment.id, payment);
      return {
        success: true,
        payment,
        message: 'Paiement simulé avec succès (Mode démonstration).',
        demoMode: true,
      };
    }
    return {
      success: false,
      message: 'Paiement non disponible en mode production.',
      demoMode: false,
    };
  },

  async checkPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed'> {
    return demoPayments.get(paymentId)?.status ?? 'failed';
  },

  async cancelPayment(paymentId: string): Promise<boolean> {
    const payment = demoPayments.get(paymentId);
    if (!payment || payment.status !== 'pending') return false;

    demoPayments.set(paymentId, { ...payment, status: 'failed' });
    return true;
  },
};
