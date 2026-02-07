'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bannersRes, productsRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/products'),
        ]);

        if (bannersRes.ok) {
          const bannersData = await bannersRes.json();
          if (bannersData.success) setBanners(bannersData.data);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.success) setProducts(productsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {banners.length > 0 && <BannerSlider banners={banners} />}

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8">Our Products</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-yellow-200 p-8">
                <p className="text-gray-700 text-lg mb-4 font-semibold">
                  No products available at the moment.
                </p>
                <p className="text-gray-600 mb-6">
                  Please sign in as admin and seed demo data to get started.
                </p>
                <div className="bg-white p-6 rounded-md inline-block text-left shadow-sm max-w-md">
                  <p className="font-semibold mb-3 text-primary-600">
                    📝 Steps to add products:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Sign in with Google (use admin email from .env)</li>
                    <li>
                      Navigate to{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        /admin
                      </code>{' '}
                      page
                    </li>
                    <li>
                      Click <strong>"Seed Demo Data"</strong> button
                    </li>
                    <li>
                      16 grocery products will be created automatically! 🛒
                    </li>
                  </ol>
                  <p className="mt-4 text-xs text-gray-500">
                    Make sure your MongoDB connection is working and
                    ADMIN_EMAILS is set in .env
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
