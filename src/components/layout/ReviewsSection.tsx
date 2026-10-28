"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompanyInfo } from "@/lib/company";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  company: string | null;
  role: string | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

// Home page: latest approved customer reviews, with links to read all and to leave one.
export function ReviewsSection({ settings }: { settings: Record<string, string> }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);
  const company = getCompanyInfo(settings);

  useEffect(() => {
    fetch("/api/reviews?limit=3")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {reviews.length > 0 ? "What Our Customers Say" : "Share Your Experience"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {reviews.length > 0
              ? `Reviews from facilities that worked with ${company.name}`
              : `Bought or sold equipment with ${company.name}? Your review helps other facilities.`}
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <MessageSquareQuote className="mb-2 h-6 w-6 text-primary/40" />
                <Stars rating={r.rating} />
                <p className="mt-3 font-semibold text-foreground">{r.title}</p>
                <blockquote className="mt-2 line-clamp-5 flex-1 text-sm leading-relaxed text-muted-foreground">{r.content}</blockquote>
                <figcaption className="mt-4 border-t pt-3 text-sm">
                  <span className="font-medium text-foreground">{r.author}</span>
                  {(r.role || r.company) && (
                    <span className="text-muted-foreground"> · {[r.role, r.company].filter(Boolean).join(", ")}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {reviews.length > 0 && (
            <Button asChild variant="outline" size="lg">
              <Link href="/reviews">Read all reviews</Link>
            </Button>
          )}
          <Button asChild size="lg">
            <Link href="/reviews">Leave a review</Link>
          </Button>
          {company.googleReviewUrl && (
            <Button asChild variant="outline" size="lg">
              <a href={company.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />Review us on Google
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
