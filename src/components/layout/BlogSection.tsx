'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Newspaper,
  Microscope,
  Cpu,
  Brain,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
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

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog?limit=3&featured=true');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch {
        // silently fail - blog section will just be empty
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no posts yet
  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
            <Newspaper className="h-3.5 w-3.5" />
            Latest Insights
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            From Our <span className="text-primary">Tech Blog</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Stay informed about the latest advances in medical imaging technology
            and industry trends that matter to your practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post, idx) => (
            <motion.div
              key={post.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden h-44">
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
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Article <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
