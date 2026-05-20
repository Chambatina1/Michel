"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Equipment", href: "/catalog" },
  {
    label: "Sell Your Equipment",
    href: "/sell-equipment",
    highlight: true,
  },
  { label: "Parts & Accessories", href: "/parts-accessories" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  // Use useSyncExternalStore for hydration-safe mounted detection
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass / blur background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />

      <div className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="P&S Medical Device Inc."
            width={80}
            height={80}
            className="rounded-xl object-contain transition-transform group-hover:scale-105 shadow-lg border-2 border-white/20"
            priority
          />
          <div className="min-w-0">
            <span className="block text-lg sm:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight text-primary whitespace-nowrap">
              P&S MEDICAL DEVICE INC.
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">Medical Imaging &amp; Ophthalmology Equipment</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span className="whitespace-nowrap">{link.label}{link.highlight && ' — Cash'}</span>
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary"
            aria-label="Shopping cart"
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/contact?type=quote">
              Get a Quote
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:max-w-sm p-0">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle className="flex items-center gap-3">
                <Image
                  src="/images/logo.jpeg"
                  alt="P&S Medical Device Inc."
                  width={80}
                  height={80}
                  className="rounded-lg object-contain shadow-md"
                />
                P&S Medical Device Inc.
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-2 py-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span className="whitespace-nowrap">{link.label}{link.highlight && ' — Cash'}</span>
                    {isActive(link.href) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto border-t border-border px-4 py-4">
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="relative flex-1"
                >
                  <Link href="/cart" className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {mounted && cartItemCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/contact?type=quote">
                    Get a Quote
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
