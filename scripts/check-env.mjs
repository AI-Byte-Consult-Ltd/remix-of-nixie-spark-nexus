// Guards against the exact failure that has now broken production twice
// (26 Aug, 4 Sep): a build running without .env compiles VITE_SUPABASE_URL
// as undefined into the bundle, createClient() throws at module load, and
// every visitor gets a blank white screen -- silently, because `vite build`
// itself succeeds either way. Runs as `prebuild` so it's impossible to
// reach `vite build` without it (npm always runs pre<script> first).
import { existsSync, readFileSync } from "node:fs";

const REQUIRED_VARS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PROJECT_ID",
];

// .env.production is committed with the public values, so a fresh checkout
// builds correctly; a local .env (gitignored) overrides it, like Vite does.
const ENV_FILES = [".env.production", ".env"].filter((f) => existsSync(f));

if (ENV_FILES.length === 0) {
  console.error(
    "\n[check-env] BLOCKED: neither .env.production nor .env exists.\n" +
      "  Building without them compiles an empty Supabase URL into the\n" +
      "  bundle -- the site loads to a blank white screen for every visitor,\n" +
      "  and `vite build` will not warn you. See .env.example for the keys.\n",
  );
  process.exit(1);
}

const values = {};
for (const file of ENV_FILES) {
  const env = readFileSync(file, "utf8");
  for (const key of REQUIRED_VARS) {
    const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (match && match[1].trim()) values[key] = match[1].trim();
  }
}
const missing = REQUIRED_VARS.filter((key) => !values[key]);

if (missing.length > 0) {
  console.error(
    `\n[check-env] BLOCKED: no value for: ${missing.join(", ")} in ${ENV_FILES.join(", ")}.\n` +
      "  Same failure mode as a missing .env -- these compile in as empty\n" +
      "  strings, not undefined, so nothing else catches it either.\n",
  );
  process.exit(1);
}

console.log(`[check-env] required values found in ${ENV_FILES.join(", ")}, proceeding.`);
