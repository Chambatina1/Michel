import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about P&S Medical Device Inc., a trusted partner for new and refurbished medical imaging equipment, expert advisory, repair and equipment buybacks.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us',
    description:
      'Learn about P&S Medical Device Inc., a trusted partner for new and refurbished medical imaging equipment, expert advisory, repair and equipment buybacks.',
    url: '/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
