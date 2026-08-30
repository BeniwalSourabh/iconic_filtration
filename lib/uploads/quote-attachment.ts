import { execFile as execFileCallback } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const megabyte = 1024 * 1024;
const uploadFailedMessage = "Upload failed. Please upload a valid PDF, DOC, DOCX or PNG file that meets the size requirements.";
export const malwareBlockedMessage = "Upload blocked. The selected file failed our security validation.";

const uploadRules = {
  drawing: {
    extensions: new Set(["pdf"]),
    mimeTypes: new Set(["application/pdf"]),
    maxSize: 10 * megabyte,
  },
  boq: {
    extensions: new Set(["pdf", "doc", "docx"]),
    mimeTypes: new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
    maxSize: 10 * megabyte,
  },
  waterAnalysis: {
    extensions: new Set(["pdf"]),
    mimeTypes: new Set(["application/pdf"]),
    maxSize: 10 * megabyte,
  },
  sitePhoto: {
    extensions: new Set(["png"]),
    mimeTypes: new Set(["image/png"]),
    maxSize: 5 * megabyte,
  },
} as const;

const executableExtensions = new Set([
  "app",
  "asp",
  "aspx",
  "bat",
  "cmd",
  "com",
  "cpl",
  "dll",
  "dmg",
  "exe",
  "gadget",
  "hta",
  "html",
  "htm",
  "jar",
  "js",
  "jse",
  "lnk",
  "msi",
  "msp",
  "pif",
  "pkg",
  "ps1",
  "reg",
  "scr",
  "sh",
  "svg",
  "vb",
  "vbe",
  "vbs",
  "wsf",
]);

export class QuoteAttachmentValidationError extends Error {
  constructor(message = uploadFailedMessage) {
    super(message);
    this.name = "QuoteAttachmentValidationError";
  }
}

type QuoteAttachmentKind = keyof typeof uploadRules;

export type QuoteAttachment = {
  kind: QuoteAttachmentKind;
  name: string;
  url: string;
};

function fileNameParts(name: string) {
  return name.toLowerCase().split(".").filter(Boolean);
}

function fileExtension(name: string) {
  return fileNameParts(name).at(-1) ?? "";
}

function hasExecutableExtension(name: string) {
  return fileNameParts(name).some((part) => executableExtensions.has(part));
}

function startsWithBytes(buffer: Buffer, bytes: number[]) {
  return bytes.every((byte, index) => buffer[index] === byte);
}

function assertFileSignature(extension: string, buffer: Buffer) {
  if (extension === "pdf") {
    const headerIsValid = buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    const tail = buffer.subarray(Math.max(0, buffer.length - 16384)).toString("latin1");

    if (!headerIsValid || !tail.includes("%%EOF")) {
      throw new QuoteAttachmentValidationError(uploadFailedMessage);
    }
  }

  if (extension === "doc") {
    const oleHeader = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

    if (!startsWithBytes(buffer, oleHeader)) {
      throw new QuoteAttachmentValidationError(uploadFailedMessage);
    }
  }

  if (extension === "docx") {
    const isZipPackage =
      startsWithBytes(buffer, [0x50, 0x4b, 0x03, 0x04]) ||
      startsWithBytes(buffer, [0x50, 0x4b, 0x05, 0x06]) ||
      startsWithBytes(buffer, [0x50, 0x4b, 0x07, 0x08]);

    if (!isZipPackage) {
      throw new QuoteAttachmentValidationError(uploadFailedMessage);
    }
  }

  if (extension === "png") {
    const pngHeader = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

    if (!startsWithBytes(buffer, pngHeader)) {
      throw new QuoteAttachmentValidationError(uploadFailedMessage);
    }
  }
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const signaturePayload = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${signaturePayload}${apiSecret}`).digest("hex");
}

async function scanWithClamd(buffer: Buffer) {
  const host = process.env.CLAMAV_TCP_HOST?.trim();

  if (!host) {
    return false;
  }

  const port = Number(process.env.CLAMAV_TCP_PORT ?? 3310);

  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host, port });
    const chunks: Buffer[] = [];
    let settled = false;

    function finish(error?: Error) {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();

      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }

    socket.setTimeout(30000, () => finish(new Error("ClamAV scan timed out.")));
    socket.on("error", (error) => finish(error));
    socket.on("data", (chunk) => chunks.push(chunk));
    socket.on("end", () => {
      const response = Buffer.concat(chunks).toString("utf8");

      if (response.includes("FOUND")) {
        finish(new Error("ClamAV detected malware."));
        return;
      }

      if (response.includes("OK")) {
        finish();
        return;
      }

      finish(new Error("ClamAV returned an unexpected response."));
    });

    socket.on("connect", () => {
      socket.write("zINSTREAM\0");

      for (let offset = 0; offset < buffer.length; offset += 1024 * 1024) {
        const chunk = buffer.subarray(offset, offset + 1024 * 1024);
        const size = Buffer.alloc(4);
        size.writeUInt32BE(chunk.length, 0);
        socket.write(size);
        socket.write(chunk);
      }

      socket.write(Buffer.alloc(4));
    });
  });

  return true;
}

async function scanWithClamScan(buffer: Buffer, extension: string) {
  const scannerPath = process.env.CLAMSCAN_PATH?.trim() || "clamscan";
  const tempDir = await mkdtemp(join(tmpdir(), "iconic-upload-scan-"));
  const tempPath = join(tempDir, `scan-${randomUUID()}.${extension}`);

  try {
    await writeFile(tempPath, buffer, { flag: "wx" });
    await execFile(scannerPath, ["--no-summary", tempPath], {
      timeout: 30000,
      windowsHide: true,
    });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function scanForMalware(buffer: Buffer, extension: string) {
  try {
    const scannedByDaemon = await scanWithClamd(buffer);

    if (scannedByDaemon) {
      return;
    }

    await scanWithClamScan(buffer, extension);
  } catch (error) {
    console.error("Quote attachment malware scan failed", error);
    throw new QuoteAttachmentValidationError(malwareBlockedMessage);
  }
}

function validateAttachmentMetadata(file: File, kind: QuoteAttachmentKind) {
  const rule = uploadRules[kind];
  const extension = fileExtension(file.name);

  if (!extension || hasExecutableExtension(file.name) || !rule.extensions.has(extension)) {
    throw new QuoteAttachmentValidationError(uploadFailedMessage);
  }

  if (!file.type || !rule.mimeTypes.has(file.type)) {
    throw new QuoteAttachmentValidationError(uploadFailedMessage);
  }

  if (file.size > rule.maxSize) {
    throw new QuoteAttachmentValidationError(uploadFailedMessage);
  }

  return extension;
}

export async function uploadQuoteAttachment(file: File, kind: QuoteAttachmentKind): Promise<QuoteAttachment> {
  const extension = validateAttachmentMetadata(file, kind);
  const buffer = Buffer.from(await file.arrayBuffer());

  assertFileSignature(extension, buffer);
  await scanForMalware(buffer, extension);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary upload credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `iconic/quote-attachments/${kind}`;
  const publicId = `${kind}-${randomUUID()}`;
  const signature = signCloudinaryParams({ folder, public_id: publicId, timestamp }, apiSecret);
  const uploadData = new FormData();

  uploadData.append("file", file);
  uploadData.append("api_key", apiKey);
  uploadData.append("timestamp", timestamp);
  uploadData.append("folder", folder);
  uploadData.append("public_id", publicId);
  uploadData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed with status ${response.status}.`);
  }

  const result = (await response.json()) as { secure_url?: string };

  if (!result.secure_url) {
    throw new Error("Cloudinary did not return an attachment URL.");
  }

  return {
    kind,
    name: file.name,
    url: result.secure_url,
  };
}
