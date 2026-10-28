"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/lib/useSiteSettings";

interface CarouselProduct {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  condition: string;
  imageUrl: string;
  isNegotiable?: boolean;
  subCategory?: string | null;
  category: string;
}

const formatPrice = (p: CarouselProduct) => {
  if (p.price === null || p.price <= 0 || p.isNegotiable) return "Request Quote";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p.price);
};

// Puts products in the order saved in Admin > Carrusel (home_carousel_order); the rest go last, newest first.
export function sortByCarouselOrder<T extends { id: string }>(products: T[], order: string): T[] {
  const ids = order.split(",").map((s) => s.trim()).filter(Boolean);
  const rank = (id: string) => {
    const i = ids.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...products].sort((a, b) => rank(a.id) - rank(b.id));
}

// Home page carousel of the products marked as featured (star) in the admin.
export function FeaturedCarousel({ settings }: { settings: Record<string, string> }) {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  const enabled = getSetting(settings, "home_carousel_enabled", "true") !== "false";
  const title = getSetting(settings, "home_carousel_title", "Featured Equipment");
  const subtitle = getSetting(settings, "home_carousel_subtitle", "Selected units from our current inventory");
  const order = getSetting(settings, "home_carousel_order");

  useEffect(() => {
    fetch("/api/products?featured=true&status=active&limit=30")
      .then((res) => res.json())
      .then((data) => setProducts((data.products || []).filter((p: CarouselProduct) => p.imageUrl)))
      .catch(() => setProducts([]));
  }, []);

  // Auto-advance every 5 seconds unless the visitor is hovering it
  useEffect(() => {
    if (!api || paused) return;
    const timer = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [api, paused]);

  if (!enabled || products.length === 0) return null;
  const sorted = sortByCarouselOrder(products, order);

  return (
    <section className="py-16 sm:py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-2 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
          </div>
          <Button asChild variant="outline" className="self-start sm:self-auto">
            <Link href="/catalog">
              View all equipment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: sorted.length > 3 }}
          className="mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <CarouselContent className="-ml-4">
            {sorted.map((p) => (
              <CarouselItem key={p.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <Link
                  href={`/catalog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                    {p.condition && (
                      <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground">{p.condition}</Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{p.subCategory || p.category}</p>
                    <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">{p.name}</h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-primary">{formatPrice(p)}</span>
                      <span className="text-sm font-medium text-primary group-hover:underline">View details</span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex left-2 xl:-left-12" />
          <CarouselNext className="hidden sm:flex right-2 xl:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
