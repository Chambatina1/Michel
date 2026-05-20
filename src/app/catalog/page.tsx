'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Eye,
  MessageSquareQuote,
  Star,
  MonitorSmartphone,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Activity,
  CreditCard,
  Loader2,
  Camera,
  Grid3X3,
  Ruler,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LeadForm } from '@/components/layout/LeadForm';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

/* ── Types ── */
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  condition: string;
  price: number | null;
  description: string;
  isFeatured: boolean;
  status: string;
  imageUrl: string;
  images?: string;
  parentCategory?: string | null;
  subCategory?: string | null;
}

/* ── Constants ── */
const MAIN_CATEGORIES = [
  {
    name: 'Imaging Equipment',
    subcategories: ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'C-Arm', 'DXA'],
  },
  {
    name: 'Ophthalmology Equipment',
    subcategories: ['OCT', 'Retinal Camera', 'Visual Field', 'Refractometers', 'Examination'],
  },
] as const;

const ALL_SUBCATEGORIES = [
  ...MAIN_CATEGORIES[0].subcategories,
  ...MAIN_CATEGORIES[1].subcategories,
];
const CONDITIONS = ['New', 'Refurbished'] as const;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  CT: MonitorSmartphone,
  MRI: Activity,
  'X-Ray': HeartPulse,
  Ultrasound: Stethoscope,
  Mammography: ShieldCheck,
  'C-Arm': MonitorSmartphone,
  DXA: Activity,
  OCT: ShieldCheck,
  'Retinal Camera': Camera,
  'Visual Field': Grid3X3,
  Refractometers: Ruler,
  Examination: Search,
  'O-Arm': MonitorSmartphone,
};

/* ── Category → Real Product Image Mapping ── */
const CATEGORY_IMAGES: Record<string, string[]> = {
  CT: ['/images/products/ge-revolution-ct.jpg', '/images/products/siemens-somatom-ct.jpg', '/images/products/toshiba-aquilion-ct.jpg'],
  MRI: ['/images/products/siemens-magnetom-mri.jpg', '/images/products/philips-ambition-mri.jpg', '/images/products/hitachi-echelon-mri.jpg', '/images/products/toshiba-vantage-mri.jpg'],
  'X-Ray': ['/images/products/carestream-xray.jpg', '/images/products/shimadzu-xray.jpg', '/images/products/fujifilm-xray.jpg', '/images/products/ge-optima-xray.jpg'],
  Ultrasound: ['/images/products/philips-iu-elite.jpg', '/images/products/canon-aplio-ultrasound.jpg', '/images/products/ge-logiq-e10.jpg', '/images/products/ge-vivid-e95.jpg', '/images/products/mindray-dc80.jpg'],
  Mammography: ['/images/products/hologic-mammography.jpg'],
  'C-Arm': ['/images/products/philips-carm.jpg'],
  DXA: ['/images/products/hologic-dxa.jpg'],
  OCT: ['/images/products/zeiss-cirrus-oct.jpg', '/images/products/topcon-maestro-oct.jpg', '/images/products/heidelberg-spectralis-oct.jpg', '/images/products/nidek-oct.jpg'],
  'Retinal Camera': ['/images/products/topcon-retinal-camera.jpg', '/images/products/haufe-visucam.jpg'],
  'Visual Field': ['/images/products/oculus-visual-field.jpg'],
  Refractometers: ['/images/products/zeiss-iolmaster.jpg', '/images/products/canon-refractometer.jpg'],
  Examination: ['/images/products/haag-streit-slitlamp.jpg'],
  'O-Arm': ['/images/products/philips-carm.jpg'],
};

const CATEGORY_WEIGHTS: Record<string, number> = {
  CT: 5000,
  MRI: 8000,
  'X-Ray': 3000,
  Ultrasound: 300,
  Mammography: 2000,
  'C-Arm': 1500,
  DXA: 2000,
  OCT: 20,
  'Retinal Camera': 30,
  'Visual Field': 40,
  Refractometers: 15,
  Examination: 25,
  'O-Arm': 3000,
};

const FREIGHT_CATEGORIES = ['CT', 'MRI', 'X-Ray'];

function getCategoryImage(category: string, productName: string): string {
  const images = CATEGORY_IMAGES[category];
  if (!images) return '/images/products/ge-revolution-ct.jpg';
  // Use product name to deterministically pick an image from the array
  const index = Math.abs(productName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % images.length;
  return images[index];
}

const formatPrice = (price: number | null) => {
  if (price === null) return 'Request Quote';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Skeleton Loader ── */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-5 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Quick Buy Button for Cards ── */
function QuickBuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not initiate payment.');
        setLoading(false);
      }
    } catch {
      alert('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="flex-1 min-w-[100px] bg-indigo-600 text-white hover:bg-indigo-700"
      onClick={handleQuickBuy}
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CreditCard className="mr-1.5 h-3.5 w-3.5" />}
      {loading ? '...' : 'Buy Now'}
    </Button>
  );
}

/* ── Product Card ── */
function ProductCard({ product }: { product: Product }) {
  const IconComponent = CATEGORY_ICONS[product.category] || MonitorSmartphone;
  const hasRealImage = product.imageUrl && !product.imageUrl.includes('placeholder');
  // Always show a real image: use category image as fallback for placeholder
  const displayImage = hasRealImage ? product.imageUrl : getCategoryImage(product.category, product.name);

  return (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4 }}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-teal-600/30">
        {/* Product Image */}
        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-teal-600 text-white hover:bg-teal-700 gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex flex-col gap-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
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

          {/* Name */}
          <Link href={`/catalog/${product.slug}`} className="group-hover:text-teal-600 transition-colors">
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          {/* Price */}
          <p className={`text-lg font-bold ${product.price ? 'text-foreground' : 'text-teal-600'}`}>
            {formatPrice(product.price)}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild variant="outline" size="sm" className="flex-1 min-w-[120px]">
              <Link href={`/catalog/${product.slug}`}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 min-w-[120px] bg-teal-600 text-white hover:bg-teal-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const hasRealImage = product.imageUrl && !product.imageUrl.includes('placeholder');
                const displayImg = hasRealImage ? product.imageUrl : getCategoryImage(product.category, product.name);
                useCartStore.getState().addItem({
                  id: crypto.randomUUID(),
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price || 0,
                  imageUrl: displayImg,
                  category: product.category,
                  condition: product.condition,
                  weight: CATEGORY_WEIGHTS[product.category] || 50,
                  requiresFreight: FREIGHT_CATEGORIES.includes(product.category),
                });
                toast.success('Added to cart', {
                  description: `${product.name} has been added to your cart.`,
                });
              }}
            >
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Add to Cart
            </Button>
            {product.price && product.price > 0 && (
              <QuickBuyButton productId={product.id} />
            )}
            <GetQuoteDialog productId={product.id} productName={product.name} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Get Quote Dialog ── */
function GetQuoteDialog({ productId, productName }: { productId: string; productName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 min-w-[120px] bg-teal-600 text-white hover:bg-teal-700">
          <MessageSquareQuote className="mr-1.5 h-3.5 w-3.5" />
          Get Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Get a Quote for {productName}</DialogTitle>
        </DialogHeader>
        <LeadForm type="quote" productId={productId} />
      </DialogContent>
    </Dialog>
  );
}

/* ── Filter Sidebar Content ── */
function FilterContent({
  selectedCategories,
  selectedConditions,
  onCategoryChange,
  onConditionChange,
  onClear,
  hasFilters,
}: {
  selectedCategories: string[];
  selectedConditions: string[];
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Category</h4>
        <div className="space-y-4">
          {MAIN_CATEGORIES.map((mainCat) => (
            <div key={mainCat.name}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{mainCat.name}</p>
              <div className="space-y-2.5">
                {mainCat.subcategories.map((sub) => (
                  <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                    <Checkbox
                      checked={selectedCategories.includes(sub)}
                      onCheckedChange={() => onCategoryChange(sub)}
                      className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {sub}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Condition</h4>
        <div className="space-y-2.5">
          {CONDITIONS.map((cond) => (
            <label key={cond} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedConditions.includes(cond)}
                onCheckedChange={() => onConditionChange(cond)}
                className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {cond}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Track the parentCategory from the URL for API-level filtering
  const urlParentCategory = searchParams.get('parentCategory');

  // Handle parentCategory and category from URL
  useEffect(() => {
    const parentCat = searchParams.get('parentCategory');
    const singleCat = searchParams.get('category');
    if (parentCat) {
      const mapping: Record<string, string[]> = {
        'Ophthalmology': ['OCT', 'Retinal Camera', 'Visual Field', 'Refractometers', 'Examination'],
        'Ophthalmology Equipment': ['OCT', 'Retinal Camera', 'Visual Field', 'Refractometers', 'Examination'],
        'Imaging': ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'C-Arm', 'DXA'],
        'Imaging Equipment': ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'C-Arm', 'DXA'],
      };
      const cats = mapping[parentCat];
      if (cats) {
        setSelectedCategories(cats);
      }
    } else if (singleCat) {
      // Handle single category from URL (e.g., ?category=OCT, ?category=Retinal+Camera)
      setSelectedCategories([singleCat]);
    }
  }, [searchParams]);

  const hasFilters = selectedCategories.length > 0 || selectedConditions.length > 0;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      // If we have a parentCategory from URL, pass it to the API for server-side filtering
      if (urlParentCategory) {
        params.set('parentCategory', urlParentCategory);
      } else if (selectedCategories.length === 1) {
        params.set('category', selectedCategories[0]);
      }

      if (selectedConditions.length === 1) params.set('condition', selectedConditions[0]);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let filtered = data.products;

        // Client-side filtering for multiple categories/conditions
        // (only when not using parentCategory server-side filter)
        if (!urlParentCategory && selectedCategories.length > 1) {
          filtered = filtered.filter((p: Product) => selectedCategories.includes(p.category));
        }
        if (selectedConditions.length > 1) {
          filtered = filtered.filter((p: Product) => selectedConditions.includes(p.condition));
        }

        setProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, selectedConditions, urlParentCategory]);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleConditionChange = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSearch('');
  };

  const activeFilterCount = selectedCategories.length + selectedConditions.length;

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
            Equipment Catalog
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse our inventory of new and refurbished medical imaging equipment from leading manufacturers
          </motion.p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search Bar & Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment by name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden h-11">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-teal-600 text-white">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent
                    selectedCategories={selectedCategories}
                    selectedConditions={selectedConditions}
                    onCategoryChange={(cat) => { handleCategoryChange(cat); }}
                    onConditionChange={(cond) => { handleConditionChange(cond); }}
                    onClear={() => { clearFilters(); setMobileFiltersOpen(false); }}
                    hasFilters={hasFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active filter tags */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedConditions.map((cond) => (
                <Badge
                  key={cond}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleConditionChange(cond)}
                >
                  {cond}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24">
                <FilterContent
                  selectedCategories={selectedCategories}
                  selectedConditions={selectedConditions}
                  onCategoryChange={handleCategoryChange}
                  onConditionChange={handleConditionChange}
                  onClear={clearFilters}
                  hasFilters={hasFilters}
                />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {!loading && products.length > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  Showing <span className="font-medium text-foreground">{products.length}</span> equipment
                  {products.length === 1 ? ' item' : ' items'}
                </p>
              )}

              {loading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No equipment found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <section className="gradient-primary py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-10 bg-white/20 rounded w-64 mx-auto animate-pulse" />
            <div className="mt-4 h-6 bg-white/10 rounded w-96 mx-auto animate-pulse" />
          </div>
        </section>
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProductGridSkeleton />
          </div>
        </section>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
