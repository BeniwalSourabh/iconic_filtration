import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Download,
  Factory,
  Mail,
  MapPin,
  Menu,
  PackageSearch,
} from "lucide-react";
import { ContactNumberSelector } from "@/components/v2/contact-number-selector";
import { companyContact } from "@/data/company-contact";
import { companyPartners } from "@/data/company-partners";
import { productTaxonomy } from "@/data/product-taxonomy";
import { brand } from "@/lib/design-system";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/#brands" },
  { label: "Downloads", href: "/downloads" },
  { label: "Knowledge", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function V2Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <V2Header />
      <main>{children}</main>
      <V2Footer />
    </div>
  );
}

export function V2Header() {
  const featuredProducts = productTaxonomy.flatMap((family) => family.products.slice(0, 4)).slice(0, 9);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between gap-5 px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="ICONIC home">
          <Image src={brand.logoPath} alt="ICONIC FILTRATION AND ENGINEERS LLP logo" width={52} height={52} priority className="h-13 w-13 object-contain" />
          <span className="hidden min-w-0 sm:block">
            <span className="block font-heading text-lg font-semibold leading-5 text-iconic-navy">ICONIC</span>
            <span className="block text-xs font-medium text-slate-500">Filtration and Engineers LLP</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex" aria-label="Primary navigation">
          <div className="group relative">
            <Link href="/products" className="inline-flex h-20 items-center gap-1 hover:text-iconic-blue">
              Products <PackageSearch className="h-4 w-4" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[860px] -translate-x-1/2 border border-slate-200 bg-white p-6 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-lg bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase text-iconic-green">Mega Menu</p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold text-iconic-navy">Product families</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Browse core water filtration categories, brand-linked products, and quote-ready product pages.
                  </p>
                  <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-iconic-blue">
                    View all products <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-md border border-slate-200 p-3 transition hover:border-iconic-cyan hover:bg-cyan-50">
                      <span className="block text-sm font-semibold text-iconic-navy">{product.name}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{product.applicationHint}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {navLinks.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-iconic-blue">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/downloads" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-iconic-blue hover:border-iconic-cyan">
            <Download className="h-4 w-4" /> Resources
          </Link>
          <Link href="/request-quote" className="inline-flex h-11 items-center gap-2 rounded-md bg-iconic-blue px-4 text-sm font-semibold text-white hover:bg-iconic-navy">
            Request Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="list-none rounded-md border border-slate-200 p-3 text-iconic-navy">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 top-14 w-[min(88vw,360px)] rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="grid gap-2">
              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  {item.label}
                </Link>
              ))}
              <Link href="/request-quote" className="mt-2 rounded-md bg-iconic-blue px-3 py-3 text-center text-sm font-semibold text-white">
                Request Quote
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

export function V2Footer() {
  const products = productTaxonomy.flatMap((family) => family.products).slice(0, 6);

  return (
    <footer className="border-t border-slate-200 bg-[#071a33] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <Image src={brand.logoPath} alt="ICONIC logo" width={70} height={70} className="rounded-md bg-white object-contain p-2" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            ICONIC FILTRATION AND ENGINEERS LLP supplies water filtration products and engineering-led product selection support for industrial and commercial buyers.
          </p>
          <Link href="/request-quote" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-iconic-cyan">
            Start a quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <FooterColumn
          title="Quick Links"
          links={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Technical Downloads", href: "/downloads" },
            { label: "Knowledge Center", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ]}
        />
        <FooterColumn title="Products" links={products.map((product) => ({ label: product.name, href: `/products/${product.slug}` }))} />
        <div>
          <h2 className="text-sm font-semibold uppercase text-iconic-cyan">Contact</h2>
          <div className="mt-5 grid gap-4 text-sm text-slate-300">
            <ContactLine icon={MapPin} label={companyContact.offices[0].title} value={companyContact.offices[0].lines.join(", ")} />
            <ContactLine icon={Building2} label={companyContact.offices[1].title} value={companyContact.offices[1].lines.join(", ")} />
            <ContactNumberSelector action="phone" />
            <ContactNumberSelector action="whatsapp" />
            <ContactLine icon={Mail} label="Email" value={companyContact.email} href={companyContact.emailHref} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright (c) {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav>
      <h2 className="text-sm font-semibold uppercase text-iconic-cyan">{title}</h2>
      <div className="mt-5 grid gap-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm text-slate-300 hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Factory;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-iconic-cyan" />
      <span>
        <span className="block text-xs font-semibold uppercase text-slate-500">{label}</span>
        <span className="mt-1 block leading-5">{value}</span>
      </span>
    </>
  );

  return href ? (
    <a href={href} className="flex gap-3 hover:text-white">
      {content}
    </a>
  ) : (
    <div className="flex gap-3">{content}</div>
  );
}

export function V2SectionLabel({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-9 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-iconic-green">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-iconic-navy md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}

export function V2Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase text-iconic-blue">{children}</span>;
}

export function V2PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-iconic-blue px-5 text-sm font-semibold text-white transition hover:bg-iconic-navy">
      {children}
    </Link>
  );
}

export function V2SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-iconic-blue transition hover:border-iconic-cyan hover:bg-cyan-50">
      {children}
    </Link>
  );
}

export function V2BrandStrip() {
  const logos = [...companyPartners, ...companyPartners];

  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1320px] items-center gap-8 px-5 py-5">
        <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 md:block">Authorized brands</p>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max items-center gap-10 animate-brand-marquee">
            {logos.map((company, index) => (
              <Link key={`${company.slug}-${index}`} href={`/#brands`} className="relative h-10 w-32 opacity-75 transition hover:opacity-100">
                <Image src={company.logoPath} alt={company.logoAlt} fill sizes="128px" className="object-contain" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function V2IconCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Factory;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-iconic-cyan">
      <Icon className="h-7 w-7 text-iconic-cyan" />
      <h3 className="mt-5 font-heading text-xl font-semibold text-iconic-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
