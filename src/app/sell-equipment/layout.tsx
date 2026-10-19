import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Medical Equipment',
  description:
    'Get a fair market offer for your used CT, MRI, X-Ray, ultrasound or ophthalmology equipment. Fast quotes and de-installation support.',
  alternates: { canonical: '/sell-equipment' },
  openGraph: {
    title: 'Sell Your Medical Equipment',
    description:
      'Get a fair market offer for your used CT, MRI, X-Ray, ultrasound or ophthalmology equipment. Fast quotes and de-installation support.',
    url: '/sell-equipment',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
