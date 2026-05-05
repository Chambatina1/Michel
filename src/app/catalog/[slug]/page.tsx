'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Phone,
  Eye,
  MessageSquareQuote,
  ShieldCheck,
  MonitorSmartphone,
  Stethoscope,
  HeartPulse,
  Activity,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LeadForm } from '@/components/layout/LeadForm';

/* ── Types ── */
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  condition: string;
  price: number | null;
  description: string;
  specs: Record<string, string>;
  features: string[];
  images: string[];
  isFeatured: boolean;
  imageUrl: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  CT: MonitorSmartphone,
  MRI: Activity,
  'X-Ray': HeartPulse,
  Ultrasound: Stethoscope,
  Ophthalmology: ShieldCheck,
};

const formatPrice = (price: number | null) => {
  if (price === null) return 'Request Quote';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Product Detail Skeleton ── */
function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Skeleton className="h-4 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="h-80 sm:h-96 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-10 w-40" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 404 Not Found ── */
function ProductNotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Equipment Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The equipment you&apos;re looking for may have been sold or is no longer available in our catalog.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link href="/contact?type=quote">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data.product);

        // Fetch related products (same category)
        const relatedRes = await fetch(`/api/products?category=${data.product.category}&limit=4`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedProducts(
            relatedData.products.filter((p: Product) => p.slug !== slug).slice(0, 3)
          );
        }
      } catch (err) {
        console.error('Error:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (notFound) return <ProductNotFound />;
  if (!product) return <ProductNotFound />;

  const IconComponent = CATEGORY_ICONS[product.category] || MonitorSmartphone;
  const specsEntries = Object.entries(product.specs || {});

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/catalog">Equipment</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/catalog?search=${product.category}`}>{product.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium truncate max-w-[200px]">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Product Hero */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex h-72 sm:h-80 lg:h-[440px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                <IconComponent className="h-24 w-24 sm:h-32 sm:w-32 text-slate-300 dark:text-slate-600" />
                {product.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-teal-600 text-white hover:bg-teal-700 gap-1 px-3 py-1">
                      <Star className="h-3.5 w-3.5" />
                      Featured Equipment
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary font-medium">
                  {product.category}
                </Badge>
                <Badge
                  className={`text-xs ${
                    product.condition === 'New'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {product.condition}
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl mb-3">
                {product.name}
              </h1>

              <p className={`text-2xl font-bold mb-4 ${product.price ? 'text-foreground' : 'text-teal-600'}`}>
                {formatPrice(product.price)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white min-w-[160px]">
                      <MessageSquareQuote className="mr-2 h-4 w-4" />
                      Request Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Get a Quote for {product.name}</DialogTitle>
                    </DialogHeader>
                    <LeadForm type="quote" productId={product.id} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="min-w-[160px]">
                      <Phone className="mr-2 h-4 w-4" />
                      Talk to Expert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Talk to an Expert</DialogTitle>
                    </DialogHeader>
                    <LeadForm type="contact" productId={product.id} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Trust Block */}
              <div className="rounded-lg border border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30 px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <p className="text-sm text-teal-800 dark:text-teal-300">
                  This purchase includes <strong>expert advisory</strong> and <strong>after-sales support</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Technical Specifications */}
      {specsEntries.length > 0 && (
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-foreground sm:text-2xl mb-6">Technical Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specsEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="text-sm font-medium text-muted-foreground">{key}</span>
                    <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <section className="py-10 sm:py-14 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-foreground sm:text-2xl mb-6">Key Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quote Form Section */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-foreground sm:text-2xl mb-2 text-center">
                Interested in this equipment?
              </h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Fill out the form below and our team will get back to you within 24 hours with pricing and availability.
              </p>
              <LeadForm type="quote" productId={product.id} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-10 sm:py-14 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Related Equipment
                </h2>
                <Button variant="ghost" asChild>
                  <Link href="/catalog" className="text-teal-600 hover:text-teal-700">
                    View All
                    <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rp) => {
                  const RelIcon = CATEGORY_ICONS[rp.category] || MonitorSmartphone;
                  return (
                    <Card key={rp.id} className="group overflow-hidden transition-all hover:shadow-lg hover:border-teal-600/30">
                      <Link href={`/catalog/${rp.slug}`}>
                        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                          <RelIcon className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            {rp.category}
                          </Badge>
                          <Badge className={`text-xs ${
                            rp.condition === 'New'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {rp.condition}
                          </Badge>
                        </div>
                        <Link href={`/catalog/${rp.slug}`}>
                          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-teal-600 transition-colors">
                            {rp.name}
                          </h3>
                        </Link>
                        <p className={`text-sm font-bold mt-1 ${rp.price ? 'text-foreground' : 'text-teal-600'}`}>
                          {formatPrice(rp.price)}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
