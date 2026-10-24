// Canonical public URL of the site, used for SEO (sitemap, canonical links, structured data)
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://psmedicaldevices.com').replace(/\/$/, '');

export const SITE_NAME = 'P&S Medical Device Inc.';

export const DEFAULT_OG_IMAGE = '/images/hero-banner.jpg';

// Uploaded images are stored as data: URLs, which can't be used in meta tags
export function publicImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return undefined;
}

export function truncate(text: string, max = 160): string {
  const clean = text.replace(/[#*_`>\[\]]/g, '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
