import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-products';
import { SITE_URL, SITE_NAME, publicImageUrl, truncate } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

interface ProductSeo {
  name: string;
  slug: string;
  description: string;
  category: string;
  condition: string;
  price: number | null;
  imageUrl: string;
  status: string;
}

// null = the product doesn't exist or is hidden; 'unavailable' = the DB couldn't be read
async function getProduct(slug: string): Promise<ProductSeo | null | 'unavailable'> {
  try {
    // Hidden products are not shown in the store
    const product = await db.product.findUnique({ where: { slug } });
    return product && product.status !== 'inactive' ? product : null;
  } catch {
    // DB unavailable - use fallback products, like the product API does
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? 'unavailable';
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (product === 'unavailable') return { title: 'Medical Equipment' };
  if (!product) notFound();

  const title = `${product.name} (${product.condition})`;
  const description = truncate(product.description || `${product.condition} ${product.category} equipment for sale.`);
  const image = publicImageUrl(product.imageUrl);

  return {
    title,
    description,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/catalog/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const result = await getProduct(slug);
  // Deleted or hidden products answer with a real 404, so Google drops them instead of reporting a soft 404
  if (!result) notFound();
  const product = result === 'unavailable' ? null : result;

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: truncate(product.description || product.name, 5000),
        image: publicImageUrl(product.imageUrl),
        category: product.category,
        url: `${SITE_URL}/catalog/${product.slug}`,
        itemCondition:
          product.condition === 'New'
            ? 'https://schema.org/NewCondition'
            : product.condition === 'Used'
              ? 'https://schema.org/UsedCondition'
              : 'https://schema.org/RefurbishedCondition',
        ...(product.price && product.price > 0
          ? {
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'USD',
                availability:
                  product.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
                url: `${SITE_URL}/catalog/${product.slug}`,
                seller: { '@type': 'Organization', name: SITE_NAME },
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      )}
      {children}
    </>
  );
}
