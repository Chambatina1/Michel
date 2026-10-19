import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Blog & Industry Insights', template: '%s | P&S Medical Device Inc.' },
  description:
    'News, guides and insights on CT, MRI, X-Ray, ultrasound and ophthalmology equipment from the P&S Medical Device team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog & Industry Insights',
    description:
      'News, guides and insights on CT, MRI, X-Ray, ultrasound and ophthalmology equipment from the P&S Medical Device team.',
    url: '/blog',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
