'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Banner } from '@/types';

export default function AdminBannersPage() {
  const { getIdToken } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/banners', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Banner deleted');
        fetchBanners();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  async function handleToggleActive(banner: Banner) {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Banner updated');
        fetchBanners();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Banners</h1>
            <button
              onClick={() => {
                setEditingBanner(null);
                setShowModal(true);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Banner
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {banners.map(banner => (
                <div
                  key={banner._id}
                  className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-48 h-32 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {banner.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Link: {banner.link}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Priority: {banner.priority}
                    </p>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <BannerModal
            banner={editingBanner}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchBanners();
            }}
          />
        )}
      </AdminLayout>
    </AdminGuard>
  );
}

function BannerModal({ banner, onClose, onSuccess }: any) {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    imageUrl: banner?.imageUrl || '',
    link: banner?.link || '/',
    priority: banner?.priority || 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getIdToken();
      const url = banner
        ? `/api/admin/banners/${banner._id}`
        : '/api/admin/banners';
      const method = banner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(banner ? 'Banner updated' : 'Banner created');
        onSuccess();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">
          {banner ? 'Edit' : 'Add'} Banner
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={e =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link *</label>
            <input
              type="text"
              required
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <input
              type="number"
              value={formData.priority}
              onChange={e =>
                setFormData({ ...formData, priority: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-md"
            />
            <p className="text-sm text-gray-600 mt-1">
              Higher priority banners appear first
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
