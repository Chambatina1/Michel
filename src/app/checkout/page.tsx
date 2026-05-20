'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Phone,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/store/cart-store';
import {
  calculateShippingRates,
  formatShippingPrice,
  type ShippingOption,
} from '@/lib/shipping';

/* ── Constants ── */
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA',
  'ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
  'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
];

const PROVINCES = {
  CA: ['AB','BC','MB','NB','NL','NS','ON','PE','QC','SK','NT','YT','NU'],
  MX: ['AGU','BCN','BCS','CAM','CHP','CHH','COA','COL','DIF','DUR','GUA','GRO','HID','JAL',
       'MEX','MIC','MOR','NAY','NLE','OAX','PUE','QUE','ROO','SLP','SIN','SON','TAB','TAM',
       'TLA','VER','YUC','ZAC'],
};

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

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const defaultAddress: ShippingAddress = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
};

/* ── Step Indicator ── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Review', icon: Package },
    { num: 2, label: 'Shipping', icon: MapPin },
    { num: 3, label: 'Method', icon: Truck },
    { num: 4, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep >= step.num;
        const isCurrent = currentStep === step.num;

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-muted-foreground/30 text-muted-foreground/50'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium hidden sm:block ${
                isActive ? 'text-teal-600' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 w-6 sm:w-12 mx-1 transition-colors ${
                currentStep > step.num ? 'bg-teal-600' : 'bg-muted-foreground/20'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Checkout Page ── */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getTotalWeight, hasFreightItems, removeItem, clearCart } = useCartStore();
  // Use useSyncExternalStore for hydration-safe mounted detection
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(defaultAddress);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Calculate shipping options
  const shippingOptions = useMemo(() => {
    if (!mounted || items.length === 0) return [];
    return calculateShippingRates(
      getTotalWeight(),
      hasFreightItems(),
      shippingAddress.zip,
      getTotal()
    );
  }, [mounted, items, getTotalWeight, hasFreightItems, shippingAddress.zip, getTotal]);

  const selectedShippingOption = useMemo(() => {
    if (selectedShippingId) {
      return shippingOptions.find((o) => o.id === selectedShippingId) || shippingOptions[0];
    }
    return shippingOptions[0] || null;
  }, [shippingOptions, selectedShippingId]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/catalog">Browse Equipment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = getTotal();
  const shippingCost = selectedShippingOption?.price || 0;
  const estimatedTax = Math.round(subtotal * 0.06);
  const total = subtotal + shippingCost + estimatedTax;

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep2 = (): boolean => {
    const { name, email, phone, address, city, state, zip, country } = shippingAddress;
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
    if (phoneClean.length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !selectedShippingId) {
      setError('Please select a shipping method.');
      return;
    }
    setError('');
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress,
          shippingMethod: selectedShippingId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session. Please try again.');
        setIsProcessing(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setIsProcessing(false);
    }
  };

  const stateOptions = shippingAddress.country === 'US'
    ? US_STATES
    : shippingAddress.country === 'CA'
      ? PROVINCES.CA
      : PROVINCES.MX;

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Checkout
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Secure checkout powered by Stripe
          </motion.p>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-4">

                {/* Step 1: Review Order */}
                {currentStep >= 1 && (
                  <Card className={currentStep > 1 ? 'opacity-60 pointer-events-none' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4 text-teal-600" />
                        Review Order
                        {currentStep > 1 && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                      </CardTitle>
                      <CardDescription className="text-xs">Review items in your order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 py-2">
                          <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {item.condition}</p>
                          </div>
                          <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep >= 2 && (
                  <Card className={currentStep > 2 ? 'opacity-60 pointer-events-none' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        Shipping Information
                        {currentStep > 2 && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                      </CardTitle>
                      <CardDescription className="text-xs">Where should we deliver your order?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Smith"
                            value={shippingAddress.name}
                            onChange={(e) => handleAddressChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@hospital.com"
                            value={shippingAddress.email}
                            onChange={(e) => handleAddressChange('email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (305) 555-0100"
                            value={shippingAddress.phone}
                            onChange={(e) => handleAddressChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="company">Company (optional)</Label>
                          <Input
                            id="company"
                            placeholder="Hospital / Clinic Name"
                            value={shippingAddress.company}
                            onChange={(e) => handleAddressChange('company', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          placeholder="123 Medical Center Blvd"
                          value={shippingAddress.address}
                          onChange={(e) => handleAddressChange('address', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="col-span-2 space-y-1.5">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Miami"
                            value={shippingAddress.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="state">State / Province *</Label>
                          <Select
                            value={shippingAddress.state}
                            onValueChange={(v) => handleAddressChange('state', v)}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {stateOptions.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="zip">ZIP / Postal Code *</Label>
                          <Input
                            id="zip"
                            placeholder="33101"
                            value={shippingAddress.zip}
                            onChange={(e) => handleAddressChange('zip', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={shippingAddress.country}
                          onValueChange={(v) => {
                            handleAddressChange('country', v);
                            handleAddressChange('state', '');
                          }}
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Shipping Method */}
                {currentStep >= 3 && (
                  <Card className={currentStep > 3 ? 'opacity-60 pointer-events-none' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Truck className="h-4 w-4 text-teal-600" />
                        Shipping Method
                        {currentStep > 3 && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                      </CardTitle>
                      <CardDescription className="text-xs">Choose your preferred shipping method</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedShippingId === option.id
                              ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={selectedShippingId === option.id}
                            onChange={() => setSelectedShippingId(option.id)}
                            className="mt-1 accent-teal-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{option.service}</span>
                                {option.requiresSignature && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    Signature
                                  </Badge>
                                )}
                              </div>
                              <span className={`text-sm font-bold shrink-0 ${
                                option.price === 0 ? 'text-emerald-600' : 'text-foreground'
                              }`}>
                                {formatShippingPrice(option.price)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {option.estimatedDays} · {option.carrier}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">{option.description}</p>
                          </div>
                        </label>
                      ))}

                      {(hasFreightItems() || getTotalWeight() >= 150) && (
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Your order contains heavy equipment requiring freight shipping. Freight carriers will contact you to schedule delivery. Please ensure someone is available at the delivery address to receive the shipment.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Payment */}
                {currentStep >= 4 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-teal-600" />
                        Payment
                      </CardTitle>
                      <CardDescription className="text-xs">
                        You will be redirected to Stripe to complete your payment securely
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Summary in Payment Step */}
                      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Order Summary</h4>
                        {items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground truncate pr-4">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping ({selectedShippingOption?.service})</span>
                          <span className="font-medium">{formatShippingPrice(shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Tax</span>
                          <span className="font-medium">{formatPrice(estimatedTax)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">{formatPrice(total)}</span>
                        </div>
                      </div>

                      {/* Shipping Address Summary */}
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-1">Shipping To</h4>
                        <p className="text-sm text-muted-foreground">
                          {shippingAddress.name}{shippingAddress.company ? ` · ${shippingAddress.company}` : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">{shippingAddress.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </p>
                        <p className="text-sm text-muted-foreground">{shippingAddress.email} · {shippingAddress.phone}</p>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                      )}

                      {/* Pay Button */}
                      <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold"
                        onClick={handleCheckout}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Checkout Session...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay {formatPrice(total)} with Stripe
                          </>
                        )}
                      </Button>

                      {/* Trust */}
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Secured by Stripe. Your payment info is encrypted and secure.</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step Error (for steps before payment) */}
                {currentStep < 4 && error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/cart">
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to Cart
                      </Link>
                    </Button>
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={handlePrevStep}>
                        Previous Step
                      </Button>
                    )}
                  </div>
                  {currentStep < 4 && (
                    <Button
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleNextStep}
                    >
                      Continue
                      <ChevronDown className="ml-1.5 h-4 w-4 rotate-[-90deg]" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-28">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-2">
                          <div className="h-10 w-10 shrink-0 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">×{item.quantity}</p>
                          </div>
                          <span className="text-xs font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {selectedShippingOption ? formatShippingPrice(selectedShippingOption.price) : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Tax</span>
                      <span className="font-medium">{formatPrice(estimatedTax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">{formatPrice(total)}</span>
                    </div>

                    {/* Need Help? */}
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <Phone className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Need help? Call us at</p>
                      <p className="text-sm font-semibold text-foreground">+1 (305) 244-9340</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
