import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { SITE_URL, SITE_NAME, publicImageUrl, truncate } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  try {
    return await db.blogPost.findFirst({ where: { slug, isPublished: true } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: 'Blog', alternates: { canonical: `/blog/${slug}` } };
  }

  const description = truncate(post.excerpt || post.content);
  const image = publicImageUrl(post.coverImage);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: truncate(post.excerpt || post.content),
        image: publicImageUrl(post.coverImage),
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: { '@type': 'Organization', name: post.author },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.jpeg` },
        },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
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
