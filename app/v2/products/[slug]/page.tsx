import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Download, FileText, HelpCircle, Layers3, MessageSquareText, ShieldCheck } from "lucide-react";
import { ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { getV2ProductBrand, getV2ProductImage, getV2RelatedProducts } from "@/components/v2/product-utils";
import { getCompanyProductsForProduct } from "@/data/company-partners";
import { getProductBySlug, productRecords } from "@/data/product-taxonomy";
import { technicalResources } from "@/data/technical-resources";

type ConceptBProductDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return productRecords.map((product) => ({ slug: product.slug }));
}

export default async function ConceptBProductDetailPage({ params }: ConceptBProductDetailProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const image = getV2ProductImage(product);
  const brand = getV2ProductBrand(product);
  const companyProducts = getCompanyProductsForProduct(product.slug);
  const downloads = technicalResources.filter((resource) => resource.product === product.name || resource.product === product.family.name).slice(0, 4);
  const relatedProducts = getV2RelatedProducts(product, productRecords, 4);
  const overviewCards = [
    {
      label: "Brand",
      value: brand,
      description:
        brand === "Hydranautics"
          ? "Global leader in membrane filtration technology."
          : "Approved product brand for industrial and commercial water-treatment applications.",
    },
    {
      label: "Product Family",
      value: product.family.name,
      description:
        product.family.name === "Wastewater Treatment Equipment"
          ? "Engineered solutions for industrial and municipal water treatment."
          : "Product category selected for technical filtration and water-treatment requirements.",
    },
    {
      label: "Product Portfolio",
      value: "150+ Filtration Products",
      description: "RO Membranes, Pressure Vessels, Filter Cartridges, Housings & Accessories.",
    },
    {
      label: "Quotation Type",
      value: "Customized After Technical Review",
      description:
        "Every quotation is prepared based on application requirements, operating conditions, and technical specifications.",
    },
  ];

  return (
    <>
      <Link href={`/request-quote?product=${encodeURIComponent(product.name)}`} className="b2-button b2-sticky-quote">
        <MessageSquareText className="h-4 w-4" /> Request Quote
      </Link>

      <section className="b2-page-hero">
        <div className="b2-wrap">
          <nav className="mb-8 flex flex-wrap gap-3 text-sm font-bold text-white/55">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
          <div className="b2-split">
            <div>
              <span className="b2-kicker">{brand} / {product.family.name}</span>
              <h1 className="b2-detail-title">{product.name}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">{product.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/request-quote?product=${encodeURIComponent(product.name)}`} className="b2-button">
                  Request Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#downloads" className="b2-ghost">
                  Download Centre <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="b2-product-hero-img">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 560px" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-grid-4">
          {overviewCards.map((card) => (
            <article key={card.label} className="b2-data-card b2-overview-card">
              <span className="b2-pill">{card.label}</span>
              <h2 className="mt-4 text-2xl">{card.value}</h2>
              <p className="mt-3">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap b2-split">
          <div>
            <ConceptBSectionHead
              eyebrow="Product detail"
              title={product.name}
            />
            <div className="b2-grid-2">
              <article className="b2-data-card">
                <Layers3 className="h-7 w-7 text-cyan-600" />
                <h2 className="mt-5 text-2xl">Applications</h2>
                <ul className="mt-4 grid gap-3">
                  {product.applications.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="b2-data-card">
                <ShieldCheck className="h-7 w-7 text-cyan-600" />
                <h2 className="mt-5 text-2xl">Selection Notes</h2>
                <ul className="mt-4 grid gap-3">
                  {product.selectionNotes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
          <aside className="b2-data-card">
            <span className="b2-pill">Verified data policy</span>
            <h2 className="mt-5 text-3xl">No invented specifications.</h2>
            <p className="mt-4">
              Specific technical values are shown only when available through approved datasheets, catalogues, or
              verified product information. Missing details are handled through quotation follow-up.
            </p>
            <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="b2-link-chip b2-link-strong mt-6">
              Ask Technical Team <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      {companyProducts.length ? (
        <section className="b2-band b2-band-dark">
          <div className="b2-wrap">
            <ConceptBSectionHead
              eyebrow="Brand products"
              title={`Available company products for ${product.name}`}
            />
            <div className="b2-carousel">
              {companyProducts.map((item) => (
                <article key={`${item.company.slug}-${item.name}`} className="b2-product">
                  {item.imagePath ? (
                    <div className="b2-product-media">
                      <Image src={item.imagePath} alt={item.imageAlt ?? item.name} fill sizes="390px" />
                    </div>
                  ) : null}
                  <div className="b2-product-body">
                    <div className="b2-pill-row">
                      <span className="b2-pill">{item.company.name}</span>
                      <span className="b2-pill">{item.category.name}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="downloads" className="b2-band b2-band-warm">
        <div className="b2-wrap b2-split">
          <div>
            <ConceptBSectionHead
              eyebrow="Download centre"
              title={`${product.name} Download Centre`}
            />
          </div>
          <div className="b2-resource-list">
            {downloads.length ? (
              downloads.map((resource) => (
                <Link key={resource.href} href={resource.href} className="b2-resource">
                  <span className="b2-icon-disc">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span>
                    <h3>{resource.name}</h3>
                    <p>{resource.fileType} · {resource.fileSize} · {resource.version}</p>
                  </span>
                  <Download className="h-4 w-4 text-slate-400" />
                </Link>
              ))
            ) : (
              <article className="b2-data-card">
                <h3 className="text-2xl">Document available on request</h3>
                <p className="mt-3">Approved datasheets or catalogues can be requested from the technical team.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap b2-grid-2">
          <article className="b2-data-card">
            <HelpCircle className="h-7 w-7 text-cyan-600" />
            <h2 className="mt-5 text-3xl">Frequently Asked Questions</h2>
            <div className="mt-6 grid gap-3">
              {[
                ["How should I select this product?", "Share water source, application, operating conditions, capacity, and preferred brand for review."],
                ["Can ICONIC provide technical documents?", "Available documents are listed in the download centre. Missing approved files can be requested."],
                ["Can I request a comparison?", "Yes. Submit the products or brands you want to compare and the team can guide you."],
              ].map(([question, answer]) => (
                <details key={question} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer font-black text-slate-950">{question}</summary>
                  <p className="mt-3">{answer}</p>
                </details>
              ))}
            </div>
          </article>
          <article className="b2-data-card">
            <h2 className="text-3xl">{`More from ${product.family.name}`}</h2>
            <div className="mt-6 grid gap-3">
              {relatedProducts.map((related) => (
                <Link key={related.slug} href={`/products/${related.slug}`} className="b2-resource">
                  <span>
                    <h3>{related.name}</h3>
                    <p>{related.applicationHint}</p>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
