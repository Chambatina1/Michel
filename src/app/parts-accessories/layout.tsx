import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parts & Accessories',
  description:
    'Replacement parts and accessories for medical imaging equipment, including CT and MRI coils, probes, tubes and more.',
  alternates: { canonical: '/parts-accessories' },
  openGraph: {
    title: 'Parts & Accessories',
    description:
      'Replacement parts and accessories for medical imaging equipment, including CT and MRI coils, probes, tubes and more.',
    url: '/parts-accessories',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
