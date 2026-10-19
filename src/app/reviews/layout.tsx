import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description:
    'Read what hospitals, clinics and imaging centers say about buying and servicing equipment with P&S Medical Device Inc.',
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: 'Customer Reviews',
    description:
      'Read what hospitals, clinics and imaging centers say about buying and servicing equipment with P&S Medical Device Inc.',
    url: '/reviews',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
