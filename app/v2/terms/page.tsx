import { FileCheck2, Scale } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";

const sections = [
  ["Quotations", "Quotations are prepared based on the information shared by the customer. Final product selection, technical suitability, pricing, taxes, and commercial terms must be confirmed in writing."],
  ["Orders", "Submitting an enquiry or quote request does not create an order. Orders are confirmed only after written acceptance, agreed specifications, and applicable commercial documentation."],
  ["Pricing", "Prices may vary based on product model, quantity, brand, availability, taxes, freight, project location, and market conditions. Written quotations should be used for final commercial review."],
  ["Payments", "Payment terms, advance requirements, credit terms, and banking details must be confirmed directly with ICONIC FILTRATION AND ENGINEERS LLP before order processing."],
  ["Delivery", "Delivery timelines depend on product availability, order confirmation, payment status, logistics, and destination. Estimated delivery dates are not guaranteed unless confirmed in writing."],
  ["Warranty", "Warranty terms depend on the product, brand, manufacturer policy, usage conditions, installation quality, and operating environment. Warranty details should be confirmed before purchase."],
  ["Returns", "Returns or replacements are subject to product condition, manufacturer terms, order type, and written approval. Customized, used, damaged, or incorrectly handled products may not be eligible."],
  ["Liability", "ICONIC is not responsible for losses caused by incorrect installation, unsuitable operating conditions, incomplete customer information, unauthorized modifications, or misuse of products."],
  ["Intellectual Property", "Website content, design, graphics, brand material, catalogues, and documents belong to ICONIC or the respective rights holders unless otherwise stated."],
  ["Governing Law", "These terms are governed by applicable laws in India. Any dispute should first be discussed with ICONIC through the official contact channels."],
  ["Contact", "For questions about quotations, orders, deliveries, documents, or these terms, contact ICONIC FILTRATION AND ENGINEERS LLP through the Contact page."],
];

export default function ConceptBTermsPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        description="These terms explain how website enquiries, quotations, product information, downloads, orders, and customer communication are handled."
        action={
          <div className="b2-hero-panel">
            <Scale className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Confirm in writing</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Selection, pricing, delivery, and warranty terms should be confirmed before purchase.</p>
          </div>
        }
      />
      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead eyebrow="Terms sections" title="Commercial and website use terms." />
          <div className="b2-grid-2">
            {sections.map(([title, text]) => (
              <article key={title} className="b2-data-card">
                <FileCheck2 className="h-7 w-7 text-cyan-600" />
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
