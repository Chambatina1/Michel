"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Equipment", href: "/catalog" },
  {
    label: "Sell Your Equipment",
    href: "/sell-equipment",
    highlight: true,
  },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass / blur background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.jpeg"
            alt="P&S Medical Device Inc."
            width={70}
            height={70}
            className="rounded-xl object-contain transition-transform group-hover:scale-105 shadow-sm"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight tracking-tight text-primary">
              P&S Medical Device
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
              Inc.
            </span>
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
              <span className="flex items-center gap-1.5">
                {link.label}
                {link.highlight && (
                  <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0 hover:bg-accent/90">
                    Cash
                  </Badge>
                )}
              </span>
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
                  width={50}
                  height={50}
                  className="rounded-xl object-contain shadow-sm"
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
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.highlight && (
                        <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0">
                          Cash
                        </Badge>
                      )}
                    </span>
                    {isActive(link.href) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto border-t border-border px-4 py-4">
              <Button
                asChild
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/contact?type=quote">
                  Get a Quote
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
