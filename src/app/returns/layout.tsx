import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Warranty Policy',
  description:
    'Return, refund and warranty policy for medical equipment purchased from P&S Medical Device Inc.',
  alternates: { canonical: '/returns' },
  openGraph: {
    title: 'Returns & Warranty Policy',
    description:
      'Return, refund and warranty policy for medical equipment purchased from P&S Medical Device Inc.',
    url: '/returns',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
