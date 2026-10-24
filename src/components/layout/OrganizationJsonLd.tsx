"use client";

import { useSiteSettings } from "@/lib/useSiteSettings";
import { getCompanyInfo } from "@/lib/company";

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
    url: "https://psmedicaldevices.com",
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressCountry: "US",
    },
    sameAs,
    image: "https://psmedicaldevices.com/images/logo.jpeg",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
