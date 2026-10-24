// Single source of truth for the official company information shown on the site.
// Values come from SiteSettings (Admin > Configuracion > Informacion de la Empresa).
// The defaults below only show while settings load or if the database is unreachable,
// so they must match the official data stored in the admin.

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  foundedYear: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  mapUrl: string;
  whatsapp: string;
  googleReviewUrl: string;
}

export const COMPANY_DEFAULTS: CompanyInfo = {
  name: 'P&S Medical Device Inc.',
  tagline: 'Medical Imaging & Ophthalmology Equipment',
  description:
    'P&S Medical Device Inc. buys, sells, refurbishes and services medical equipment, mainly diagnostic imaging and ophthalmology systems.',
  foundedYear: '2018',
  phone: '+1 (305) 244-9340',
  email: 'psmedicaldevice@gmail.com',
  address: '540 N 70th Ave, Hollywood, FL 33024',
  hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
  mapUrl: '',
  whatsapp: '+13052449340',
  googleReviewUrl: '',
};

// Reads the official key first, then the older duplicate key some records still use.
function pick(settings: Record<string, string>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = settings[key]?.trim();
    if (value) return value;
  }
  return fallback;
}

export function getCompanyInfo(settings: Record<string, string>): CompanyInfo {
  return {
    name: pick(settings, ['company_name'], COMPANY_DEFAULTS.name),
    tagline: pick(settings, ['tagline'], COMPANY_DEFAULTS.tagline),
    description: pick(settings, ['company_description'], COMPANY_DEFAULTS.description),
    foundedYear: pick(settings, ['company_founded_year'], COMPANY_DEFAULTS.foundedYear),
    phone: pick(settings, ['contact_phone', 'phone'], COMPANY_DEFAULTS.phone),
    email: pick(settings, ['contact_email', 'email'], COMPANY_DEFAULTS.email),
    address: pick(settings, ['contact_address', 'address'], COMPANY_DEFAULTS.address),
    hours: pick(settings, ['contact_hours', 'hours'], COMPANY_DEFAULTS.hours),
    mapUrl: pick(settings, ['contact_map_url'], COMPANY_DEFAULTS.mapUrl),
    whatsapp: pick(settings, ['whatsapp_phone'], COMPANY_DEFAULTS.whatsapp),
    googleReviewUrl: pick(settings, ['google_review_url'], COMPANY_DEFAULTS.googleReviewUrl),
  };
}

// Server-side read for API routes (chat, WhatsApp) that can't use the client hook.
export async function loadCompanyInfo(): Promise<CompanyInfo> {
  try {
    const { db } = await import('@/lib/db');
    const rows = await db.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    return getCompanyInfo(settings);
  } catch (error) {
    console.error('Could not load company info:', error);
    return COMPANY_DEFAULTS;
  }
}

// "value | label | description" per line, used by the editable stats lists.
export function parseLines(raw: string | undefined, parts: number): string[][] {
  return (raw || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cells = line.split('|').map((c) => c.trim());
      while (cells.length < parts) cells.push('');
      return cells.slice(0, parts);
    });
}
