'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  XCircle,
  ArrowLeft,
  Home,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <XCircle className="h-10 w-10 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground mb-8">
            Your payment was not completed. No charges have been made to your account.
            You can try again or contact our team for assistance.
          </p>

          {/* Info Box */}
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 text-left">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
              No worries, here are your options:
            </h3>
            <ul className="space-y-1.5 text-sm text-amber-700 dark:text-amber-400">
              <li className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 shrink-0" />
                Go back and try the payment again
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                Call us directly to complete the purchase
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                Request a quote if you prefer alternative payment methods
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {productSlug && (
              <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
                <Link href={`/catalog/${productSlug}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Product
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1">
              <Link href="/catalog">
                Browse Equipment
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/contact?type=quote">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
   );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-teal-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  );
}
