import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Factory, Filter, FlaskConical, ShieldCheck } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";

const industries = [
  {
    name: "Pharmaceutical Industry",
    image: "/blog/ro-membrane-selection-fit.jpg",
    icon: FlaskConical,
    applications: "RO pretreatment, purified-water support, utility water, polishing filtration, and dosing control.",
    products: ["RO Membranes", "Dosing Pumps", "Filter Cartridges", "RO Housings"],
  },
  {
    name: "Food & Beverage",
    image: "/blog/industrial-filtration-components.jpg",
    icon: ShieldCheck,
    applications: "Ingredient water, process filtration, utility water, sediment control, and cleaning-system support.",
    products: ["Filter Cartridges", "RO Membranes", "Dosing Pumps", "Filter Media"],
  },
  {
    name: "Chemical Industry",
    image: "/partners/seko/products/kosmo-mm2-dosing-pump.webp",
    icon: FlaskConical,
    applications: "Chemical dosing, process-water conditioning, pH correction, antiscalant dosing, and compatible product selection.",
    products: ["Dosing Pumps", "RO Antiscalant", "FRP Vessels", "Level Sensors"],
  },
  {
    name: "Textile Industry",
    image: "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
    icon: Factory,
    applications: "Process-water treatment, reuse support, softening, RO systems, and wastewater polishing.",
    products: ["RO Membranes", "FRP Vessels", "Filter Media", "Ultra Filtration"],
  },
  {
    name: "Hospitals",
    image: "/images/homepage-filtration-hero-1600.jpg",
    icon: Building2,
    applications: "RO feed water, softening, utility-water filtration, equipment protection, and service-friendly replacement.",
    products: ["RO Membranes", "RO Housings", "Filter Cartridges", "Dosing Pumps"],
  },
  {
    name: "Water Treatment Plants",
    image: "/partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
    icon: Filter,
    applications: "RO systems, UF pretreatment, filtration packages, dosing, membranes, vessels, and replacement components.",
    products: ["RO Membranes", "Ultra Filtration", "Dosing Pumps", "RO Housings"],
  },
];

export default function ConceptBIndustriesPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Industries served"
        title="Water filtration products matched to real application needs."
        description="Explore common industry applications and move from operating requirements to suitable product categories and quotation support."
        action={
          <div className="b2-hero-panel">
            <Factory className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Start with your application.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Match product families to real operating requirements.</p>
          </div>
        }
      />

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Industry applications"
            title="Common filtration requirements by industry"
          />
          <div className="b2-grid-3">
            {industries.map((industry) => {
              const Icon = industry.icon;

              return (
                <article key={industry.name} className="b2-product">
                  <div className="b2-product-media">
                    <Image src={industry.image} alt={`${industry.name} water filtration application`} fill sizes="390px" />
                  </div>
                  <div className="b2-product-body">
                    <span className="b2-icon-disc">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3>{industry.name}</h3>
                    <p>{industry.applications}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {industry.products.map((product) => (
                        <span key={product} className="b2-pill">{product}</span>
                      ))}
                    </div>
                    <Link href={`/request-quote?industry=${encodeURIComponent(industry.name)}`} className="b2-link-chip b2-link-strong mt-6">
                      View Solutions <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
