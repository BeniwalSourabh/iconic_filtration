import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Mail,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { ConceptBQuoteDeliveryFields, ConceptBQuotePhoneField } from "@/components/v2/concept-b-quote-phone-delivery-fields";
import { QuoteDocumentUpload } from "@/components/v2/quote-document-upload";
import { companyContact } from "@/data/company-contact";
import { companyPartners } from "@/data/company-partners";
import { industryPages } from "@/data/site-content";
import { productRecords, productTaxonomy } from "@/data/product-taxonomy";
import { submitQuoteRequest } from "@/lib/leads/actions";

type ConceptBQuotePageProps = {
  searchParams?: Promise<{ product?: string; status?: string }>;
};

const designations = ["Owner / Director", "Procurement Manager", "Project Engineer", "Consultant", "Plant Manager", "Other"];
const quantityRanges = [
  { label: "1 piece", value: "1" },
  { label: "2-5 pieces", value: "5" },
  { label: "6-10 pieces", value: "10" },
  { label: "11-25 pieces", value: "25" },
  { label: "26-50 pieces", value: "50" },
  { label: "50+ pieces", value: "100" },
];
const purchasePurposes = ["New Project", "Replacement", "Regular Purchase", "Tender / BOQ", "Maintenance", "Price Comparison"];
const contactMethods = ["Phone Call", "WhatsApp", "Email", "Any method"];
const contactTimes = ["Morning", "Afternoon", "Evening", "Business hours", "Any time"];

const heroProducts = [
  { src: "/partners/hydranautics/products/ld-technology-ro-membranes.webp", alt: "Industrial RO membrane elements" },
  { src: "/partners/dax/products/ro-pressure-vessels.webp", alt: "RO pressure vessel products" },
  { src: "/partners/seko/products/kosmo-mm2-dosing-pump.webp", alt: "Industrial dosing pump" },
  { src: "/partners/fenton/products/uf-8585-ultrafiltration-membrane.webp", alt: "Ultrafiltration membrane module" },
];
const sidebarTrustItems = [
  { label: "Genuine Products", Icon: ShieldCheck },
  { label: "Authorized Supply", Icon: BadgeCheck },
  { label: "Trusted Brands", Icon: PackageCheck },
  { label: "Fast Delivery", Icon: Truck },
  { label: "Technical Support", Icon: Wrench },
];
const trustBadges = [
  { label: "Genuine Products", Icon: ShieldCheck },
  { label: "Pan India Supply", Icon: Truck },
  { label: "International Supply", Icon: BriefcaseBusiness },
];

function statusMessage(status?: string) {
  if (status === "sent") {
    return {
      title: "Quote request submitted",
      text: "Thank you. Your enquiry has been received and the ICONIC team will review your requirement.",
      tone: "success",
    };
  }

  if (status === "invalid") {
    return {
      title: "Please check the form details",
      text: "Some required details or uploaded files need correction before submission.",
      tone: "error",
    };
  }

  if (status === "limited") {
    return {
      title: "Too many attempts",
      text: "Please wait a few minutes before submitting another quote request.",
      tone: "error",
    };
  }

  if (status === "upload-invalid") {
    return {
      title: "Upload failed",
      text: "Please upload a valid PDF, DOC, DOCX or PNG file that meets the size requirements.",
      tone: "error",
    };
  }

  if (status === "upload-security") {
    return {
      title: "Upload blocked",
      text: "Upload blocked. The selected file failed our security validation.",
      tone: "error",
    };
  }

  if (status === "invalid-location") {
    return {
      title: "Please check delivery details",
      text: "Please select a country, state, city, expected delivery option, and enter a valid postal code if provided.",
      tone: "error",
    };
  }

  if (status === "configuration") {
    return {
      title: "Quote storage is temporarily unavailable",
      text: "Please contact ICONIC directly by phone, WhatsApp, or email.",
      tone: "error",
    };
  }

  return null;
}

export default async function ConceptBQuotePage({ searchParams }: ConceptBQuotePageProps) {
  const params = await searchParams;
  const selectedProduct = params?.product ?? "";
  const message = statusMessage(params?.status);

  return (
    <div className="b2-quote-page">
      <section className="b2-quote-hero">
        <div className="b2-wrap b2-quote-hero-grid">
          <div>
            <h1>Request a Quote</h1>
            <p>
              Tell us your product requirement and our team will provide the right solution and competitive pricing.
            </p>
          </div>
          <div className="b2-quote-hero-products" aria-label="Water filtration product range">
            {heroProducts.map((product, index) => (
              <div key={product.src} className={`b2-quote-product-orbit b2-quote-product-orbit-${index + 1}`}>
                <Image src={product.src} alt={product.alt} fill sizes="180px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-quote-progress" aria-label="Quote request steps">
        <div className="b2-wrap b2-quote-progress-grid">
          {[
            ["01", "Contact Details", "Tell us about yourself"],
            ["02", "Product Requirements", "What product do you need?"],
            ["03", "Additional Information", "Delivery, documents and more"],
          ].map(([number, title, text]) => (
            <div key={title} className="b2-quote-step">
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="b2-band b2-quote-workspace">
        <div className="b2-wrap">
          {message ? (
            <div className={`b2-quote-alert b2-quote-alert-${message.tone}`}>
              <strong>{message.title}</strong>
              <span>{message.text}</span>
            </div>
          ) : null}

          <div className="b2-quote-layout">
            <form action={submitQuoteRequest} className="b2-quote-form-card">
              <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <section className="b2-quote-form-section">
                <div className="b2-quote-section-title">
                  <span><BadgeCheck className="h-5 w-5" /></span>
                  <h2>Contact Details</h2>
                </div>
                <div className="b2-form-grid two">
                  <label className="b2-field">
                    <span>Full Name *</span>
                    <input name="name" className="b2-input" placeholder="Your full name" required minLength={2} />
                  </label>
                  <label className="b2-field">
                    <span>Company Name *</span>
                    <input name="company" className="b2-input" placeholder="Your company name" required minLength={2} />
                  </label>
                  <label className="b2-field">
                    <span>Business Email *</span>
                    <input name="email" type="email" className="b2-input" placeholder="your email" required />
                  </label>
                  <ConceptBQuotePhoneField />
                  <label className="b2-field">
                    <span>Designation</span>
                    <select name="designation" className="b2-select" defaultValue="">
                      <option value="">Select designation</option>
                      {designations.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>GST Number</span>
                    <input name="gstNumber" className="b2-input" placeholder="GST number, if applicable" />
                  </label>
                </div>
              </section>

              <section className="b2-quote-form-section">
                <div className="b2-quote-section-title">
                  <span><PackageCheck className="h-5 w-5" /></span>
                  <h2>Product Requirements</h2>
                </div>
                <div className="b2-form-grid three">
                  <label className="b2-field">
                    <span>Product Category *</span>
                    <select name="productCategory" className="b2-select" required defaultValue="">
                      <option value="">Select product category</option>
                      {productTaxonomy.map((family) => (
                        <option key={family.slug} value={family.name}>{family.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>Preferred Brand</span>
                    <select name="preferredBrand" className="b2-select" defaultValue="">
                      <option value="">Select brand</option>
                      {companyPartners.map((company) => (
                        <option key={company.slug} value={company.name}>{company.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>Product Model</span>
                    <input
                      name="productInterest"
                      className="b2-input"
                      placeholder="Search or type model"
                      defaultValue={selectedProduct}
                      list="b2-product-models"
                    />
                    <datalist id="b2-product-models">
                      {productRecords.map((product) => (
                        <option key={product.slug} value={product.name} />
                      ))}
                    </datalist>
                  </label>
                  <label className="b2-field">
                    <span>Quantity Required *</span>
                    <select name="quantityRequired" className="b2-select" required defaultValue="">
                      <option value="">Select quantity range</option>
                      {quantityRanges.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>Purchase Purpose</span>
                    <select name="purchasePurpose" className="b2-select" defaultValue="">
                      <option value="">Select purpose</option>
                      {purchasePurposes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>Industry *</span>
                    <select name="industry" className="b2-select" required defaultValue="">
                      <option value="">Select industry</option>
                      {industryPages.map((industry) => (
                        <option key={industry.slug} value={industry.name}>{industry.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="b2-quote-form-section">
                <div className="b2-quote-section-title">
                  <span><Truck className="h-5 w-5" /></span>
                  <h2>Location &amp; Delivery Details</h2>
                </div>
                <ConceptBQuoteDeliveryFields />
              </section>

              <section className="b2-quote-form-section">
                <div className="b2-quote-section-title">
                  <span><FileText className="h-5 w-5" /></span>
                  <h2>Additional Notes</h2>
                </div>
                <div className="b2-form-grid two">
                  <label className="b2-field">
                    <span>Flow Rate / Capacity</span>
                    <input name="capacity" className="b2-input" placeholder="25 m3/hr at 4 bar" />
                  </label>
                  <label className="b2-field">
                    <span>Water Source & Application</span>
                    <input name="application" className="b2-input" placeholder="Borewell water for process RO plant" />
                  </label>
                </div>
                <label className="b2-field mt-4">
                  <span>Requirement / Message</span>
                  <textarea
                    name="message"
                    className="b2-textarea"
                    placeholder="Describe your product requirement, preferred brand/model, quantity, or any additional information."
                  />
                </label>
              </section>

              <section className="b2-quote-form-section">
                <QuoteDocumentUpload />
              </section>

              <section className="b2-quote-form-section">
                <div className="b2-quote-section-title">
                  <span><MessageCircle className="h-5 w-5" /></span>
                  <h2>Preferred Communication</h2>
                </div>
                <div className="b2-form-grid two">
                  <label className="b2-field">
                    <span>Preferred Contact Method</span>
                    <select name="preferredContactMethod" className="b2-select" defaultValue="">
                      <option value="">Select preferred method</option>
                      {contactMethods.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="b2-field">
                    <span>Preferred Contact Time</span>
                    <select name="preferredContactTime" className="b2-select" defaultValue="">
                      <option value="">Select preferred time</option>
                      {contactTimes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="b2-consent">
                  <input name="consentAccepted" type="checkbox" required />
                  <span>I agree to be contacted regarding this quotation.</span>
                </label>
                <button type="submit" className="b2-quote-submit">
                  Submit Quote Request <Send className="h-4 w-4" />
                </button>
              </section>
            </form>

            <aside className="b2-quote-sidebar">
              <article className="b2-quote-side-card">
                <h2>Why Choose ICONIC</h2>
                <div className="b2-side-list">
                  {sidebarTrustItems.map(({ label, Icon }) => (
                    <div key={label} className="b2-side-row">
                      <span><Icon className="h-5 w-5" /></span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="b2-quote-side-card">
                <h2>Contact</h2>
                <div className="b2-side-list">
                  <a className="b2-side-row" href={companyContact.phoneNumbers[0].href}>
                    <span><Phone className="h-5 w-5" /></span>
                    <strong>{companyContact.phoneDisplay}</strong>
                  </a>
                  <a className="b2-side-row" href={companyContact.phoneNumbers[0].whatsappHref} target="_blank" rel="noreferrer">
                    <span><MessageCircle className="h-5 w-5" /></span>
                    <strong>WhatsApp Sales</strong>
                  </a>
                  <a className="b2-side-row" href={companyContact.emailHref}>
                    <span><Mail className="h-5 w-5" /></span>
                    <strong>{companyContact.email}</strong>
                  </a>
                  <div className="b2-side-row">
                    <span><Clock3 className="h-5 w-5" /></span>
                    <strong>Mon - Sat, business hours</strong>
                  </div>
                </div>
              </article>

              <article className="b2-quote-side-card">
                <h2>Industries We Supply</h2>
                <div className="b2-side-bullets">
                  {["OEM Manufacturers", "EPC Contractors", "Water Treatment Companies", "Industrial Plants", "Consultants", "Government Projects"].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </section>

      <section className="b2-quote-trust-band">
        <div className="b2-wrap b2-quote-trust-grid">
          {trustBadges.map(({ label, Icon }) => (
            <div key={label} className="b2-quote-trust-item">
              <Icon className="h-8 w-8" />
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Need assistance?</span>
            <h2 className="b2-title">Need Help Choosing the Right Product?</h2>
            <p className="b2-lead">
              Browse our product catalogue or speak with our technical team to find the right water filtration solution before submitting your enquiry.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/products" className="b2-button">View Products <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="b2-link-chip">Talk to an Expert</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
