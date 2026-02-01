/**
 * @description Home page - Redirects to appropriate page based on auth status
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { FullPageLoader } from '@/components/ui';

/**
 * @description Home page component
 * Redirects users based on authentication status
 */
export default function HomePage() {
  const router = useRouter();
  const { user, isInitialized, initialize } = useUserStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        router.replace('/chat');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [isInitialized, user, router]);

  return <FullPageLoader />;
}
