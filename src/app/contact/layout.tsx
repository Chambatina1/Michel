import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact P&S Medical Device Inc. for quotes, equipment availability, service and support. Call +1 (305) 244-9340.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us',
    description:
      'Contact P&S Medical Device Inc. for quotes, equipment availability, service and support. Call +1 (305) 244-9340.',
    url: '/contact',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
