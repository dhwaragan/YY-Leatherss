/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentFormProps {
  amount: number;
  orderId: string;
  razorpayKeyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: Record<string, string>;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({
  amount,
  orderId,
  razorpayKeyId,
  customerName,
  customerEmail,
  customerPhone,
  notes,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => onError('Failed to load Razorpay checkout SDK. Please try again.');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded || isProcessing || !window.Razorpay) {
      onError('Payment gateway is not ready yet. Please wait...');
      return;
    }

    setIsProcessing(true);

    try {
      const options = {
        key: razorpayKeyId,
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        name: 'YY Leathers',
        description: `Order Payment - ₹${amount.toLocaleString('en-IN')}`,
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: notes,
        theme: {
          color: '#8B4513', // Leather brown theme
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            onCancel();
          },
        },
        handler: function (response: any) {
          setIsProcessing(false);
          onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        onError(response.error.description || 'Payment failed. Please try again.');
      });

      razorpayInstance.open();
    } catch (error: any) {
      setIsProcessing(false);
      onError(error.message || 'Unable to open payment gateway.');
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <p className="font-bold mb-1">🛡️ Secured by Razorpay</p>
        <p>Your payment will be securely processed via Razorpay. All major UPI, Credit/Debit Cards, Net Banking, and Wallets are accepted.</p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 border border-neutral-300 text-neutral-700 font-sans text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePayment}
          disabled={!isScriptLoaded || isProcessing}
          className="flex-1 bg-leather hover:bg-gold text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-md shadow-md transition-all duration-350 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `PAY ₹${amount.toLocaleString('en-IN')}`
          )}
        </button>
      </div>

      {!isScriptLoaded && !isProcessing && (
        <p className="text-[10px] text-amber-600 text-center animate-pulse">
          Loading secure payment gateway...
        </p>
      )}
    </div>
  );
};