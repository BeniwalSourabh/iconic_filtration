import Link from "next/link";
import { ArrowRight, Download, FileStack, Filter, Search } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { companyPartners } from "@/data/company-partners";
import { productRecords } from "@/data/product-taxonomy";
import { technicalResources, technicalResourceSections } from "@/data/technical-resources";

type ConceptBDownloadsPageProps = {
  searchParams?: Promise<{ query?: string; brand?: string; product?: string; type?: string }>;
};

export default async function ConceptBDownloadsPage({ searchParams }: ConceptBDownloadsPageProps) {
  const params = await searchParams;
  const query = params?.query?.trim().toLowerCase() ?? "";
  const brand = params?.brand ?? "";
  const product = params?.product ?? "";
  const type = params?.type ?? "";

  const resources = technicalResources.filter((resource) => {
    const searchable = [resource.name, resource.description, resource.brand, resource.product, resource.fileType, resource.section].join(" ").toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!brand || resource.brand === brand) &&
      (!product || resource.product === product) &&
      (!type || resource.fileType === type)
    );
  });
  const documentTypes = Array.from(new Set(technicalResources.map((resource) => resource.fileType)));

  return (
    <>
      <ConceptBPageHero
        eyebrow="Technical Resources"
        title="Technical Resources"
        description="Search approved product catalogues, datasheets, selection guides, brochures, and company documents without placeholder files or developer-facing text."
        action={
          <div className="b2-hero-panel">
            <FileStack className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Technical documents for buyers</h2>
          </div>
        }
      />

      <section className="b2-band-tight">
        <div className="b2-wrap">
          <form className="b2-filter-dock">
            <label className="b2-field">
              <span>Search documents</span>
              <input name="query" className="b2-input" placeholder="Catalogue, datasheet, RO membrane..." defaultValue={params?.query ?? ""} />
            </label>
            <label className="b2-field">
              <span>Brand</span>
              <select name="brand" className="b2-select" defaultValue={brand}>
                <option value="">All brands</option>
                {companyPartners.map((company) => (
                  <option key={company.slug} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="b2-field">
              <span>Product</span>
              <select name="product" className="b2-select" defaultValue={product}>
                <option value="">All products</option>
                {productRecords.map((item) => (
                  <option key={item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="b2-field">
              <span>Document Type</span>
              <select name="type" className="b2-select" defaultValue={type}>
                <option value="">All types</option>
                {documentTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button className="b2-button" type="submit">
              Search <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Document centre"
            title="Find the right technical file faster"
          />
          <div className="b2-grid-4">
            {technicalResourceSections.map((section) => (
              <Link key={section} href={`/downloads?query=${encodeURIComponent(section)}`} className="b2-data-card">
                <span className="b2-icon-disc">
                  <Filter className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-2xl">{section}</h2>
                <p className="mt-3">Filter approved files by this technical document group.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap b2-split">
          <div>
            <ConceptBSectionHead
              eyebrow="Download centre"
              title="Popular Downloads"
            />
          </div>
          <div className="b2-resource-list">
            {resources.map((resource) => (
              <Link key={resource.href} href={resource.href} className="b2-resource">
                <span className="b2-icon-disc">
                  <Download className="h-5 w-5" />
                </span>
                <span>
                  <h3>{resource.name}</h3>
                  <p>
                    {resource.fileType} · {resource.fileSize} · {resource.version} · Updated {resource.lastUpdated}
                  </p>
                  <p>{resource.description}</p>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
