'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuantitySelector from '@/components/QuantitySelector';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          router.push('/');
        }
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      qty: quantity,
      imageUrl: product.images[0],
      stock: product.stock,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage] || '/placeholder.png'}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 rounded-md overflow-hidden ${
                        selectedImage === idx ? 'ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              <div className="text-3xl font-bold text-primary-600 mb-6">
                {formatCurrency(product.price)}
              </div>

              <div className="mb-6">
                <span className="text-sm text-gray-600">Category: </span>
                <span className="font-semibold">{product.category}</span>
              </div>

              <div className="mb-6">
                <span className="text-sm text-gray-600">Stock: </span>
                <span
                  className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={() => setQuantity(q => q + 1)}
                      onDecrease={() => setQuantity(q => q - 1)}
                      max={product.stock}
                    />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-semibold"
                  >
                    Add to Cart
                  </button>
                </>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
