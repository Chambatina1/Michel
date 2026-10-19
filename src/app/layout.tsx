import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "P&S Medical Device Inc. | Trusted Medical Equipment Partner",
    template: "%s | P&S Medical Device Inc.",
  },
  description:
    "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks. CT, MRI, X-Ray, Ultrasound, and Ophthalmology equipment.",
  keywords: [
    "medical devices",
    "medical imaging equipment",
    "CT scanner",
    "MRI machine",
    "X-Ray equipment",
    "ultrasound",
    "ophthalmology equipment",
    "medical equipment sales",
    "refurbished medical equipment",
    "medical equipment repair",
    "sell medical equipment",
    "P&S Medical Device Inc.",
  ],
  authors: [{ name: SITE_NAME }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.svg" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "P&S Medical Device Inc. | Trusted Medical Equipment Partner",
    description:
      "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks. CT, MRI, X-Ray, Ultrasound, and Ophthalmology equipment.",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "P&S Medical Device Inc. | Trusted Medical Equipment Partner",
    description:
      "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "P&S Medical",
    "msapplication-TileColor": "#0891b2",
  },
};

export const viewport: Viewport = {
  themeColor: "#0891b2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <AdminLayout>{children}</AdminLayout>
        </div>
        <Toaster position="top-right" richColors />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered:', registration.scope);
                  }).catch(function(error) {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "P&S Medical Device Inc.",
              "description": "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks.",
              "url": SITE_URL,
              "telephone": "+1-305-244-9340",
              "email": "info@psmedicaldevices.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2234 Winter Woods, Suite 1000",
                "addressLocality": "Winter Park",
                "addressRegion": "FL",
                "postalCode": "32792",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 28.6008,
                "longitude": -81.3396
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
              },
              "sameAs": [],
              "priceRange": "$$",
              "image": `${SITE_URL}/images/logo.jpeg`
            })
          }}
        />
      </body>
    </html>
  );
}
