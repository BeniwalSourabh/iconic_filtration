import Link from "next/link";
import { ArrowRight, Factory, Globe2, MapPin, PackageCheck, ShieldCheck, Wrench } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";

const stats = [
  ["Office Locations", "Delhi & Noida", MapPin],
  ["Registration", "MSME Registered", ShieldCheck],
  ["Supply Coverage", "India & International", Globe2],
  ["Core Product Focus", "4 Categories", PackageCheck],
] as const;

const timeline = [
  ["Company Registered", "MSME registered business focused on water filtration products and engineering support."],
  ["Delhi Office", "Customer communication and product coordination from Ghazi Pur, New Delhi."],
  ["Noida Operations", "Branch support from Greater Noida West for business and supply requirements."],
  ["India & International Supply", "Industrial and commercial supply support across India with international availability."],
];

const capabilities = [
  ["Product Expertise", "RO membranes, pressure vessels, dosing pumps, ultrafiltration products, and related components.", Factory],
  ["Supply Capability", "Partner-brand sourcing, quotation support, catalogue coordination, packaging, and dispatch communication.", PackageCheck],
  ["Engineering Guidance", "Application-based product selection for water source, flow rate, treatment objective, and site condition.", Wrench],
  ["Quality Commitment", "Clear product information, careful order handling, dependable communication, and customer-focused support.", ShieldCheck],
] as const;

export default function ConceptBAboutPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="About ICONIC"
        title="Water filtration product supply with practical engineering support."
        description="ICONIC FILTRATION AND ENGINEERS LLP supplies water filtration products and technical guidance for industrial, commercial, OEM, and water-treatment requirements across India and international markets."
        action={
          <div className="b2-hero-panel">
            <ShieldCheck className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Focused on reliable product selection.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Verified company foundation with Delhi and Noida operations.</p>
          </div>
        }
      />

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-grid-4">
          {stats.map(([label, value, Icon]) => (
            <article key={label} className="b2-data-card">
              <span className="b2-icon-disc">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-black uppercase text-slate-500">{label}</p>
              <h2 className="mt-2 text-2xl">{value}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Company timeline"
            title="Built around verified business foundations"
          />
          <div className="b2-grid-4">
            {timeline.map(([title, text], index) => (
              <article key={title} className="b2-data-card">
                <span className="b2-pill">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-5 text-2xl">{title}</h2>
                <p className="mt-3">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Expertise"
            title="What ICONIC helps industrial buyers do"
          />
          <div className="b2-grid-4">
            {capabilities.map(([title, text, Icon]) => (
              <article key={title} className="b2-industry">
                <Icon className="h-8 w-8 text-cyan-300" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Quality commitment</span>
            <h2 className="b2-title">Clear information before every order.</h2>
            <p className="b2-lead">ICONIC focuses on application fit, product clarity, responsive communication, and dependable support.</p>
          </div>
          <Link href="/request-quote" className="b2-button">
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
