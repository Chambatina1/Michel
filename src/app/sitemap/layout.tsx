import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | P&S Medical Device Inc.",
  description: "All pages on psmedicaldevices.com.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
