'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatCurrency, calculateShipping } from '@/lib/utils';
import QuantitySelector from '@/components/QuantitySelector';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, updateQty, removeItem, cartTotal } = useCart();
  const shipping = calculateShipping(cartTotal);
  const total = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link
              href="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {items.map(item => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 border-b last:border-b-0"
                  >
                    <div className="relative w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-primary-600 font-bold mb-2">
                        {formatCurrency(item.price)}
                      </p>
                      <QuantitySelector
                        quantity={item.qty}
                        onIncrease={() =>
                          updateQty(item.productId, item.qty + 1)
                        }
                        onDecrease={() =>
                          updateQty(item.productId, item.qty - 1)
                        }
                        max={item.stock}
                      />
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="font-bold">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                    </span>
                  </div>
                  {cartTotal < 1000 && (
                    <p className="text-sm text-gray-600">
                      Add {formatCurrency(1000 - cartTotal)} more for free
                      shipping!
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 font-semibold"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
