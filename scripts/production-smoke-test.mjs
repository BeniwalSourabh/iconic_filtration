const baseUrl = normalizeBaseUrl(
  process.argv[2] || process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000",
);

const checks = [
  {
    name: "Homepage",
    path: "/",
    expectedStatus: 200,
    requireCsp: true,
  },
  {
    name: "Admin login",
    path: "/admin/login",
    expectedStatus: 200,
    requireCsp: true,
  },
  {
    name: "Protected admin redirect",
    path: "/admin/products",
    expectedStatus: 307,
    requireCsp: true,
    expectedLocationIncludes: "/admin/login",
  },
  {
    name: "Sitemap",
    path: "/sitemap.xml",
    expectedStatus: 200,
    requireCsp: true,
    expectedBodyIncludes: "<urlset",
  },
  {
    name: "Robots",
    path: "/robots.txt",
    expectedStatus: 200,
    requireCsp: true,
    expectedBodyIncludes: "Sitemap:",
  },
];

const results = [];

for (const check of checks) {
  results.push(await runCheck(check));
}

const failed = results.filter((result) => !result.ok);

for (const result of results) {
  const marker = result.ok ? "PASS" : "FAIL";
  console.log(`${marker} ${result.name} ${result.status} ${result.url}`);

  for (const detail of result.details) {
    console.log(`  - ${detail}`);
  }
}

if (failed.length > 0) {
  console.error(`\n${failed.length} production smoke check(s) failed for ${baseUrl}`);
  process.exit(1);
}

console.log(`\nAll production smoke checks passed for ${baseUrl}`);

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

async function runCheck(check) {
  const url = `${baseUrl}${check.path}`;
  const details = [];

  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: {
        "user-agent": "iconic-filtration-production-smoke-test",
      },
    });

    const body = await response.text();
    const csp = response.headers.get("content-security-policy");
    const location = response.headers.get("location");
    let ok = true;

    if (response.status !== check.expectedStatus) {
      ok = false;
      details.push(`Expected status ${check.expectedStatus}, received ${response.status}.`);
    }

    if (check.requireCsp && !csp) {
      ok = false;
      details.push("Missing Content-Security-Policy header.");
    }

    if (
      check.expectedLocationIncludes &&
      (!location || !location.includes(check.expectedLocationIncludes))
    ) {
      ok = false;
      details.push(
        `Expected redirect location to include ${check.expectedLocationIncludes}, received ${location || "none"}.`,
      );
    }

    if (check.expectedBodyIncludes && !body.includes(check.expectedBodyIncludes)) {
      ok = false;
      details.push(`Expected body to include ${check.expectedBodyIncludes}.`);
    }

    if (location) {
      details.push(`Location: ${location}`);
    }

    return {
      ok,
      name: check.name,
      status: response.status,
      url,
      details,
    };
  } catch (error) {
    return {
      ok: false,
      name: check.name,
      status: "ERR",
      url,
      details: [error instanceof Error ? error.message : String(error)],
    };
  }
}
