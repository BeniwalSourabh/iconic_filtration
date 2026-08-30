import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  Building2,
  Download,
  Droplet,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  Hotel,
  PackageCheck,
  ReceiptText,
  Search,
  SlidersHorizontal,
  TestTube2,
  Wrench,
} from "lucide-react";
import { ConceptBBrandRail, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { getV2ProductBrand, getV2ProductImage } from "@/components/v2/product-utils";
import { companyPartners, getCompanyProductHref } from "@/data/company-partners";
import { industryPages } from "@/data/site-content";
import { popularTechnicalResources, technicalResources } from "@/data/technical-resources";
import { productRecords } from "@/data/product-taxonomy";

const categorySlugs = ["ro-housings", "ro-membranes", "dosing-pumps", "wastewater-filtration-systems"];
const featuredSlugs = [
  "ro-housings",
  "ro-membranes",
  "domestic-ro-membranes",
  "ro-antiscalant",
  "ro-controller-instruments",
  "dosing-pumps",
  "filter-media",
  "filter-cartridges",
];

const categories = categorySlugs
  .map((slug) => productRecords.find((product) => product.slug === slug))
  .filter(Boolean)
  .map((product) => product!);

const featuredProducts = featuredSlugs
  .map((slug) => productRecords.find((product) => product.slug === slug))
  .filter(Boolean)
  .map((product) => product!);

const workflowCards = [
  {
    number: "01",
    title: "Water Analysis",
    text: "Select water source, TDS, flow rate, pressure, and temperature.",
    Icon: Droplet,
  },
  {
    number: "02",
    title: "Product Selection",
    text: "Choose RO systems, UF, membranes, vessels, pumps, and dosing equipment.",
    Icon: PackageCheck,
  },
  {
    number: "03",
    title: "Technical Review",
    text: "Compare datasheets, specifications, compatibility, and performance.",
    Icon: FileText,
  },
  {
    number: "04",
    title: "Request Quote",
    text: "Generate a quotation based on the selected system configuration.",
    Icon: ReceiptText,
  },
];

const industryIcons = [Gauge, Building2, TestTube2, FlaskConical, Beaker, Wrench, HeartPulse, Hotel];
const visibleIndustries = industryPages.slice(0, 8).map((industry, index) => ({
  ...industry,
  Icon: industryIcons[index] ?? Building2,
}));

const visibleResources = technicalResources.filter((resource) => popularTechnicalResources.includes(resource.href)).slice(0, 4);

export default function ConceptBHomePage() {
  return (
    <>
      <section className="b2-hero">
        <div className="b2-hero-blueprint" aria-hidden="true">
          <span className="b2-blueprint-ring b2-blueprint-ring-one" />
          <span className="b2-blueprint-ring b2-blueprint-ring-two" />
          <span className="b2-blueprint-line b2-blueprint-line-one" />
          <span className="b2-blueprint-line b2-blueprint-line-two" />
        </div>
        <div className="b2-hero-grid">
          <div>
            <span className="b2-kicker">Industrial and commercial water-treatment supply</span>
            <h1>Welcome to ICONIC FILTRATION AND ENGINEERS LLP</h1>
            <p className="b2-hero-copy">
              With vast experience in industries, EPC, OEM manufacturers, and system integrators, and a leader in the{" "}
              <strong>Indian water industry</strong>, ICONIC FILTRATION AND ENGINEERS LLP provides a highly efficient
              range of <strong>water and waste water treatment components</strong> for FRP vessels, RO housings, dosing
              pumps, electro chlorination systems, multiport valves, distribution systems, high pressure pumps, hydro
              pneumatic tanks and accessories, HPN tank ultrasonic level sensors, RO membranes, filter cartridges, filter
              media, RO antiscalant, cation exchange resin, RO controllers, and instruments.
              <br />
              <br />
              ICONIC FILTRATION AND ENGINEERS LLP strives to make its customers adaptive enterprises in the long run to
              enable them to meet business challenges through capitalizing on opportunities for leveraging business
              growth.
            </p>
            <div className="b2-hero-actions">
              <Link href="/request-quote" className="b2-button">
                Start a Requirement <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="b2-ghost">
                Explore Product System <SlidersHorizontal className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <aside className="b2-hero-system" aria-label="Product selection workflow">
            <div className="b2-system-node b2-system-node-primary">
              <span className="b2-system-icon"><PackageCheck className="h-5 w-5" /></span>
              <strong>Product Requirements</strong>
              <small>Define application, water quality, capacity, and operating conditions.</small>
            </div>
            {workflowCards.map(({ number, title, text, Icon }) => (
              <div key={title} className="b2-system-node">
                <span>{number}</span>
                <span className="b2-system-icon"><Icon className="h-5 w-5" /></span>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <ConceptBBrandRail />

      <section className="b2-finder" aria-label="Find the right product">
        <div className="b2-wrap">
          <div className="b2-finder-card">
            <div>
              <span className="b2-kicker">Find the right product</span>
              <h2 className="b2-title b2-title-compact">Quick product selector</h2>
              <p className="b2-lead">
                Select a product family, application, and capacity range to begin a quote-ready product search.
              </p>
            </div>
            <form className="b2-finder-fields" action="/products">
              <label className="b2-field">
                <span>What do you need?</span>
                <select name="category" className="b2-select" defaultValue="">
                  <option value="">Select product</option>
                  <option value="ro-membranes">RO Membrane</option>
                  <option value="ro-housings">Pressure Vessel</option>
                  <option value="dosing-pumps">Dosing Pump</option>
                  <option value="wastewater-filtration-systems">Ultra Filtration</option>
                </select>
              </label>
              <label className="b2-field">
                <span>Application</span>
                <select name="industry" className="b2-select" defaultValue="">
                  <option value="">Select application</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                  <option value="industrial">Industrial Plant</option>
                  <option value="food-beverage">Food &amp; Beverage</option>
                  <option value="water-treatment">Water Treatment Plant</option>
                </select>
              </label>
              <label className="b2-field">
                <span>Flow rate</span>
                <select name="flowRate" className="b2-select" defaultValue="">
                  <option value="">Select range</option>
                  <option value="10">10 m3/hr</option>
                  <option value="25">25 m3/hr</option>
                  <option value="50">50 m3/hr</option>
                  <option value="100">100 m3/hr</option>
                </select>
              </label>
              <button className="b2-button" type="submit">
                Find Products <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Product categories"
            title="Premium Water Filtration Products for Industrial & Commercial Applications"
          />
          <div className="b2-mosaic">
            {categories.map((product) => {
              const image = getV2ProductImage(product);
              const brand = getV2ProductBrand(product);

              return (
                <Link key={product.slug} href={`/products/${product.slug}`} className="b2-category">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 460px" />
                  <div className="b2-category-body">
                    <span className="b2-pill">{brand}</span>
                    <h3>{product.name}</h3>
                    <p>{product.applicationHint}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-tight">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Featured products"
            title="Fast access to key product lines"
            action={<Link href="/products" className="b2-link-chip">View Catalogue <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="b2-carousel">
            {featuredProducts.map((product) => {
              const image = getV2ProductImage(product);

              return (
                <article key={product.slug} className="b2-product">
                  <div className="b2-product-media">
                    <Image src={image.src} alt={image.alt} fill sizes="380px" />
                  </div>
                  <div className="b2-product-body">
                    <div className="b2-pill-row">
                      <span className="b2-pill">{getV2ProductBrand(product)}</span>
                      <span className="b2-pill">{product.family.name}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.applicationHint}</p>
                    <div className="b2-product-actions">
                      <Link href={`/products/${product.slug}`} className="b2-link-chip">Details</Link>
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
        <div className="b2-wrap">
          <ConceptBSectionHead eyebrow="Authorized brands" title="Partner brands available through ICONIC" />
          <div className="b2-grid-3">
            {companyPartners.map((company) => (
              <Link key={company.slug} href={getCompanyProductHref(company)} className="b2-data-card">
                <div className="b2-product-media" style={{ height: 120 }}>
                  <Image src={company.logoPath} alt={company.logoAlt} fill sizes="260px" />
                </div>
                <h3 className="mt-5 text-2xl">{company.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark b2-band-tight">
        <div className="b2-wrap">
          <ConceptBSectionHead eyebrow="Industries we serve" title="Water filtration support across key industries" />
          <div className="b2-icon-grid">
            {visibleIndustries.map(({ name, summary, slug, Icon }) => (
              <Link key={slug} href="/industries" className="b2-industry">
                <span className="b2-icon-disc"><Icon className="h-5 w-5" /></span>
                <h3>{name}</h3>
                <p>{summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-split">
          <div>
            <ConceptBSectionHead eyebrow="Technical Resources" title="Technical Resources" />
            <Link href="/downloads" className="b2-button">
              Open Download Centre <Download className="h-4 w-4" />
            </Link>
          </div>
          <div className="b2-resource-list">
            {visibleResources.map((resource) => (
              <Link key={resource.href} href={resource.href} className="b2-resource">
                <span className="b2-icon-disc"><Download className="h-5 w-5" /></span>
                <div>
                  <h3>{resource.name}</h3>
                  <p>{resource.fileType} · {resource.fileSize} · Updated {resource.lastUpdated}</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Request Quote</span>
            <h2 className="b2-title">Ready to specify your filtration requirement?</h2>
            <p className="b2-lead">
              Share product category, brand preference, capacity, delivery location, and technical notes so the team can
              respond with the right product guidance.
            </p>
          </div>
          <div>
            <Link href="/request-quote" className="b2-button">
              Request Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
