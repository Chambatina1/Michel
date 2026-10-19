import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms that apply to using the P&S Medical Device Inc. website and purchasing equipment from us.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <LegalPage
        title="Terms of Service"
        updated="October 2026"
        sections={[
          {
            heading: 'Use of This Website',
            body: [
              'By using this website you agree to these terms. Product information, specifications and photos are provided for reference and may change without notice.',
            ],
          },
          {
            heading: 'Quotes, Pricing and Orders',
            body: [
              'Prices are listed in US dollars. Items marked "request a quote" or "negotiable" are priced on request. An order is confirmed only after payment is received and we confirm availability.',
            ],
          },
          {
            heading: 'Shipping, Returns and Warranty',
            body: [
              'Shipping costs and freight requirements are shown at checkout or included in your quote. Returns and warranty claims are handled under our Returns & Warranty Policy.',
            ],
          },
          {
            heading: 'Contact',
            body: ['Questions about these terms can be sent to info@psmedicaldevices.com or +1 (305) 244-9340.'],
          },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <Link href="/returns" className="text-sm font-medium text-teal-600 hover:underline">
          View our Returns &amp; Warranty Policy
        </Link>
      </div>
    </>
  );
}
