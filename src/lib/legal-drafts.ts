// Default text for the legal pages. The public page shows it until the admin saves
// its own version in Admin > Paginas Legales ("Cargar texto base" loads it into the editor).
// {company}, {email}, {phone}, {address} and {website} are filled in from the company info.

export interface LegalPageDef {
  slug: 'terms' | 'privacy' | 'returns';
  key: string; // SiteSettings prefix: <key>_title, <key>_content, <key>_updated
  defaultTitle: string;
  adminLabel: string;
  draft: string;
}

// Date shown on the default text; change it when the default text changes.
export const LEGAL_DEFAULT_UPDATED = '2026-10-28';

const TERMS_DRAFT = `These Terms of Service ("Terms") govern your use of {website} (the "Site") and any quote, order or purchase of equipment, parts or services from {company} ("we", "us", "our"). By using the Site or placing an order you agree to these Terms. If you do not agree, please do not use the Site.

## 1. Who may buy

The Site is intended for businesses and professionals in the healthcare industry, such as hospitals, clinics, imaging centers, physicians, dealers and biomedical service companies. By placing an order you confirm that you are at least 18 years old and authorized to buy on behalf of your organization.

## 2. Product information

We describe each unit as accurately as we can. Photos may show a representative unit, and specifications, software versions and included accessories can vary. The condition (new, used or refurbished), included items and any warranty for a specific unit are those stated in its listing, quote or invoice. If something is unclear, ask us before buying.

## 3. Prices and quotes

- Prices are in US dollars and do not include taxes, shipping, rigging, installation or import duties unless stated.
- Items marked "Request Quote" are priced individually. Written quotes are valid for **30 days** unless they state otherwise.
- Inventory is limited and items can sell at any time. If an item you paid for is no longer available, we will refund you in full.
- We may correct pricing or listing errors and cancel orders affected by them, with a full refund of any amount paid.

## 4. Orders and payment

An order is accepted when we confirm it by email or invoice. We accept credit and debit cards processed securely by Stripe, and bank wire, ACH or company check for invoiced orders. For invoiced orders, equipment ships after payment has cleared unless we agree on other terms in writing.

## 5. Shipping and delivery

Shipping method, cost and estimated delivery are confirmed for each order. Large equipment usually ships by freight and may require a loading dock, forklift or rigging at your location, which is the buyer's responsibility unless included in the quote. Delivery dates are estimates. Title and risk of loss pass to the buyer when the equipment is handed to the carrier, unless the quote states otherwise. Please inspect deliveries as described in our [Return & Warranty Policy](/returns).

## 6. Warranty

Any warranty is specific to each unit and is stated in its listing, quote or invoice. If no warranty is stated, the item is sold **as is**. Warranty claims follow our [Return & Warranty Policy](/returns). Except for the warranty expressly stated in writing, and to the extent permitted by law, we disclaim all other warranties, express or implied, including merchantability and fitness for a particular purpose.

## 7. Returns

Returns and refunds are governed by our [Return & Warranty Policy](/returns).

## 8. Regulatory responsibility

Many medical devices are restricted to sale to or on the order of licensed practitioners. The buyer is responsible for confirming that the equipment suits its intended use and for any licensing, registration, radiation safety, installation, calibration, inspection or other requirements that apply where the equipment will be used. Equipment must be installed and operated by qualified personnel.

## 9. Selling equipment to us

Offers we make for your equipment through the "Sell Your Equipment" form are not binding until we inspect the equipment and confirm the offer in writing. You confirm that you own the equipment and have the right to sell it.

## 10. Use of the Site

You agree not to misuse the Site, interfere with its operation, try to access areas that are not public, or copy its content for commercial use without permission. Site content, including text, photos and logos, belongs to us or our licensors.

## 11. Limitation of liability

To the extent permitted by law, we are not liable for indirect, incidental, special or consequential damages, including lost profits, lost revenue or downtime. Our total liability for any claim related to an order is limited to the amount you paid for the item involved.

## 12. Governing law

These Terms are governed by the laws of the State of Florida, USA. Any dispute will be resolved in the state or federal courts located in Broward County, Florida.

## 13. Changes

We may update these Terms. The date at the top of this page shows the latest version. Orders are governed by the Terms in effect when the order was accepted.

## 14. Contact

{company}
{address}
Email: [{email}](mailto:{email})
Phone: {phone}`;

const PRIVACY_DRAFT = `This Privacy Policy explains how {company} ("we", "us") collects, uses and protects personal information when you visit {website} (the "Site"), contact us or buy from us.

## 1. Information we collect

**Information you give us**
- Contact, quote, "Sell Your Equipment", review and newsletter forms: name, email, phone, company, and the details you write in the message.
- Orders: name, company, shipping and billing address, email, phone and the items ordered.
- Chat and WhatsApp: the messages you send us.

**Payment information**
Card payments are processed by Stripe. Your card number goes directly to Stripe; we do not receive or store full card numbers. Stripe's use of your information is described in its own privacy policy.

**Information collected automatically**
Our hosting provider records basic technical data such as IP address, browser type, pages visited and the date and time of each visit, to keep the Site working and secure. The Site uses the browser's local storage to remember your cart and whether you closed the subscription offer.

## 2. How we use it

- To answer your questions and prepare quotes.
- To process orders, payments, shipping and warranty or return requests.
- To evaluate equipment you offer to sell us.
- To send emails you asked for, such as a discount code or newsletter. You can unsubscribe at any time.
- To operate, protect and improve the Site, and to comply with legal obligations.

We do not sell or rent your personal information.

## 3. Website chat

The chat assistant on the Site answers questions automatically using an artificial intelligence service. Messages you type in the chat are sent to that service to generate a reply and are stored by us so our team can follow up. Please do not share sensitive personal or patient information in the chat.

## 4. Who we share it with

We share information only as needed with service providers that help us run our business, such as website hosting, payment processing (Stripe), email delivery, the AI chat provider, messaging (WhatsApp) and shipping carriers. We may also disclose information when required by law or to protect our rights.

## 5. Patient information

The Site is not intended for patient health information. Do not send us protected health information. If equipment you sell to us may contain patient data, tell us so it can be handled properly.

## 6. How long we keep it

We keep personal information for as long as needed for the purposes above, for example to support orders, warranties and accounting, or as required by law. Then we delete it or make it anonymous.

## 7. Security

We use reasonable safeguards to protect personal information, including encrypted (HTTPS) connections. No method of transmission or storage is completely secure.

## 8. Your choices and rights

You can ask us to access, correct or delete your personal information, or to stop sending you marketing emails, by writing to [{email}](mailto:{email}). Depending on where you live, you may have additional rights under local law, and we will honor them as required.

## 9. Children

The Site is intended for businesses and is not directed to children under 13. We do not knowingly collect information from children.

## 10. Changes

We may update this policy. The date at the top of this page shows the latest version.

## 11. Contact

{company}
{address}
Email: [{email}](mailto:{email})
Phone: {phone}`;

const RETURNS_DRAFT = `This policy explains how returns, refunds and warranty claims work for equipment, parts and accessories bought from {company}; the warranty for each unit, if any, is the one stated in its listing, quote or invoice.

## 1. Inspect your delivery

- Inspect the shipment when it arrives, **before signing** the delivery receipt. Note any visible damage on the receipt and take photos.
- Report shipping damage or missing items to us within **48 hours** of delivery at [{email}](mailto:{email}) or {phone}, with photos and your order or invoice number.
- Keep all packaging until the claim is resolved. Damage that is not reported in time may not be covered by the carrier.

## 2. Large equipment (imaging and ophthalmology systems)

Because each system is sold individually and often prepared to order, sales of large equipment are final, except in these cases:

- **Dead on arrival or not as described:** if the equipment does not power on or work as described in its listing or quote, report it within **7 days** of delivery. We will troubleshoot with you and then repair, replace or refund at our choice.
- **Covered by warranty:** issues covered by the written warranty for that unit are handled as described in section 5.

## 3. Parts and accessories

- Unused parts and accessories in their original condition and packaging can be returned within **30 days** of delivery.
- Returns that are not due to our error may have a **15% restocking fee**, and the return shipping is paid by the buyer.
- Defective parts or wrong items sent by us are replaced or refunded at no cost, including return shipping.
- Parts that have been installed, modified or damaged after delivery, special-order items, and consumables that have been opened cannot be returned unless defective.

## 4. How to return an item

1. Contact us before sending anything back, with your order or invoice number, the item and the reason.
2. We will send you a Return Authorization (RA) number and return instructions.
3. Pack the item securely, write the RA number on the package and ship it to the address we provide.

Returns sent without an RA number may be refused.

## 5. Warranty claims

Contact us with the invoice number, the unit's serial number and a description of the problem, plus photos, videos or error messages if available. We will diagnose the issue with you, remotely when possible. Covered parts are repaired or replaced as stated in the warranty for that unit. Warranties do not cover damage from misuse, accidents, improper installation, power surges, unauthorized repairs or normal wear, or consumables such as batteries, bulbs, gel and paper.

## 6. Refunds

Approved refunds are issued to the original payment method within **10 business days** after we receive and inspect the returned item. Original shipping, freight, rigging and installation charges are not refundable unless the return is due to our error.

## 7. Contact

{company}
{address}
Email: [{email}](mailto:{email})
Phone: {phone}`;

export const LEGAL_PAGES: LegalPageDef[] = [
  { slug: 'terms', key: 'legal_terms', defaultTitle: 'Terms of Service', adminLabel: 'Terminos de Servicio', draft: TERMS_DRAFT },
  { slug: 'privacy', key: 'legal_privacy', defaultTitle: 'Privacy Policy', adminLabel: 'Politica de Privacidad', draft: PRIVACY_DRAFT },
  { slug: 'returns', key: 'legal_returns', defaultTitle: 'Return & Warranty Policy', adminLabel: 'Devoluciones y Garantias', draft: RETURNS_DRAFT },
];

export function getLegalPage(slug: LegalPageDef['slug']): LegalPageDef {
  return LEGAL_PAGES.find((p) => p.slug === slug)!;
}

// Fills the {placeholders} in a default legal text with the company's details.
export function fillLegalText(
  text: string,
  company: { name: string; email: string; phone: string; address: string }
): string {
  return text
    .replace(/\{company\}/g, company.name)
    .replace(/\{email\}/g, company.email)
    .replace(/\{phone\}/g, company.phone)
    .replace(/\{address\}/g, company.address)
    .replace(/\{website\}/g, 'psmedicaldevices.com');
}
