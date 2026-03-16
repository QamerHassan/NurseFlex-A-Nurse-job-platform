"use client";
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();

  const handlePayment = () => {
    // Simulate API call
    setTimeout(() => {
      router.push('/payment/success');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 pt-20">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full border border-slate-100">
        <h2 className="text-2xl font-black mb-6">Complete Payment</h2>
        <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex justify-between font-bold">
          <span>Pro Business Tier</span>
          <span>$49.00</span>
        </div>
        <button 
          onClick={handlePayment}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all"
        >
          Pay & Download Receipt
        </button>
      </div>
    </div>
  );
}