import type { Metadata } from "next";
import { Cookie, ShieldCheck } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description:
    "Cookie Policy for ICONIC FILTRATION AND ENGINEERS LLP explaining essential cookies, analytics, third-party services, and user choices.",
  path: "/cookie-policy",
  keywords: ["ICONIC cookie policy", "website cookies", "privacy cookies"],
});

const sections = [
  ["Essential Cookies", "Essential cookies may be used to support website security, form operation, navigation, and basic site functionality."],
  ["Analytics Cookies", "Analytics tools may be used to understand page performance, visitor behaviour, and content usefulness. These tools help improve the website experience."],
  ["Third-Party Services", "Some pages may use services such as Google Maps, analytics platforms, hosting providers, and file delivery services. These services may use their own cookies."],
  ["Managing Cookies", "You can control or delete cookies through your browser settings. Disabling some cookies may affect forms, maps, or website performance."],
  ["Contact", "For questions about cookies or privacy, contact ICONIC FILTRATION AND ENGINEERS LLP through the official Contact page."],
];

export default function CookiePolicyPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="This page explains how cookies and similar technologies may be used on the ICONIC website."
        action={
          <div className="b2-hero-panel">
            <ShieldCheck className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Website operation</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Cookies help forms, security, maps, and analytics work correctly.
            </p>
          </div>
        }
      />
      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead eyebrow="Cookie sections" title="How cookies may be used." />
          <div className="b2-grid-2">
            {sections.map(([title, text]) => (
              <article key={title} className="b2-data-card">
                <Cookie className="h-7 w-7 text-cyan-600" />
                <h2 className="mt-5 text-2xl">{title}</h2>
                <p className="mt-3">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
