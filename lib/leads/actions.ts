"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { getQuoteCountryByIso2 } from "@/data/quote-location-options";
import { getPrisma } from "@/lib/db/prisma";
import { sendContactEnquiryNotification, sendQuoteRequestNotification } from "@/lib/email/quote-notification";
import { cleanOptionalText, cleanText } from "@/lib/security/input";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  malwareBlockedMessage,
  QuoteAttachmentValidationError,
  uploadQuoteAttachment,
} from "@/lib/uploads/quote-attachment";

const optionalText = (max = 250) => z.string().trim().max(max).optional().or(z.literal(""));
const requiredText = (max = 250) => z.string().trim().min(2).max(max);
const unsafeInputPattern =
  /<[^>]*>|javascript:|data:text\/html|on[a-z]+\s*=|(?:\b(?:select|insert|update|delete|drop|union|alter|create|truncate|exec)\b[\s\S]*\b(?:from|into|table|where|database|schema)\b)|--|\/\*|\*\//i;
const locationCharacters = /^[\p{L}\p{N}\s.,'’"()/#&+:;-]*$/u;

function safeLocationSchema(max = 100, required = false) {
  const base = required ? z.string().trim().min(2).max(max) : z.string().trim().max(max);

  return base
    .refine((value) => !unsafeInputPattern.test(value), "Unsafe input detected.")
    .refine((value) => !value || locationCharacters.test(value), "Unsupported characters.");
}

const safeRequiredLocationText = (max = 100) => safeLocationSchema(max, true);
const safeOptionalLocationText = (max = 100) => safeLocationSchema(max).optional().or(z.literal(""));

function safePostalCode() {
  return z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .refine((value) => !unsafeInputPattern.test(value ?? ""), "Unsafe input detected.")
    .refine((value) => !value || /^[A-Za-z0-9 -]+$/.test(value), "Unsupported postal code.");
}

const contactSchema = z.object({
  name: requiredText(120),
  company: optionalText(160),
  email: z.string().trim().email().max(160),
  phone: optionalText(40),
  city: optionalText(80),
  state: optionalText(80),
  country: optionalText(80),
  productInterest: optionalText(180),
  preferredContactMethod: optionalText(80),
  message: requiredText(2000),
  consentAccepted: z.literal("on"),
  website: optionalText(120),
});

const quoteSchema = z.object({
  name: requiredText(120),
  company: optionalText(160),
  email: z.string().trim().email().max(160),
  phone: requiredText(40),
  phoneCountryIso2: z.string().trim().length(2),
  phoneCountryDialCode: z.string().trim().regex(/^\+\d{1,4}$/),
  city: safeRequiredLocationText(100),
  cityEntryMode: z.enum(["database", "manual"]).optional().or(z.literal("")),
  cityIsoCode: optionalText(20),
  state: safeRequiredLocationText(100),
  stateEntryMode: z.enum(["database", "manual"]).optional().or(z.literal("")),
  stateIsoCode: optionalText(20),
  country: safeRequiredLocationText(100),
  countryEntryMode: z.enum(["database", "manual"]).optional().or(z.literal("")),
  countryIsoCode: optionalText(20),
  pinCode: safePostalCode(),
  deliveryAddress: safeOptionalLocationText(300),
  locationType: optionalText(80),
  designation: optionalText(120),
  industry: optionalText(140),
  productCategory: optionalText(160),
  productInterest: optionalText(180),
  preferredBrand: optionalText(120),
  quantityRequired: z.string().trim().regex(/^\d{1,7}$/).optional().or(z.literal("")),
  purchasePurpose: optionalText(140),
  application: optionalText(280),
  capacity: optionalText(120),
  timeline: requiredText(120),
  preferredContactMethod: optionalText(80),
  preferredContactTime: optionalText(80),
  companyWebsite: optionalText(200),
  gstNumber: optionalText(30),
  expectedDeliveryDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  message: optionalText(2000),
  consentAccepted: z.literal("on"),
  website: optionalText(120),
});

function validateQuotePhone(phone: string, countryIso2: string, countryDialCode: string) {
  const normalizedIso2 = countryIso2.toUpperCase();
  const country = getQuoteCountryByIso2(normalizedIso2);
  const rawPhone = phone.trim();
  const localDigits = rawPhone.replace(/\D/g, "");
  const valueToParse = rawPhone.startsWith("+") ? rawPhone : `${countryDialCode}${localDigits}`;
  const parsed = parsePhoneNumberFromString(valueToParse, country.iso2 as CountryCode);

  if (
    country.iso2 !== normalizedIso2 ||
    country.dialCode !== countryDialCode ||
    !parsed?.isValid() ||
    parsed.country !== country.iso2 ||
    !country.localLengths.includes(parsed.nationalNumber.length)
  ) {
    return null;
  }

  return {
    country,
    nationalNumber: parsed.nationalNumber,
    e164: parsed.number,
  };
}

function validatePostalCode(pinCode: string | undefined, countryIsoCode: string | undefined) {
  const value = cleanText(pinCode ?? "");

  if (!value) {
    return true;
  }

  if (countryIsoCode?.toUpperCase() === "IN") {
    return /^\d{6}$/.test(value);
  }

  return /^[A-Za-z0-9][A-Za-z0-9 -]{1,18}[A-Za-z0-9]$/.test(value);
}

function entryModeLabel(value: string | undefined) {
  return value === "manual" ? "Manual Entry" : "Database Selection";
}

function readForm(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, String(formData.get(key) ?? "")]));
}

function readOptionalFile(formData: FormData, key: string) {
  const entry = formData.get(key);

  return typeof entry === "string" || !entry?.size ? undefined : entry;
}

function readOptionalFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is File => typeof entry !== "string" && Boolean(entry.size));
}

async function requestContext() {
  const headerStore = await headers();

  return {
    userAgent: cleanOptionalText(headerStore.get("user-agent") ?? undefined)?.slice(0, 500),
    ipAddress:
      cleanOptionalText(
        headerStore.get("x-forwarded-for")?.split(",")[0] ??
          headerStore.get("x-real-ip") ??
          undefined,
      ) ??
      undefined,
  };
}

export async function submitContactEnquiry(formData: FormData) {
  const parsed = contactSchema.safeParse(
    readForm(formData, [
      "name",
      "company",
      "email",
      "phone",
      "city",
      "state",
      "country",
      "productInterest",
      "preferredContactMethod",
      "message",
      "consentAccepted",
      "website",
    ]),
  );

  if (!parsed.success) {
    redirect("/contact?status=invalid");
  }

  if (parsed.data.website) {
    redirect("/contact?status=sent");
  }

  const context = await requestContext();
  const rateLimit = consumeRateLimit({
    key: `contact:${context.ipAddress ?? parsed.data.email}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    redirect("/contact?status=limited");
  }

  let destination = "/contact?status=sent";

  try {
    const prisma = getPrisma();
    const email = cleanText(parsed.data.email).toLowerCase();
    const city = cleanOptionalText(parsed.data.city);
    const state = cleanOptionalText(parsed.data.state);
    const country = cleanOptionalText(parsed.data.country);
    const productInterest = cleanOptionalText(parsed.data.productInterest);
    const preferredContactMethod = cleanOptionalText(parsed.data.preferredContactMethod);
    const location = [city, state, country].filter(Boolean).join(", ");
    const message = [
      cleanText(parsed.data.message),
      productInterest ? `Product interested in: ${productInterest}` : undefined,
      location ? `Location: ${location}` : undefined,
      preferredContactMethod ? `Preferred contact method: ${preferredContactMethod}` : undefined,
    ]
      .filter(Boolean)
      .join("\n\n");
    const recentDuplicate = await prisma.contactEnquiry.findFirst({
      where: {
        email,
        message,
        createdAt: {
          gte: new Date(Date.now() - 2 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    if (!recentDuplicate) {
      const contactEnquiry = await prisma.contactEnquiry.create({
        data: {
          name: cleanText(parsed.data.name),
          company: cleanOptionalText(parsed.data.company),
          email,
          phone: cleanOptionalText(parsed.data.phone),
          subject: productInterest ?? "Website contact enquiry",
          message,
          consentAccepted: true,
          source: "WEBSITE",
          ...context,
        },
      });

      try {
        await sendContactEnquiryNotification({
          name: contactEnquiry.name,
          company: contactEnquiry.company,
          email: contactEnquiry.email,
          phone: contactEnquiry.phone,
          subject: contactEnquiry.subject ?? "Website contact enquiry",
          message: contactEnquiry.message,
          createdAt: contactEnquiry.createdAt,
        });
      } catch (error) {
        console.error("Contact enquiry email notification failed", error);
      }
    }
  } catch (error) {
    console.error("Contact enquiry submission failed", error);
    destination = "/contact?status=configuration";
  }

  redirect(destination);
}

export async function submitQuoteRequest(formData: FormData) {
  const parsed = quoteSchema.safeParse(
    readForm(formData, [
      "name",
      "company",
      "email",
      "phone",
      "phoneCountryIso2",
      "phoneCountryDialCode",
      "city",
      "cityEntryMode",
      "cityIsoCode",
      "state",
      "stateEntryMode",
      "stateIsoCode",
      "country",
      "countryEntryMode",
      "countryIsoCode",
      "pinCode",
      "deliveryAddress",
      "locationType",
      "designation",
      "industry",
      "productCategory",
      "productInterest",
      "preferredBrand",
      "quantityRequired",
      "purchasePurpose",
      "application",
      "capacity",
      "timeline",
      "preferredContactMethod",
      "preferredContactTime",
      "companyWebsite",
      "gstNumber",
      "expectedDeliveryDate",
      "message",
      "consentAccepted",
      "website",
    ]),
  );

  if (!parsed.success) {
    redirect("/request-quote?status=invalid");
  }

  if (parsed.data.website) {
    redirect("/request-quote?status=sent");
  }

  const validPhone = validateQuotePhone(parsed.data.phone, parsed.data.phoneCountryIso2, parsed.data.phoneCountryDialCode);

  if (!validPhone) {
    redirect("/request-quote?status=invalid");
  }

  if (!validatePostalCode(parsed.data.pinCode, parsed.data.countryIsoCode)) {
    redirect("/request-quote?status=invalid-location");
  }

  const context = await requestContext();
  const rateLimit = consumeRateLimit({
    key: `quote:${context.ipAddress ?? parsed.data.email}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    redirect("/request-quote?status=limited");
  }

  let destination = "/request-quote?status=sent";

  try {
    const prisma = getPrisma();
    const industry = cleanOptionalText(parsed.data.industry);
    const designation = cleanOptionalText(parsed.data.designation);
    const productCategory = cleanOptionalText(parsed.data.productCategory);
    const productInterest = cleanOptionalText(parsed.data.productInterest);
    const preferredBrand = cleanOptionalText(parsed.data.preferredBrand);
    const quantityRequired = parsed.data.quantityRequired ? Number.parseInt(parsed.data.quantityRequired, 10) : undefined;
    const purchasePurpose = cleanOptionalText(parsed.data.purchasePurpose);
    const preferredContactMethod = cleanOptionalText(parsed.data.preferredContactMethod);
    const preferredContactTime = cleanOptionalText(parsed.data.preferredContactTime);
    const companyWebsite = cleanOptionalText(parsed.data.companyWebsite);
    const gstNumber = cleanOptionalText(parsed.data.gstNumber);
    const expectedDeliveryDate = cleanOptionalText(parsed.data.expectedDeliveryDate);
    const country = cleanText(parsed.data.country);
    const state = cleanText(parsed.data.state);
    const city = cleanText(parsed.data.city);
    const pinCode = cleanOptionalText(parsed.data.pinCode);
    const deliveryAddress = cleanOptionalText(parsed.data.deliveryAddress);
    const locationType = cleanOptionalText(parsed.data.locationType);
    const email = cleanText(parsed.data.email).toLowerCase();
    const itemName = productInterest ?? preferredBrand;

    console.info("Quote location submission", {
      timestamp: new Date().toISOString(),
      ipAddress: context.ipAddress,
      browser: context.userAgent,
      country,
    });

    const recentDuplicate = await prisma.quoteRequest.findFirst({
      where: {
        email,
        phone: validPhone.e164,
        createdAt: {
          gte: new Date(Date.now() - 2 * 60 * 1000),
        },
        items: itemName
          ? {
              some: {
                productName: itemName,
              },
            }
          : undefined,
      },
      select: { id: true },
    });

    if (!recentDuplicate) {
      const drawingFile = readOptionalFile(formData, "drawing");
      const boqFile = readOptionalFile(formData, "boq");
      const waterAnalysisFile = readOptionalFile(formData, "waterAnalysis");
      const sitePhotoFiles = readOptionalFiles(formData, "sitePhotos");
      const attachments = [];

      if (drawingFile) {
        attachments.push(await uploadQuoteAttachment(drawingFile, "drawing"));
      }

      if (boqFile) {
        attachments.push(await uploadQuoteAttachment(boqFile, "boq"));
      }

      if (waterAnalysisFile) {
        attachments.push(await uploadQuoteAttachment(waterAnalysisFile, "waterAnalysis"));
      }

      for (const sitePhotoFile of sitePhotoFiles) {
        attachments.push(await uploadQuoteAttachment(sitePhotoFile, "sitePhoto"));
      }

      const message = [
        cleanOptionalText(parsed.data.message),
        industry ? `Industry: ${industry}` : undefined,
        designation ? `Designation: ${designation}` : undefined,
        productCategory ? `Product category: ${productCategory}` : undefined,
        productInterest ? `Product or equipment required: ${productInterest}` : undefined,
        preferredBrand ? `Preferred brand: ${preferredBrand}` : undefined,
        quantityRequired ? `Quantity required: ${quantityRequired}` : undefined,
        purchasePurpose ? `Purchase purpose: ${purchasePurpose}` : undefined,
        companyWebsite ? `Company website: ${companyWebsite}` : undefined,
        gstNumber ? `GST number: ${gstNumber}` : undefined,
        `Delivery country: ${country} (${entryModeLabel(parsed.data.countryEntryMode)})`,
        `Delivery state/province: ${state} (${entryModeLabel(parsed.data.stateEntryMode)})`,
        `Delivery city: ${city} (${entryModeLabel(parsed.data.cityEntryMode)})`,
        pinCode ? `PIN/ZIP code: ${pinCode}` : undefined,
        deliveryAddress ? `Complete delivery address: ${deliveryAddress}` : undefined,
        locationType ? `Location type: ${locationType}` : undefined,
        expectedDeliveryDate ? `Expected delivery date: ${expectedDeliveryDate}` : undefined,
        preferredContactMethod ? `Preferred contact method: ${preferredContactMethod}` : undefined,
        preferredContactTime ? `Preferred contact time: ${preferredContactTime}` : undefined,
      ]
        .filter(Boolean)
        .join("\n\n");

      const quoteRequest = await prisma.quoteRequest.create({
        data: {
          name: cleanText(parsed.data.name),
          company: cleanOptionalText(parsed.data.company),
          email,
          phone: validPhone.e164,
          country,
          state,
          city,
          application: cleanOptionalText(parsed.data.application),
          capacity: cleanOptionalText(parsed.data.capacity),
          timeline: cleanText(parsed.data.timeline),
          message,
          attachmentUrl: attachments.length ? JSON.stringify(attachments) : undefined,
          consentAccepted: true,
          source: "WEBSITE",
          items: itemName
            ? {
                create: {
                  productName: itemName,
                  quantity: quantityRequired,
                },
              }
            : undefined,
          ...context,
        },
      });

      try {
        await sendQuoteRequestNotification({
          publicId: quoteRequest.publicId,
          name: quoteRequest.name,
          company: quoteRequest.company,
          email: quoteRequest.email,
          phone: quoteRequest.phone,
          country: quoteRequest.country,
          state: quoteRequest.state,
          city: quoteRequest.city,
          application: quoteRequest.application,
          capacity: quoteRequest.capacity,
          timeline: quoteRequest.timeline,
          message,
          productInterest,
          industry,
          attachments,
          createdAt: quoteRequest.createdAt,
        });
      } catch (error) {
        console.error("Quote request email notification failed", error);
      }
    }
  } catch (error) {
    console.error("Quote request submission failed", error);
    destination =
      error instanceof QuoteAttachmentValidationError
        ? error.message === malwareBlockedMessage
          ? "/request-quote?status=upload-security"
          : "/request-quote?status=upload-invalid"
        : "/request-quote?status=configuration";
  }

  redirect(destination);
}
