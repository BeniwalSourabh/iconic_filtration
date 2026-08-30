import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { ConceptBMobileMenu } from "@/components/v2/concept-b-mobile-menu";
import { ContactNumberSelector } from "@/components/v2/contact-number-selector";
import { companyContact } from "@/data/company-contact";
import { companyPartners, getCompanyProductHref } from "@/data/company-partners";
import { productTaxonomy } from "@/data/product-taxonomy";
import { brand } from "@/lib/design-system";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/companies" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/downloads" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function ConceptBShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="b2-root">
      <ConceptBHeader />
      <main>{children}</main>
      <ConceptBFooter />
    </div>
  );
}

export function ConceptBHeader() {
  return (
    <header className="b2-header">
      <div className="b2-nav">
        <Link href="/" className="b2-brand">
          <span className="b2-brand-mark">
            <Image src={brand.logoPath} alt="ICONIC FILTRATION AND ENGINEERS LLP logo" width={76} height={46} priority />
          </span>
          <span className="b2-brand-copy">
            <span className="b2-brand-name">ICONIC FILTRATION</span>
            <span className="b2-brand-sub">AND ENGINEERS LLP</span>
          </span>
        </Link>
        <nav className="b2-menu" aria-label="Primary navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="b2-actions">
          <Link href="/downloads" className="b2-ghost">
            <Download className="h-4 w-4" /> Resources
          </Link>
          <Link href="/request-quote" className="b2-button">
            Request Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ConceptBMobileMenu links={links} />
      </div>
    </header>
  );
}

export function ConceptBBrandRail() {
  const brands = [...companyPartners, ...companyPartners];

  return (
    <section className="b2-brand-rail" aria-label="Partner brands">
      <div className="b2-brand-track">
        {brands.map((company, index) => (
          <Link key={`${company.slug}-${index}`} href={getCompanyProductHref(company)} className="b2-logo-tile">
            <Image src={company.logoPath} alt={company.logoAlt} fill sizes="176px" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ConceptBPageHero({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="b2-page-hero">
      <div className="b2-wrap b2-page-hero-grid">
        <div>
          <span className="b2-kicker">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}

export function ConceptBSectionHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="b2-section-head">
      <div>
        <span className="b2-kicker">{eyebrow}</span>
        <h2 className="b2-title">{title}</h2>
      </div>
      <div>
        {description ? <p className="b2-lead">{description}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function ConceptBFooter() {
  const productLinks = productTaxonomy.flatMap((family) => family.products).slice(0, 6);

  return (
    <footer className="b2-footer">
      <div className="b2-footer-grid">
        <div>
          <div className="b2-brand">
            <span className="b2-brand-mark">
              <Image src={brand.logoPath} alt="ICONIC logo" width={76} height={46} />
            </span>
            <span className="b2-brand-copy">
              <span className="b2-brand-name">ICONIC FILTRATION</span>
              <span className="b2-brand-sub">AND ENGINEERS LLP</span>
            </span>
          </div>
          <p className="mt-5">
            ICONIC FILTRATION AND ENGINEERS LLP supplies water filtration products and engineering-led product selection
            support for industrial and commercial requirements.
          </p>
          <Link href="/request-quote" className="b2-button mt-6">
            Start Requirement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <h2>Quick Links</h2>
          <div className="b2-footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/industries">Industries</Link>
            <Link href="/companies">Brands</Link>
            <Link href="/downloads">Downloads</Link>
            <Link href="/blog">Insights</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h2>Products</h2>
          <div className="b2-footer-links">
            {productLinks.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`}>
                {product.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2>Contact</h2>
          <div className="b2-footer-links">
            <ContactNumberSelector action="phone" />
            <ContactNumberSelector action="whatsapp" />
            <a href={companyContact.emailHref}>
              <Mail className="mr-2 inline h-4 w-4" /> {companyContact.email}
            </a>
            {companyContact.offices.map((office) => (
              <a key={office.id} href={office.directionsHref} target="_blank" rel="noreferrer">
                <MapPin className="mr-2 inline h-4 w-4" /> {office.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="b2-footer-bottom">
        <p>Copyright (c) {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
