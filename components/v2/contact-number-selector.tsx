import { MessageCircle, PhoneCall } from "lucide-react";
import { companyContact } from "@/data/company-contact";

type ContactNumberSelectorProps = {
  action: "phone" | "whatsapp";
  variant?: "footer" | "card";
};

export function ContactNumberSelector({ action, variant = "footer" }: ContactNumberSelectorProps) {
  const isPhone = action === "phone";
  const Icon = isPhone ? PhoneCall : MessageCircle;
  const title = isPhone ? "Phone" : "WhatsApp";
  const prompt = isPhone ? "Choose a number to call" : "Choose a number for WhatsApp";

  return (
    <details className={variant === "card" ? "b2-contact-choice b2-contact-choice-card" : "b2-contact-choice"}>
      <summary className={variant === "card" ? "b2-contact-card-trigger" : "b2-contact-link-trigger"}>
        <Icon className={variant === "card" ? "h-5 w-5" : "mr-2 inline h-4 w-4"} />
        {variant === "card" ? (
          <>
            <h2 className="mt-5 text-3xl">{title}</h2>
            <p className="mt-3 break-all font-black text-slate-950">{companyContact.phoneDisplay}</p>
          </>
        ) : (
          <span>{isPhone ? companyContact.phoneDisplay : "WhatsApp"}</span>
        )}
      </summary>

      <div className="b2-contact-popover">
        <span className="b2-contact-popover-label">{title}</span>
        <h2>{prompt}</h2>
        <div className="b2-contact-number-list">
          {companyContact.phoneNumbers.map((number) => (
            <a
              key={`${action}-${number.display}`}
              href={isPhone ? number.href : number.whatsappHref}
              target={isPhone ? undefined : "_blank"}
              rel={isPhone ? undefined : "noreferrer"}
              className="b2-contact-number-option"
            >
              <span>{number.label}</span>
              <strong>{number.display}</strong>
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
