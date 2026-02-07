'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { PaymentMethod } from '@/types';

export default function PaySlipClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getIdToken } = useAuth();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    method: 'Bkash' as PaymentMethod,
    trxId: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      toast.error('Order ID is missing');
      return;
    }

    setLoading(true);

    try {
      let screenshotUrl = '';

      if (screenshot) {
        const storageRef = ref(
          storage,
          `payment-slips/${orderId}-${Date.now()}`,
        );
        await uploadBytes(storageRef, screenshot);
        screenshotUrl = await getDownloadURL(storageRef);
      }

      const token = await getIdToken();

      const res = await fetch('/api/payment-slips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          method: formData.method,
          trxId: formData.trxId,
          screenshotUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/thank-you?orderId=${orderId}`);
      } else {
        toast.error(data.error || 'Failed to submit payment slip');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Submit Payment Slip</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={formData.method}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        method: e.target.value as PaymentMethod,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Cash">Cash on Delivery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={5}
                    value={formData.trxId}
                    onChange={e =>
                      setFormData({ ...formData, trxId: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Enter transaction ID"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Minimum 5 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setScreenshot(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Upload payment confirmation screenshot
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Payment Slip'}
                </button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
