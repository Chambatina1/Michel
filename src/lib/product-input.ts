// Shared validation for admin product create/update requests

export const PRODUCT_STATUSES = ['active', 'reserved', 'sold', 'inactive'] as const;

const JSON_FIELDS = { specs: '{}', features: '[]', images: '[]', videos: '[]' } as const;
type JsonField = keyof typeof JSON_FIELDS;

const TEXT_FIELDS = ['name', 'slug', 'category', 'condition', 'description', 'imageUrl', 'parentCategory', 'subCategory'] as const;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toJsonString(field: JsonField, value: unknown): string {
  if (value === null || value === undefined || value === '') return JSON_FIELDS[field];
  if (typeof value === 'string') {
    JSON.parse(value); // throws on invalid JSON
    return value;
  }
  return JSON.stringify(value);
}

/**
 * Normalizes a product payload. Only fields present in the body are returned,
 * so it works for both create (full body) and update (partial body).
 * Throws an Error with a user-readable message when a field is invalid.
 */
export function normalizeProductInput(body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const field of TEXT_FIELDS) {
    if (body[field] === undefined) continue;
    const value = body[field] === null ? '' : String(body[field]).trim();
    if (field === 'parentCategory' || field === 'subCategory') data[field] = value || null;
    else if (field === 'slug') data.slug = slugify(value);
    else data[field] = value;
  }

  // The store filters by `category`; default it to the subcategory or parent category
  if (data.category === '' || (body.category === undefined && (data.subCategory || data.parentCategory))) {
    const derived = (data.subCategory as string) || (data.parentCategory as string) || '';
    if (derived) data.category = derived;
    else if (data.category === '') delete data.category;
  }

  if (body.price !== undefined) {
    if (body.price === null || body.price === '') data.price = null;
    else {
      const price = typeof body.price === 'number' ? body.price : parseFloat(String(body.price));
      if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a positive number');
      data.price = price;
    }
  }

  for (const field of Object.keys(JSON_FIELDS) as JsonField[]) {
    if (body[field] === undefined) continue;
    try {
      data[field] = toJsonString(field, body[field]);
    } catch {
      throw new Error(`Invalid JSON in "${field}"`);
    }
  }

  if (body.status !== undefined) {
    const status = String(body.status);
    if (!(PRODUCT_STATUSES as readonly string[]).includes(status)) throw new Error(`Invalid status "${status}"`);
    data.status = status;
  }

  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  if (body.isNegotiable !== undefined) data.isNegotiable = Boolean(body.isNegotiable);
  if (data.isNegotiable === true) data.price = null;

  return data;
}

export function isUniqueSlugError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002';
}
