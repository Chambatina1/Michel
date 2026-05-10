'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Microscope,
  Brain,
  Cpu,
  HeartPulse,
  Search,
  Tag,
  BookOpen,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CTASection } from '@/components/layout/CTASection';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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

const categoryIcons: Record<string, React.ElementType> = {
  Technology: Cpu,
  'Industry News': Newspaper,
  Research: Microscope,
  Innovation: Brain,
  'CEO Insights': TrendingUp,
};

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700 border-blue-200',
  'Industry News': 'bg-purple-100 text-purple-700 border-purple-200',
  Research: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Innovation: 'bg-amber-100 text-amber-700 border-amber-200',
  'CEO Insights': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPosts();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
      });
      if (activeCategory !== 'All') params.set('category', activeCategory);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      setPosts(data.posts || []);
      setCategories(['All', ...(data.categories || [])]);
      setTotalPages(data.pages || 1);

      // Set featured post from first featured or first post
      if (currentPage === 1) {
        const featured = (data.posts || []).find((p: BlogPost) => p.isFeatured);
        setFeaturedPost(featured || (data.posts || [])[0] || null);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (post === featuredPost && currentPage === 1) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm mb-6">
              <Newspaper className="h-3.5 w-3.5" />
              Medical Technology News & Insights
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              P&S Medical Device
              <br />
              <span className="text-teal-300">Tech Blog</span>
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto">
              Stay ahead of the curve with the latest advances in medical imaging technology,
              industry trends, and expert insights from our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b border-border bg-background sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat] || Tag;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat}
                  </button>
                );
              })}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Check back soon for the latest medical technology news.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && currentPage === 1 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5 }}
                  className="mb-10"
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-xl border-none">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          <div className="relative overflow-hidden min-h-[300px] lg:min-h-[400px]">
                            {featuredPost.coverImage ? (
                              <Image
                                src={featuredPost.coverImage}
                                alt={featuredPost.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <HeartPulse className="h-20 w-20 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <Badge className={categoryColors[featuredPost.category] || 'bg-gray-100 text-gray-700'}>
                                {featuredPost.category}
                              </Badge>
                              {featuredPost.isFeatured && (
                                <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="p-8 sm:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDate(featuredPost.createdAt)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {featuredPost.readTime} min read
                              </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {featuredPost.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                              {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-muted-foreground">
                                By {featuredPost.author}
                              </p>
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                Read More <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )}

              {/* Post Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:border-accent/20">
                        <CardContent className="p-0">
                          {/* Cover Image */}
                          <div className="relative overflow-hidden h-48">
                            {post.coverImage ? (
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                <Microscope className="h-12 w-12 text-primary/30" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <Badge className={`text-[10px] ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                                {post.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime} min
                              </div>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{post.author}</span>
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Read <ArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-primary text-primary-foreground' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <CTASection
        title="Stay Updated on Medical Technology"
        description="Get the latest industry insights, technology updates, and expert analysis delivered to your inbox."
        buttonText="Subscribe to Newsletter"
        buttonLink="/contact?subject=newsletter"
        variant="accent"
      />
    </>
  );
}
