import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  alternates: { canonical: "/sitemap" },
  description: "All pages on psmedicaldevices.com.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
