import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | P&S Medical Device Inc.",
  description: "Terms of Service for psmedicaldevices.com and purchases from P&S Medical Device Inc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
