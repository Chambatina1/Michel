'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Home,
  Mail,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SessionInfo {
  id: string;
  status: string;
  amount_total: number | null;
  currency: string | null;
  customer_email: string | null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    async function verifySession() {
      try {
        const res = await fetch(`/api/payments/verify?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSessionInfo(data);
        } else {
          setError('Could not verify payment status');
        }
      } catch {
        setError('Connection error. Please contact support.');
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-600" />
          <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <CheckCircle2 className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verification Issue</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/catalog">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Our team will contact you shortly
            with delivery details and next steps.
          </p>

          {/* Payment Details */}
          {sessionInfo && (
            <div className="mb-8 rounded-lg border border-border bg-muted/50 p-4 text-left">
              <h3 className="text-sm font-semibold text-foreground mb-3">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-foreground">{sessionInfo.id.slice(0, 20)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-emerald-600 capitalize">{sessionInfo.status}</span>
                </div>
                {sessionInfo.amount_total && sessionInfo.currency && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-foreground">
                      {formatAmount(sessionInfo.amount_total, sessionInfo.currency)}
                    </span>
                  </div>
                )}
                {sessionInfo.customer_email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground">{sessionInfo.customer_email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-4 text-left">
            <h3 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-1.5 text-sm text-teal-700 dark:text-teal-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You will receive a confirmation email
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Our team will contact you within 24 hours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Equipment inspection and delivery will be coordinated
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
              <Link href="/catalog">
                <Package className="mr-2 h-4 w-4" />
                Browse More Equipment
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-600" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
