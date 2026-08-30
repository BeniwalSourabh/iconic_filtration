import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Filter, SlidersHorizontal } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { getV2ProductBrand, getV2ProductImage } from "@/components/v2/product-utils";
import { companyPartners } from "@/data/company-partners";
import { industryPages } from "@/data/site-content";
import { productRecords, productTaxonomy } from "@/data/product-taxonomy";

type ConceptBProductsPageProps = {
  searchParams?: Promise<{
    query?: string;
    brand?: string;
    family?: string;
    industry?: string;
    application?: string;
    flow?: string;
    pressure?: string;
    micron?: string;
  }>;
};

const categoryEntrances = productTaxonomy
  .map((family) => ({ family, product: productRecords.find((product) => product.family.slug === family.slug) }))
  .filter((item) => item.product);

export default async function ConceptBProductsPage({ searchParams }: ConceptBProductsPageProps) {
  const params = await searchParams;
  const query = params?.query?.trim().toLowerCase() ?? "";
  const brand = params?.brand ?? "";
  const family = params?.family ?? "";
  const industry = params?.industry ?? "";

  const products = productRecords.filter((product) => {
    const brandName = getV2ProductBrand(product);
    const searchable = [
      product.name,
      product.description,
      product.applicationHint,
      product.family.name,
      product.applications.join(" "),
      brandName,
      industry,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!brand || brandName.toLowerCase() === brand.toLowerCase()) &&
      (!family || product.family.slug === family)
    );
  });

  return (
    <>
      <ConceptBPageHero
        eyebrow="Product portal"
        title="Find, compare, and request water filtration products faster."
        description="Explore the product catalogue through visual categories, technical filters, compact product cards, and quote-first navigation."
        action={
          <div className="b2-hero-panel">
            <span className="b2-icon-disc">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-2xl font-black">Comparison-ready catalogue</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Shortlist products and request a quote from the same browsing flow.
            </p>
          </div>
        }
      />

      <section className="b2-band-tight">
        <div className="b2-wrap">
          <form>
            <div className="b2-filter-dock">
              <label className="b2-field">
                <span>Search products</span>
                <input name="query" className="b2-input" placeholder="RO membrane, dosing pump, pressure vessel..." defaultValue={params?.query ?? ""} />
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
                <span>Category</span>
                <select name="family" className="b2-select" defaultValue={family}>
                  <option value="">All categories</option>
                  {productTaxonomy.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="b2-field">
                <span>Industry</span>
                <select name="industry" className="b2-select" defaultValue={industry}>
                  <option value="">Any industry</option>
                  {industryPages.slice(0, 10).map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="b2-button" type="submit">
                Filter <Filter className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 b2-grid-4">
              <label className="b2-field">
                <span>Application</span>
                <input name="application" className="b2-input" placeholder="Boiler feed, process RO..." defaultValue={params?.application ?? ""} />
              </label>
              <label className="b2-field">
                <span>Flow Rate</span>
                <input name="flow" className="b2-input" placeholder="25 m3/hr" defaultValue={params?.flow ?? ""} />
              </label>
              <label className="b2-field">
                <span>Pressure</span>
                <input name="pressure" className="b2-input" placeholder="4 bar, 10 bar..." defaultValue={params?.pressure ?? ""} />
              </label>
              <label className="b2-field">
                <span>Micron Rating</span>
                <input name="micron" className="b2-input" placeholder="5 micron, 0.03 micron..." defaultValue={params?.micron ?? ""} />
              </label>
            </div>
          </form>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Product discovery"
            title="Modern industrial product portal"
          />
          <div className="b2-mosaic">
            {categoryEntrances.map(({ family, product }) => {
              if (!product) {
                return null;
              }

              const image = getV2ProductImage(product);

              return (
                <Link key={family.slug} href={`/products?family=${family.slug}`} className="b2-category">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, 45vw" />
                  <span className="b2-category-body">
                    <h3>{family.name}</h3>
                    {family.description ? <p>{family.description}</p> : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <div className="b2-grid-3">
            {products.map((product) => {
              const image = getV2ProductImage(product);

              return (
                <article key={product.slug} className="b2-product">
                  <div className="b2-product-media">
                    <Image src={image.src} alt={image.alt} fill sizes="390px" />
                  </div>
                  <div className="b2-product-body">
                    <div className="b2-pill-row">
                      <span className="b2-pill">{getV2ProductBrand(product)}</span>
                      <span className="b2-pill">{product.family.name}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.applicationHint}</p>
                    <div className="b2-product-actions">
                      <Link href={`/products/${product.slug}`} className="b2-link-chip">
                        View Details <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href={`/request-quote?product=${encodeURIComponent(product.name)}`} className="b2-link-chip b2-link-strong">
                        Quote
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Compare products</span>
            <h2 className="b2-title">Need to compare specifications before enquiry?</h2>
            <p className="b2-lead">
              Shortlist brand, application, flow, pressure, and material requirements. ICONIC can help compare options
              from available catalogue data and approved datasheets.
            </p>
          </div>
          <Link href="/contact" className="b2-button">
            Ask for Comparison Help <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
