import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { WhatsAppButton } from "@/components/chat/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PS Medical Devices | Trusted Medical Equipment Partner",
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
    "PS Medical Devices",
  ],
  authors: [{ name: "PS Medical Devices" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "PS Medical Devices | Trusted Medical Equipment Partner",
    description:
      "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks. CT, MRI, X-Ray, Ultrasound, and Ophthalmology equipment.",
    siteName: "PS Medical Devices",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PS Medical Devices | Trusted Medical Equipment Partner",
    description:
      "Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <AIChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
