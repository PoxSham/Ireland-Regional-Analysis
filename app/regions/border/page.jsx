'use client';
import regionsData from '../../data/regions.json';
import RegionPage from '../RegionPage';
export const dynamic = 'force-static';
export default function Page() {
  const r = regionsData.find(x => x.id === 'northwest');
  return <RegionPage regionData={r} allRegions={regionsData} />;
}
