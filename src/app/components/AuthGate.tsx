'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_ROUTES = new Set<string>(['/login', '/signup']);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (PUBLIC_ROUTES.has(pathname)) return;
    if (!user || !token) router.replace('/login');
  }, [user, token, pathname, router]);

  if (!PUBLIC_ROUTES.has(pathname) && (!user || !token)) return null;
  return <>{children}</>;
}
