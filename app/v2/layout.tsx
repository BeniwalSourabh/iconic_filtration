import type { Metadata } from "next";
import { ConceptBShell } from "@/components/v2/concept-b-shell";
import "@/styles/concept-b.css";

export const metadata: Metadata = {
  title: {
    default: "Premium Industrial Product Portal | ICONIC Filtration",
    template: "%s | ICONIC Filtration",
  },
  description:
    "Premium industrial product portal for ICONIC FILTRATION AND ENGINEERS LLP water filtration products, technical resources, and quotation support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <ConceptBShell>{children}</ConceptBShell>;
}
