// Starter drafts for the legal pages. They are NOT published automatically:
// the admin loads one into the editor, the company fills in the [bracketed] items,
// has it reviewed, and saves it. Until then the public page shows a short notice.

export interface LegalPageDef {
  slug: 'terms' | 'privacy' | 'returns';
  key: string; // SiteSettings prefix: <key>_title, <key>_content, <key>_updated
  defaultTitle: string;
  adminLabel: string;
  draft: string;
}

const TERMS_DRAFT = `## 1. About these terms

These Terms of Service apply to the use of psmedicaldevices.com and to quotes and purchases made through it from P&S Medical Device Inc. ("we", "us"). By using the site you agree to these terms.

## 2. Products and information

Product descriptions, photos and specifications are provided for reference. Condition, included accessories and configuration for each unit are confirmed in the written quote or invoice. Availability can change without notice.

## 3. Quotes, prices and payment

Prices shown on the site, if any, are in US dollars and may change. A quote is valid for [number] days unless it states otherwise. Accepted payment methods are [list]. Applicable taxes and shipping are [included / quoted separately].

## 4. Shipping and delivery

Shipping method, cost and estimated delivery are confirmed for each order. Risk of loss passes to the buyer [at delivery / when the carrier picks up the equipment].

## 5. Warranty

Warranty coverage, if any, is set individually for each product and stated in the quote or invoice. No warranty applies unless it is stated in writing.

## 6. Returns

Returns are governed by our [Return Policy](/returns).

## 7. Regulatory responsibility

Buyers are responsible for confirming that equipment is suitable for their intended use and for any licensing, registration, installation or inspection requirements in their jurisdiction.

## 8. Limitation of liability

[To be completed with legal counsel.]

## 9. Governing law

These terms are governed by the laws of the State of Florida, USA.

## 10. Contact

Questions about these terms: [email] or [phone].`;

const PRIVACY_DRAFT = `## 1. Who we are

P&S Medical Device Inc. operates psmedicaldevices.com. This policy explains what personal information we collect through the site and how we use it.

## 2. Information we collect

- Information you send us through contact, quote, "sell your equipment" and subscription forms: name, email, phone, company and message.
- Order information needed to process a purchase. Card payments are processed by our payment provider; we do not store full card numbers.
- Messages you send through the site chat or WhatsApp.
- Basic technical data such as browser type and pages visited.

## 3. How we use it

To answer your requests, prepare quotes, process orders, send the emails you asked for (for example a discount code), and improve the site. We do not sell your personal information.

## 4. Sharing

We share information only with service providers that help us run the site and process orders (for example hosting, payments and email), or when required by law.

## 5. Your choices

You can ask us to access, correct or delete your information, or to stop sending you marketing emails, by writing to [email].

## 6. Retention

We keep information only as long as needed for the purposes above or as required by law.

## 7. Changes

We may update this policy. The date at the top shows the latest version.

## 8. Contact

[email] · [phone] · [address]`;

const RETURNS_DRAFT = `## Overview

This policy explains how returns and warranty claims work for equipment and parts bought from P&S Medical Device Inc. The specific warranty for each unit, if any, is stated in its quote or invoice.

## Returns

- Requests must be made within [number] days of delivery.
- Contact us at [email] or [phone] with your order or invoice number before sending anything back.
- Equipment must be returned [in its original condition / with all accessories].
- [Items that cannot be returned, if any.]

## Refunds

[How and when refunds are issued, and any fees that apply.]

## Shipping damage

Please inspect equipment on delivery and report visible damage within [number] days, with photos.

## Warranty claims

Contact us with the invoice number, serial number and a description of the issue. Coverage and remedies are those stated in the quote or invoice for that unit.

## Contact

[email] · [phone]`;

export const LEGAL_PAGES: LegalPageDef[] = [
  { slug: 'terms', key: 'legal_terms', defaultTitle: 'Terms of Service', adminLabel: 'Terminos de Servicio', draft: TERMS_DRAFT },
  { slug: 'privacy', key: 'legal_privacy', defaultTitle: 'Privacy Policy', adminLabel: 'Politica de Privacidad', draft: PRIVACY_DRAFT },
  { slug: 'returns', key: 'legal_returns', defaultTitle: 'Return & Warranty Policy', adminLabel: 'Devoluciones y Garantias', draft: RETURNS_DRAFT },
];

export function getLegalPage(slug: LegalPageDef['slug']): LegalPageDef {
  return LEGAL_PAGES.find((p) => p.slug === slug)!;
}
