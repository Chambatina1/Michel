"use client";

import { useSiteSettings } from "@/lib/useSiteSettings";
import { getCompanyInfo, COMPANY_DEFAULTS } from "@/lib/company";
import { SITE_URL } from "@/lib/site";

// Countries of the Americas the business exports to
const AREA_SERVED = [
  "United States", "Canada", "Mexico", "Guatemala", "Belize", "Honduras",
  "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba",
  "Dominican Republic", "Puerto Rico", "Haiti", "Jamaica", "Bahamas",
  "Trinidad and Tobago", "Colombia", "Venezuela", "Ecuador", "Peru",
  "Bolivia", "Chile", "Argentina", "Uruguay", "Paraguay", "Brazil",
  "Guyana", "Suriname",
];

// "540 N 70th Ave, Hollywood, FL 33024" -> structured address; falls back to the raw string
function postalAddress(address: string) {
  const match = address.match(/^(.+),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  if (!match) return { "@type": "PostalAddress", streetAddress: address, addressCountry: "US" };
  return {
    "@type": "PostalAddress",
    streetAddress: match[1].trim(),
    addressLocality: match[2].trim(),
    addressRegion: match[3],
    postalCode: match[4],
    addressCountry: "US",
  };
}

// Structured data for search engines, built from the same company info as the footer and Contact page.
export function OrganizationJsonLd() {
  const { settings } = useSiteSettings();
  const company = getCompanyInfo(settings);
  const sameAs = ["facebook_url", "instagram_url", "linkedin_url", "twitter_url", "youtube_url"]
    .map((key) => settings[key]?.trim())
    .filter((url): url is string => !!url && url !== "#");

  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: company.name,
    description: company.description,
    foundingDate: company.foundedYear,
    slogan: "Medical equipment by Cuban engineers. Free estimates, 5-year warranty, export to all of the Americas.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpeg`,
    telephone: company.phone,
    email: company.email,
    address: postalAddress(company.address),
    // Only the official default hours are known to be Mon-Fri 9-6; custom text is not parsed
    ...(company.hours === COMPANY_DEFAULTS.hours
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        }
      : {}),
    knowsLanguage: ["en", "es"],
    areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
    sameAs,
    image: `${SITE_URL}/images/logo.jpeg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
