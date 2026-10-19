import { db } from '@/lib/db';

// Subscriber discount ("Subscribe & save"). Text and percentage are editable
// from Admin > Configuracion > Promocion and stored in SiteSettings.
export const PROMO_DEFAULTS: Record<string, string> = {
  promo_enabled: 'true',
  promo_percent: '5',
  promo_bar_text: 'Subscribe & save 5% on parts and accessories',
  promo_title: 'Subscribe & save 5% on parts and accessories',
  promo_subtitle: 'Your one-time code - parts & accessories only (equipment excluded)',
  promo_button_text: 'Get my 5% code',
  promo_success_text: 'Use this code at checkout. Valid once, on parts & accessories only.',
  promo_popup_delay: '8',
};

export const NEWSLETTER_LEAD_TYPE = 'newsletter';

export async function getPromoSettings() {
  const rows = await db.siteSettings.findMany({
    where: { key: { in: Object.keys(PROMO_DEFAULTS) } },
  });
  const settings = { ...PROMO_DEFAULTS };
  for (const row of rows) {
    if (row.value.trim()) settings[row.key] = row.value;
  }
  const percent = Math.min(Math.max(parseFloat(settings.promo_percent) || 0, 0), 100);
  return { settings, enabled: settings.promo_enabled !== 'false' && percent > 0, percent };
}

export function isAccessoryProduct(product: { category?: string | null; parentCategory?: string | null; subCategory?: string | null }) {
  return [product.parentCategory, product.category, product.subCategory].some(
    (v) => !!v && /part|accessor|adapter|repuesto|accesorio/i.test(v)
  );
}

export function generatePromoCode(percent: number) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `PS${Math.round(percent)}-${suffix}`;
}

export function normalizePromoCode(code: unknown) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

// A code is valid while its subscriber lead hasn't been marked "converted" (used).
export async function findUnusedPromoLead(code: string) {
  if (!code) return null;
  return db.lead.findFirst({
    where: { type: NEWSLETTER_LEAD_TYPE, productName: code, status: { not: 'converted' } },
  });
}

/**
 * Validate a code against a cart and compute the discount (in dollars),
 * applied only to parts & accessories.
 */
export async function evaluatePromo(
  rawCode: unknown,
  cart: { productId: string; quantity: number }[]
) {
  const code = normalizePromoCode(rawCode);
  if (!code) return { valid: false as const, error: 'Enter a discount code' };

  const { enabled, percent } = await getPromoSettings();
  if (!enabled) return { valid: false as const, error: 'This promotion is not active' };

  const lead = await findUnusedPromoLead(code);
  if (!lead) return { valid: false as const, error: 'Invalid or already used code' };

  const products = await db.product.findMany({ where: { id: { in: cart.map((i) => i.productId) } } });
  const discountedIds = new Set<string>();
  let discount = 0;
  for (const product of products) {
    if (!product.price || !isAccessoryProduct(product)) continue;
    const qty = cart.find((i) => i.productId === product.id)?.quantity || 1;
    discount += product.price * qty * (percent / 100);
    discountedIds.add(product.id);
  }

  if (discountedIds.size === 0) {
    return { valid: false as const, error: 'This code only applies to parts & accessories' };
  }

  return {
    valid: true as const,
    code,
    percent,
    discount: Math.round(discount * 100) / 100,
    discountedIds,
  };
}

// Codes are one-time: called once Stripe reports the order as paid.
export async function markPromoCodeUsed(code: string | null | undefined) {
  if (!code) return;
  try {
    await db.lead.updateMany({
      where: { type: NEWSLETTER_LEAD_TYPE, productName: code, status: { not: 'converted' } },
      data: { status: 'converted' },
    });
  } catch (error) {
    console.error('Failed to mark discount code as used:', error);
  }
}
