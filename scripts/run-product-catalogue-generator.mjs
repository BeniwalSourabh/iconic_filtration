import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const userProfile = process.env.USERPROFILE || process.env.HOME || "";

const candidates = [
  process.env.PYTHON,
  userProfile
    ? join(
        userProfile,
        ".cache",
        "codex-runtimes",
        "codex-primary-runtime",
        "dependencies",
        "python",
        process.platform === "win32" ? "python.exe" : "bin/python",
      )
    : undefined,
  process.platform === "win32" ? "py" : "python3",
  "python",
].filter(Boolean);

const python = candidates.find((candidate) => {
  if (!candidate) {
    return false;
  }

  return candidate.includes("\\") || candidate.includes("/") ? existsSync(candidate) : true;
});

if (!python) {
  console.error("Python runtime was not found. Install Python or set PYTHON to a valid executable path.");
  process.exit(1);
}

const result = spawnSync(python, [join(root, "scripts", "generate-product-catalogue.py")], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
