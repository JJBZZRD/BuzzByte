'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CVPage() {
  const router = useRouter();

  useEffect(() => {
    // The page view will be automatically tracked by the AnalyticsProvider
    // We just need to wait a moment to ensure the analytics event is recorded
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 100); // Small delay to ensure analytics has time to fire

    return () => clearTimeout(redirectTimer);
  }, [router]);

  // Return an empty div - this page won't be visible as it redirects immediately
  return <div></div>;
} 