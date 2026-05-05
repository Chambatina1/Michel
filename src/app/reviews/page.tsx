'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Star,
  User,
  Building2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  MessageSquarePlus,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

/* ── Types ── */
interface Review {
  id: string;
  author: string;
  email: string | null;
  rating: number;
  title: string;
  content: string;
  company: string | null;
  role: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

/* ── Schema ── */
const reviewSchema = z.object({
  author: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Review must be at least 20 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Star Rating Component ── */
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Interactive Star Selector ── */
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          className="p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              i < (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} / 5
        </span>
      )}
    </div>
  );
}

/* ── Review Card ── */
function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`h-full ${review.isFeatured ? 'border-teal-200 bg-teal-50/30 dark:border-teal-800 dark:bg-teal-950/10' : ''}`}>
        <CardContent className="p-5 sm:p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{review.author}</p>
                {(review.role || review.company) && (
                  <p className="text-xs text-muted-foreground">
                    {review.role}{review.role && review.company ? ' · ' : ''}{review.company}
                  </p>
                )}
              </div>
            </div>
            {review.isFeatured && (
              <Badge className="bg-teal-600 text-white hover:bg-teal-700 shrink-0">Featured</Badge>
            )}
          </div>

          {/* Stars */}
          <StarRating rating={review.rating} />

          {/* Title */}
          <h3 className="font-semibold text-foreground mt-3">{review.title}</h3>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed mt-2 flex-1">
            {review.content}
          </p>

          {/* Date */}
          <p className="text-xs text-muted-foreground/60 mt-4 pt-3 border-t border-border">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Skeleton ── */
function ReviewGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Leave Review Dialog ── */
function LeaveReviewDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: '',
      email: '',
      rating: 0,
      title: '',
      content: '',
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      form.setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mb-4">
              <CheckCircle2 className="h-7 w-7 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Thank You!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your review has been submitted and is pending approval. It will appear on our site once approved.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              {form.formState.errors.root && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane@hospital.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <StarSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Summarize your experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Tell us about your experience with PS Medical Devices..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ── */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?limit=50');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate average rating
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0';

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100 : 0,
  }));

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Customers Say
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real feedback from healthcare professionals who trust us with their medical equipment needs.
          </motion.p>
        </div>
      </section>

      {/* Overall Rating Summary */}
      <section className="py-10 sm:py-14 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground">{avgRating}</p>
              <StarRating rating={Math.round(Number(avgRating))} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">Based on {totalReviews} reviews</p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-6 text-right">{item.star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-6 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LeaveReviewDialog />
            <Button asChild variant="outline" size="lg">
              <a href="https://search.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Leave a Review on Google
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <ReviewGridSkeleton />
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Quote className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to share your experience with PS Medical Devices.
              </p>
              <LeaveReviewDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
