"use client";

import React, { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/subscriptions/create-payment-intent", {
                amount: Math.round(amount * 100),
                currency: 'usd'
            });

            const { clientSecret } = response.data;

            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success?amount=${amount}`,
                },
            });

            if (error) {
                setErrorMessage(error.message);
            }
        } catch (err) {
            setErrorMessage("An unexpected error occurred.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 mt-2 text-sm font-bold">{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
                className="text-white w-full p-4 bg-blue-600 mt-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {!loading ? `Pay $${amount}` : <Loader2 className="animate-spin" />}
            </button>
        </form>
    );
};

export default CheckoutPage;
