import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { companyPartners, getCompanyProductHref } from "@/data/company-partners";

export default function ConceptBCompaniesPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Product companies"
        title="Select Product Company"
        description="Explore partner companies connected to the product catalogue, uploaded brand assets, and approved product information."
        action={
          <div className="b2-hero-panel">
            <BadgeCheck className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">{companyPartners.length} brands</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">One shared source of brand and product data.</p>
          </div>
        }
      />

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Select product company"
            title="Select Product Company"
          />
          <div className="b2-grid-3">
            {companyPartners.map((company) => (
              <article key={company.slug} className="b2-data-card">
                <div className="relative h-28 overflow-hidden rounded-3xl bg-white">
                  <Image src={company.logoPath} alt={company.logoAlt} fill sizes="320px" className="object-contain p-2" />
                </div>
                <h2 className="mt-5 text-3xl">{company.name}</h2>
                <p className="mt-4">{company.summary}</p>
                <Link href={getCompanyProductHref(company)} className="b2-link-chip b2-link-strong mt-6">
                  View Products <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
