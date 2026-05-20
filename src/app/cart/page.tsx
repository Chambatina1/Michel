'use client';

import { useState, useSyncExternalStore, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Package,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore, type CartItem } from '@/store/cart-store';
import {
  calculateShippingRates,
  formatShippingPrice,
  type ShippingOption,
} from '@/lib/shipping';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Cart Item Row ── */
function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link
        href={`/catalog/${item.slug}`}
        className="relative shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        {item.requiresFreight && (
          <Badge className="absolute top-1 left-1 text-[9px] px-1 py-0 bg-orange-500 text-white">
            Freight
          </Badge>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/catalog/${item.slug}`}
              className="font-semibold text-foreground hover:text-teal-600 transition-colors line-clamp-2 text-sm sm:text-base"
            >
              {item.name}
            </Link>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                {item.category}
              </Badge>
              <Badge className={`text-[10px] ${
                item.condition === 'New'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {item.condition}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive h-8 w-8"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Line Total */}
          <p className="text-base font-bold text-foreground">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Empty Cart ── */
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Browse our inventory of new and refurbished medical imaging equipment to find what you need.
      </p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
        <Link href="/catalog">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse Equipment
        </Link>
      </Button>
    </motion.div>
  );
}

/* ── Main Cart Page ── */
export default function CartPage() {
  const {
    items,
    getTotal,
    getItemCount,
    getTotalWeight,
    hasFreightItems,
    clearCart,
  } = useCartStore();
  // Use useSyncExternalStore for hydration-safe mounted detection
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const shippingOptions = useMemo(() => {
    if (!mounted || items.length === 0) return [];
    const totalWeight = getTotalWeight();
    const hasFreight = hasFreightItems();
    const subtotal = getTotal();
    return calculateShippingRates(totalWeight, hasFreight, undefined, subtotal);
  }, [mounted, items, getTotalWeight, hasFreightItems, getTotal]);

  const selectedShipping = shippingOptions.length > 0 ? shippingOptions[0] : null;

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        {/* Hero */}
        <section className="gradient-primary py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Shopping Cart</h1>
          </div>
        </section>
        <EmptyCart />
      </>
    );
  }

  const subtotal = getTotal();
  const shippingCost = selectedShipping?.price || 0;
  const estimatedTax = Math.round(subtotal * 0.06); // ~6% placeholder
  const total = subtotal + shippingCost + estimatedTax;

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Shopping Cart
          </motion.h1>
          <motion.p
            className="mt-3 text-base text-white/75 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your cart
          </motion.p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-teal-600" />
                    Cart Items
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive text-sm"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Clear All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-2" />
                  {items.map((item) => (
                    <div key={item.productId}>
                      <CartItemRow item={item} />
                      <Separator />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-4">
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/catalog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-teal-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({getItemCount()} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Weight Info */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Weight</span>
                    <span className="font-medium">
                      {getTotalWeight() > 0 ? `${getTotalWeight().toFixed(1)} lbs` : 'N/A'}
                    </span>
                  </div>

                  {/* Shipping Estimate */}
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Shipping Estimate
                    </p>
                    {selectedShipping ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{selectedShipping.service}</span>
                        <span className="font-semibold text-teal-600">
                          {formatShippingPrice(selectedShipping.price)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Calculated at checkout</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      Final shipping rates will be calculated during checkout based on your shipping address.
                    </p>
                  </div>

                  <Separator />

                  {/* Estimated Tax */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span className="font-medium">{formatPrice(estimatedTax)}</span>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-bold text-lg">{formatPrice(total)}</span>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal >= 50000 ? (
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        🎉 You qualify for FREE shipping on orders over $50,000!
                      </p>
                    </div>
                  ) : subtotal >= 25000 ? (
                    <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-3">
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                        💡 Add {formatPrice(50000 - subtotal)} more for FREE shipping!
                      </p>
                    </div>
                  ) : null}

                  {/* Checkout Button */}
                  <Button
                    asChild
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 text-base font-semibold"
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                      Buyer Protection
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
