import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?orderSuccess=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      const friendlyMessage = error.message || 'Your payment could not be completed. Please try again.';
      setMessage(friendlyMessage);
      onError(friendlyMessage);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      const fallbackMessage = 'Your payment is still processing. Please check your email or try again shortly.';
      setMessage(fallbackMessage);
      onError(fallbackMessage);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Secure card payment</p>
            <p className="text-xs text-neutral-600">Complete your purchase safely with Stripe.</p>
          </div>
          <div className="rounded-full bg-gold/10 px-3 py-1 text-[10px] font-semibold text-gold">
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>

        <PaymentElement />
      </div>

      {message && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded border border-neutral-300 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-700 transition hover:bg-neutral-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isSubmitting}
          className="flex-1 rounded bg-leather px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Pay Now
            </span>
          )}
        </button>
      </div>
    </form>
  );
};
