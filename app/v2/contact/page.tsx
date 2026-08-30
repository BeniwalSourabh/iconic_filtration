import Link from "next/link";
import { ArrowRight, Building2, Clock, Headphones, Mail, MapPin, MessageSquareText, SearchCheck, Wrench, Zap } from "lucide-react";
import { ContactNumberSelector } from "@/components/v2/contact-number-selector";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { companyContact } from "@/data/company-contact";
import { productRecords } from "@/data/product-taxonomy";
import { submitContactEnquiry } from "@/lib/leads/actions";

const support = [
  ["Product Selection Assistance", "Shortlist products around capacity, application, operating condition, and preferred brand.", SearchCheck],
  ["Technical Consultation", "Discuss suitability for membranes, pressure vessels, dosing pumps, and ultrafiltration systems.", Wrench],
  ["Fast Quotation Support", "Complete enquiries help ICONIC respond with product information and quotation direction.", Zap],
  ["Dedicated Customer Service", "Receive professional support from first enquiry to follow-up communication.", Headphones],
] as const;

export default function ConceptBContactPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Contact"
        title="Get in Touch with ICONIC FILTRATION AND ENGINEERS LLP"
        description="Use direct channels, office locations, business schedule, map views, and a compact enquiry form to reach the ICONIC team."
        action={
          <div className="b2-hero-panel">
            <Building2 className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Water filtration support for business enquiries.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Serving India with international supply available.</p>
          </div>
        }
      />

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Contact Information"
            title="Contact Information"
          />
          <div className="b2-grid-3">
            <ContactNumberSelector action="phone" variant="card" />
            <ContactNumberSelector action="whatsapp" variant="card" />
            <a href={companyContact.emailHref} className="b2-data-card">
              <span className="b2-icon-disc">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-3xl">Email</h2>
              <p className="mt-3 break-all font-black text-slate-950">{companyContact.email}</p>
            </a>
          </div>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Office Locations"
            title="Office Locations"
          />
          <div className="b2-grid-2">
            {companyContact.offices.map((office) => (
              <article key={office.id} className="b2-product">
                <div className="relative h-[360px] bg-slate-100">
                  <iframe
                    src={office.mapEmbedHref}
                    title={`${office.title} Google Maps location`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="b2-product-body">
                  <span className="b2-pill">Office location</span>
                  <h3>{office.title}</h3>
                  <p className="whitespace-pre-line">{office.lines.join("\n")}</p>
                  <Link href={office.directionsHref} target="_blank" className="b2-link-chip b2-link-strong mt-5">
                    Get Directions <MapPin className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap b2-grid-3">
          <article className="b2-industry">
            <Clock className="h-8 w-8 text-cyan-300" />
            <h3>Monday - Saturday</h3>
            <p>As per business schedule. Please call before visiting.</p>
          </article>
          <article className="b2-industry">
            <Clock className="h-8 w-8 text-cyan-300" />
            <h3>Sunday</h3>
            <p>Closed for regular office visits.</p>
          </article>
          <article className="b2-industry">
            <MessageSquareText className="h-8 w-8 text-cyan-300" />
            <h3>Typical Response</h3>
            <p>Within one business day for complete product enquiries.</p>
          </article>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-split">
          <div>
            <ConceptBSectionHead
              eyebrow="Contact Form"
              title="Contact Form"
            />
            <div className="b2-grid-2">
              {support.map(([title, text, Icon]) => (
                <article key={title} className="b2-data-card">
                  <Icon className="h-7 w-7 text-cyan-600" />
                  <h2 className="mt-5 text-xl">{title}</h2>
                  <p className="mt-3">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <form action={submitContactEnquiry} className="b2-data-card b2-form-grid">
            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="b2-form-grid two">
              <label className="b2-field">
                <span>Name</span>
                <input name="name" className="b2-input" placeholder="Your name" required minLength={2} />
              </label>
              <label className="b2-field">
                <span>Company Name</span>
                <input name="company" className="b2-input" placeholder="Company name" />
              </label>
            </div>
            <div className="b2-form-grid two">
              <label className="b2-field">
                <span>Phone Number</span>
                <input name="phone" className="b2-input" placeholder="Your phone number" />
              </label>
              <label className="b2-field">
                <span>Email Address</span>
                <input name="email" type="email" className="b2-input" placeholder="Your email address" required />
              </label>
            </div>
            <div className="b2-form-grid three">
              <label className="b2-field">
                <span>City</span>
                <input name="city" className="b2-input" placeholder="Your city" />
              </label>
              <label className="b2-field">
                <span>State</span>
                <input name="state" className="b2-input" placeholder="Your state" />
              </label>
              <label className="b2-field">
                <span>Country</span>
                <input name="country" className="b2-input" placeholder="Your country" />
              </label>
            </div>
            <div className="b2-form-grid two">
              <label className="b2-field">
                <span>Product Interested In</span>
                <select name="productInterest" className="b2-select" defaultValue="">
                  <option value="">Select product</option>
                  {productRecords.map((product) => (
                    <option key={product.slug} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </label>
              <label className="b2-field">
                <span>Preferred Contact Method</span>
                <select name="preferredContactMethod" className="b2-select" defaultValue="">
                  <option value="">Select preference</option>
                  <option value="Phone">Phone</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Any suitable method">Any suitable method</option>
                </select>
              </label>
            </div>
            <label className="b2-field">
              <span>Message</span>
              <textarea name="message" className="b2-textarea" placeholder="Tell us about product requirement, capacity, quantity, delivery location, or technical question." required minLength={2} />
            </label>
            <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-600">
              <input name="consentAccepted" type="checkbox" required className="mt-1" />
              I agree that ICONIC FILTRATION AND ENGINEERS LLP may contact me about this enquiry.
            </label>
            <button type="submit" className="b2-button">
              Submit Enquiry <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
