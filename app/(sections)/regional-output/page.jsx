'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-static';

// This page has been moved to /regions
// Redirect to the new URL
export default function RegionalOutputRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/regions');
  }, [router]);

  return (
    <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: '#6B6860' }}>
      <p>Redirecting to <a href="/regions" style={{ color: '#0D6B4F' }}>Regions of Ireland</a>…</p>
    </div>
  );
}
