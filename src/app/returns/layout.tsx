import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Warranty Policy",
  alternates: { canonical: "/returns" },
  description: "How returns and warranty claims work for equipment bought from P&S Medical Device Inc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
