import { randomBytes } from "node:crypto";

const bytes = Number.parseInt(process.argv[2] ?? "48", 10);

if (!Number.isInteger(bytes) || bytes < 32) {
  console.error("Secret length must be at least 32 bytes.");
  process.exit(1);
}

console.log(randomBytes(bytes).toString("base64url"));
