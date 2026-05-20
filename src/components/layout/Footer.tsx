import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Equipment", href: "/catalog" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Sell Equipment", href: "/sell-equipment" },
  { label: "Parts & Accessories", href: "/parts-accessories" },
  { label: "About Us", href: "/about" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/contact#faq" },
  { label: "Return Policy", href: "/returns" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/images/logo.jpeg"
                alt="P&S Medical Device Inc."
                width={100}
                height={100}
                className="rounded-xl object-contain transition-transform group-hover:scale-105 shadow-md border-2 border-white/10"
              />
              <div>
                <span className="text-lg font-bold leading-tight tracking-tight text-white">
                  P&S Medical Device Inc.
                </span>
                <span className="block text-xs text-white/50">Medical Imaging &amp; Ophthalmology Equipment</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
              Your trusted partner for premium medical imaging equipment. We
              provide sales, expert advisory, repair services, and equipment
              buybacks for healthcare facilities worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground/10 text-primary-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    +1 (305) 244-9340
                  </p>
                  <p className="text-xs text-primary-foreground/40">
                    Mon-Fri 8am-6pm EST
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-primary-foreground/70">
                  info@psmedicaldevices.com
                </p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-primary-foreground/70">
                  2234 Winter Woods,
                  <br />
                  Suite 1000, Winter Park, FL 32792
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    Mon - Fri: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-xs text-primary-foreground/40">
                    Sat: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-primary-foreground/10" />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} P&S Medical Device Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-primary-foreground/50 transition-colors hover:text-accent"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-primary-foreground/50 transition-colors hover:text-accent"
            >
              Privacy
            </Link>
            <Link
              href="/sitemap"
              className="text-xs text-primary-foreground/50 transition-colors hover:text-accent"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
