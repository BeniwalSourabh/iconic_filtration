import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";

const args = new Set(process.argv.slice(2));
const exampleMode = args.has("--example");
const firstDeployMode = args.has("--first-deploy");
const allowLocal = args.has("--allow-local");

const requiredKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const optionalKeys = [
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RATE_LIMIT_REDIS_URL",
  "RATE_LIMIT_REDIS_TOKEN",
  "ADMIN_BOOTSTRAP_EMAIL",
  "ADMIN_BOOTSTRAP_PASSWORD",
];

if (exampleMode) {
  validateExampleFile();
} else {
  loadEnvFiles();
  validateRuntimeEnv();
}

function validateExampleFile() {
  const path = resolve(".env.example");
  const errors = [];

  if (!existsSync(path)) {
    errors.push(".env.example is missing.");
  } else {
    const file = readFileSync(path, "utf8");
    const keys = new Set(
      file
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => line.split("=")[0]),
    );

    for (const key of [...requiredKeys, ...optionalKeys]) {
      if (!keys.has(key)) {
        errors.push(`.env.example is missing ${key}.`);
      }
    }
  }

  finish(errors, [], ".env.example");
}

function loadEnvFiles() {
  for (const file of [".env.production.local", ".env.production", ".env.local", ".env"]) {
    if (existsSync(resolve(file))) {
      loadDotenv({ path: file, override: false });
    }
  }
}

function validateRuntimeEnv() {
  const errors = [];
  const warnings = [];

  for (const key of requiredKeys) {
    if (!getEnv(key)) {
      errors.push(`${key} is required.`);
    }
  }

  if (!getEnv("NEXTAUTH_SECRET") && !getEnv("AUTH_SECRET")) {
    errors.push("NEXTAUTH_SECRET or AUTH_SECRET is required.");
  }

  validateUrl("NEXT_PUBLIC_SITE_URL", { requireHttps: !allowLocal }, errors);
  validateUrl("NEXTAUTH_URL", { requireHttps: !allowLocal }, errors);
  validateDatabaseUrl(errors, warnings);
  validateAuthSecrets(errors, warnings);
  validateOAuthPair(errors);
  validateRedisPair(warnings);
  validateBootstrap(errors, warnings);
  validateUrlMatch(warnings);

  finish(errors, warnings, "production environment");
}

function validateUrl(key, options, errors) {
  const value = getEnv(key);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);

    if (options.requireHttps && url.protocol !== "https:") {
      errors.push(`${key} must use https:// in production.`);
    }
  } catch {
    errors.push(`${key} must be a valid URL.`);
  }
}

function validateDatabaseUrl(errors, warnings) {
  const value = getEnv("DATABASE_URL");

  if (!value) {
    return;
  }

  if (!value.startsWith("postgresql://") && !value.startsWith("postgres://")) {
    errors.push("DATABASE_URL must be a PostgreSQL connection string.");
  }

  if (!allowLocal && /localhost|127\.0\.0\.1/i.test(value)) {
    warnings.push("DATABASE_URL appears to point at localhost. Confirm this is not production.");
  }
}

function validateAuthSecrets(errors, warnings) {
  const nextAuthSecret = getEnv("NEXTAUTH_SECRET");
  const authSecret = getEnv("AUTH_SECRET");
  const activeSecret = nextAuthSecret || authSecret;

  if (activeSecret && activeSecret.length < 32) {
    errors.push("NEXTAUTH_SECRET or AUTH_SECRET must be at least 32 characters.");
  }

  if (nextAuthSecret && authSecret && nextAuthSecret !== authSecret) {
    warnings.push("NEXTAUTH_SECRET and AUTH_SECRET differ. The app uses NEXTAUTH_SECRET first.");
  }
}

function validateOAuthPair(errors) {
  const clientId = getEnv("GOOGLE_CLIENT_ID");
  const clientSecret = getEnv("GOOGLE_CLIENT_SECRET");

  if ((clientId && !clientSecret) || (!clientId && clientSecret)) {
    errors.push("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together.");
  }
}

function validateRedisPair(warnings) {
  const redisUrl = getEnv("RATE_LIMIT_REDIS_URL");
  const redisToken = getEnv("RATE_LIMIT_REDIS_TOKEN");

  if ((redisUrl && !redisToken) || (!redisUrl && redisToken)) {
    warnings.push("RATE_LIMIT_REDIS_URL and RATE_LIMIT_REDIS_TOKEN should be configured together.");
  }
}

function validateBootstrap(errors, warnings) {
  const email = getEnv("ADMIN_BOOTSTRAP_EMAIL");
  const password = getEnv("ADMIN_BOOTSTRAP_PASSWORD");

  if (firstDeployMode && !email) {
    errors.push("ADMIN_BOOTSTRAP_EMAIL is required for --first-deploy.");
  }

  if (firstDeployMode && !password) {
    errors.push("ADMIN_BOOTSTRAP_PASSWORD is required for --first-deploy.");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("ADMIN_BOOTSTRAP_EMAIL must be a valid email address.");
  }

  if (password && password.length < 12) {
    errors.push("ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters.");
  }

  if (!firstDeployMode && password) {
    warnings.push("ADMIN_BOOTSTRAP_PASSWORD is set. Remove or rotate it after first admin setup.");
  }
}

function validateUrlMatch(warnings) {
  const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL");
  const authUrl = getEnv("NEXTAUTH_URL");

  if (!siteUrl || !authUrl) {
    return;
  }

  try {
    const site = new URL(siteUrl);
    const auth = new URL(authUrl);

    if (site.origin !== auth.origin) {
      warnings.push("NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL use different origins.");
    }
  } catch {
    // URL-specific validation reports this.
  }
}

function getEnv(key) {
  return process.env[key]?.trim();
}

function finish(errors, warnings, label) {
  for (const warning of warnings) {
    console.warn(`WARN ${warning}`);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`FAIL ${error}`);
    }

    console.error(`\n${label} validation failed.`);
    process.exit(1);
  }

  console.log(`${label} validation passed.`);
}
