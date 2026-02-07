'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { getIdToken } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    revenue: 0,
    pendingSlips: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await getIdToken();
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [getIdToken]);

  const handleSeed = async () => {
    if (!confirm('This will seed 16 products and sample banners. Continue?'))
      return;

    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Demo data seeded successfully!');
      } else {
        toast.error(data.error || 'Failed to seed data');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              onClick={handleSeed}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Seed Demo Data
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm">Paid Orders</p>
                <p className="text-3xl font-bold">{stats.paidOrders}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.revenue)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-gray-600 text-sm">Pending Slips</p>
                <p className="text-3xl font-bold">{stats.pendingSlips}</p>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
