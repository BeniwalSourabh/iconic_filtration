import { ConceptBShell } from "@/components/v2/concept-b-shell";
import "@/styles/concept-b.css";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <ConceptBShell>{children}</ConceptBShell>;
}
