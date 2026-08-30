import nodemailer from "nodemailer";
import type { QuoteAttachment } from "@/lib/uploads/quote-attachment";

const defaultLeadInbox = "iconicfiltration1@gmail.com";

type QuoteNotificationInput = {
  publicId: string;
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  application?: string | null;
  capacity?: string | null;
  timeline?: string | null;
  message?: string | null;
  productInterest?: string;
  industry?: string;
  attachments?: QuoteAttachment[];
  createdAt: Date;
};

type ContactNotificationInput = {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt: Date;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getQuoteNotificationConfig() {
  const smtpUser = process.env.SMTP_USER?.trim() || process.env.GMAIL_USER?.trim();
  const smtpPassword = process.env.SMTP_PASSWORD?.trim() || process.env.GMAIL_APP_PASSWORD?.trim();
  const notificationTo =
    process.env.QUOTE_NOTIFICATION_TO?.trim() ||
    process.env.LEAD_NOTIFICATION_TO?.trim() ||
    defaultLeadInbox;

  if (!smtpUser || !smtpPassword || !notificationTo) {
    return null;
  }

  const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT ?? 465);
  const smtpSecure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";
  const from = process.env.SMTP_FROM?.trim() || `"ICONIC Website" <${smtpUser}>`;

  return {
    from,
    notificationTo,
    transport: {
      host: smtpHost,
      port: Number.isFinite(smtpPort) ? smtpPort : 465,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    },
  };
}

function row(label: string, value?: string | null) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:600;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function attachmentLabel(kind: QuoteAttachment["kind"]) {
  const labels: Record<QuoteAttachment["kind"], string> = {
    drawing: "Drawing",
    boq: "BOQ",
    waterAnalysis: "Water Analysis Report",
    sitePhoto: "Site Photo",
  };

  return labels[kind];
}

export async function sendQuoteRequestNotification(quote: QuoteNotificationInput) {
  const config = getQuoteNotificationConfig();

  if (!config) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport(config.transport);
  const location = [quote.city, quote.state, quote.country].filter(Boolean).join(", ");
  const subject = `New quote request: ${quote.name}${quote.company ? ` (${quote.company})` : ""}`;
  const plainText = [
    `New quote request received`,
    `Reference: ${quote.publicId}`,
    `Name: ${quote.name}`,
    quote.company ? `Company: ${quote.company}` : undefined,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone}`,
    location ? `Location: ${location}` : undefined,
    quote.productInterest ? `Product interest: ${quote.productInterest}` : undefined,
    quote.industry ? `Industry: ${quote.industry}` : undefined,
    quote.application ? `Application: ${quote.application}` : undefined,
    quote.capacity ? `Capacity: ${quote.capacity}` : undefined,
    quote.timeline ? `Timeline: ${quote.timeline}` : undefined,
    quote.message ? `Message:\n${quote.message}` : undefined,
    ...(quote.attachments ?? []).map((attachment) => `${attachmentLabel(attachment.kind)} (${attachment.name}): ${attachment.url}`),
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <h2 style="margin:0 0 8px;color:#073a7a;">New quote request received</h2>
      <p style="margin:0 0 18px;color:#475569;">Reference: <strong>${escapeHtml(quote.publicId)}</strong></p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        ${row("Submitted", quote.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
        ${row("Name", quote.name)}
        ${row("Company", quote.company)}
        ${row("Email", quote.email)}
        ${row("Phone", quote.phone)}
        ${row("Location", location)}
        ${row("Product interest", quote.productInterest)}
        ${row("Industry", quote.industry)}
        ${row("Application", quote.application)}
        ${row("Capacity", quote.capacity)}
        ${row("Timeline", quote.timeline)}
      </table>
      ${
        quote.message
          ? `<h3 style="margin:22px 0 8px;color:#073a7a;">Message</h3><p style="white-space:pre-line;margin:0;color:#334155;">${escapeHtml(quote.message)}</p>`
          : ""
      }
      ${
        quote.attachments?.length
          ? `<h3 style="margin:22px 0 8px;color:#073a7a;">Attachments</h3>
             <ul style="margin:0;padding-left:20px;color:#334155;">
               ${quote.attachments
                 .map(
                   (attachment) =>
                     `<li><a href="${escapeHtml(attachment.url)}">${escapeHtml(attachment.name)}</a> (${escapeHtml(attachmentLabel(attachment.kind))})</li>`,
                 )
                 .join("")}
             </ul>`
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from: config.from,
    to: config.notificationTo,
    replyTo: quote.email,
    subject,
    text: plainText,
    html,
  });

  return { skipped: false };
}

export async function sendContactEnquiryNotification(contact: ContactNotificationInput) {
  const config = getQuoteNotificationConfig();

  if (!config) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport(config.transport);
  const subject = `New contact enquiry: ${contact.name}${contact.company ? ` (${contact.company})` : ""}`;
  const plainText = [
    "New contact enquiry received",
    `Submitted: ${contact.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    `Name: ${contact.name}`,
    contact.company ? `Company: ${contact.company}` : undefined,
    `Email: ${contact.email}`,
    contact.phone ? `Phone: ${contact.phone}` : undefined,
    `Subject: ${contact.subject}`,
    `Message:\n${contact.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <h2 style="margin:0 0 8px;color:#073a7a;">New contact enquiry received</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        ${row("Submitted", contact.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
        ${row("Name", contact.name)}
        ${row("Company", contact.company)}
        ${row("Email", contact.email)}
        ${row("Phone", contact.phone)}
        ${row("Subject", contact.subject)}
      </table>
      <h3 style="margin:22px 0 8px;color:#073a7a;">Message</h3>
      <p style="white-space:pre-line;margin:0;color:#334155;">${escapeHtml(contact.message)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: config.from,
    to: config.notificationTo,
    replyTo: contact.email,
    subject,
    text: plainText,
    html,
  });

  return { skipped: false };
}
