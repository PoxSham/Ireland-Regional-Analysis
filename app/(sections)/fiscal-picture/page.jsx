'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-static';

// This page has been moved to /taxes-and-spending
export default function FiscalPictureRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/taxes-and-spending');
  }, [router]);

  return (
    <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: '#6B6860' }}>
      <p>Redirecting to <a href="/taxes-and-spending" style={{ color: '#0D6B4F' }}>Taxes &amp; Spending</a>…</p>
    </div>
  );
}
