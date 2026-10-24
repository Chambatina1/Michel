import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Medical equipment services: installation, repair, preventive maintenance, de-installation, relocation and expert advisory.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services',
    description:
      'Medical equipment services: installation, repair, preventive maintenance, de-installation, relocation and expert advisory.',
    url: '/services',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
