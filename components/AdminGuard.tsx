'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!loading && !user) {
        router.push('/');
        return;
      }

      if (user) {
        try {
          const token = await getIdToken();
          const res = await fetch('/api/auth/check-admin', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          if (data.success && data.data.isAdmin) {
            setIsAdmin(true);
          } else {
            router.push('/');
          }
        } catch (error) {
          router.push('/');
        } finally {
          setChecking(false);
        }
      }
    }

    checkAdmin();
  }, [user, loading, router, getIdToken]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
