import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How P&S Medical Device Inc. collects, uses and protects the information you share with us.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'We collect the information you provide when you request a quote, contact us, submit equipment for sale, leave a review or place an order. This may include your name, company, email address, phone number, shipping address and details about the equipment you are interested in.',
            'Payments are processed by Stripe. We do not store your full card number on our servers.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          body: [
            'We use your information to respond to inquiries, prepare quotes, process and ship orders, provide service and support, and send updates you have asked to receive.',
          ],
        },
        {
          heading: 'Sharing',
          body: [
            'We do not sell your personal information. We share it only with providers that help us operate the business, such as payment processors, shipping carriers and messaging services, and when required by law.',
          ],
        },
        {
          heading: 'Your Choices',
          body: [
            'You may ask us to access, correct or delete the personal information we hold about you by emailing info@psmedicaldevices.com or calling +1 (305) 244-9340.',
          ],
        },
      ]}
    />
  );
}
