'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-static';

// This page has been moved to /households
export default function HouseholdIncomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/households');
  }, [router]);

  return (
    <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: '#6B6860' }}>
      <p>Redirecting to <a href="/households" style={{ color: '#0D6B4F' }}>Households &amp; Cost of Living</a>…</p>
    </div>
  );
}
