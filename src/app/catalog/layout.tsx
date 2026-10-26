import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Medical Equipment Catalog', template: '%s | P&S Medical Device Inc.' },
  description:
    'Browse new and refurbished CT scanners, MRI machines, X-Ray systems, ultrasound and ophthalmology equipment for sale.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    title: 'Medical Equipment Catalog',
    description:
      'Browse new and refurbished CT scanners, MRI machines, X-Ray systems, ultrasound and ophthalmology equipment for sale.',
    url: '/catalog',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
