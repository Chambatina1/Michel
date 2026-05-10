'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Tag,
  User,
  BookOpen,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CTASection } from '@/components/layout/CTASection';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  tags: string;
  isPublished: boolean;
  isFeatured: boolean;
  readTime: number;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700 border-blue-200',
  'Industry News': 'bg-purple-100 text-purple-700 border-purple-200',
  Research: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Innovation: 'bg-amber-100 text-amber-700 border-amber-200',
  'CEO Insights': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRelated();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog?slug=${slug}`);
      const data = await res.json();
      setPost(data.post || null);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await fetch('/api/blog?limit=3');
      const data = await res.json();
      setRelatedPosts((data.posts || []).filter((p: BlogPost) => p.slug !== slug).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-80 w-full" />
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <>
      {/* Article Header */}
      <article>
        {/* Cover Image */}
        <div className="relative overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
                <Badge className={`mb-4 ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                  {post.category}
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  {post.title}
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readTime} min read
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Article
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Share Bar */}
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-blue-600"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-sky-500"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-blue-700"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => handleShare('copy')}
            >
              <Link2 className="h-4 w-4" />
            </Button>
            {copied && <span className="text-xs text-emerald-600">Copied!</span>}
          </div>

          {/* Markdown Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg prose-slate max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-li:text-muted-foreground
              prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:pr-4
              prose-img:rounded-xl prose-img:shadow-md
              prose-table:border prose-th:bg-secondary prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border-t"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="mt-10 p-6 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Contributing writer at P&S Medical Device Inc. Sharing insights on medical imaging technology,
                  industry trends, and innovations shaping the future of healthcare.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-14 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-8">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => (
                <Link key={relPost.id} href={`/blog/${relPost.slug}`}>
                  <Card className="h-full overflow-hidden group cursor-pointer transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden h-40">
                        {relPost.coverImage ? (
                          <Image
                            src={relPost.coverImage}
                            alt={relPost.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={`text-[10px] ${categoryColors[relPost.category] || 'bg-gray-100 text-gray-700'}`}>
                            {relPost.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relPost.excerpt}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title="Looking for Medical Equipment?"
        description="Explore our catalog of premium medical imaging equipment or get expert guidance from our team."
        buttonText="Browse Equipment"
        buttonLink="/catalog"
        variant="primary"
      />
    </>
  );
}
