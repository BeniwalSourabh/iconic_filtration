import { LockKeyhole, ShieldCheck } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";

const sections = [
  ["Information Collected", "When you submit an enquiry, quote request, document request, or contact form, we may collect your name, company name, email address, phone number, location, product interest, application details, uploaded files, and message content."],
  ["Usage", "We use submitted information to respond to enquiries, review product requirements, prepare quotation discussions, share requested documents, improve customer communication, and protect the website from misuse."],
  ["Cookies", "The website may use essential cookies for security, forms, and site operation. Analytics cookies may be used only to understand website performance and improve user experience."],
  ["Security", "We take reasonable steps to protect enquiry information from unauthorized access, misuse, or disclosure. Access is limited to team members who need the information for business follow-up."],
  ["Third-Party Services", "The website may use trusted third-party services for hosting, file uploads, email notifications, analytics, maps, and search visibility. These services process information according to their own policies."],
  ["User Rights", "You may request correction, update, or deletion of enquiry information by contacting ICONIC through the official email or phone number published on the website."],
  ["Contact", "For privacy-related questions, contact ICONIC FILTRATION AND ENGINEERS LLP using the phone number, WhatsApp number, or email address listed on the Contact page."],
  ["Policy Updates", "This Privacy Policy may be updated when website features, legal requirements, or business processes change. The latest version will be published on this page."],
];

export default function ConceptBPrivacyPolicyPage() {
  return (
    <>
      <ConceptBPageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This policy explains how ICONIC FILTRATION AND ENGINEERS LLP collects, uses, and protects information submitted through the website."
        action={
          <div className="b2-hero-panel">
            <ShieldCheck className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Business enquiry data</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Collected only for customer communication and support.</p>
          </div>
        }
      />
      <section className="b2-band b2-band-warm">
        <div className="b2-wrap">
          <ConceptBSectionHead eyebrow="Privacy sections" title="How submitted information is handled." />
          <div className="b2-grid-2">
            {sections.map(([title, text]) => (
              <article key={title} className="b2-data-card">
                <LockKeyhole className="h-7 w-7 text-cyan-600" />
                <h2 className="mt-5 text-2xl">{title}</h2>
                <p className="mt-3">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
