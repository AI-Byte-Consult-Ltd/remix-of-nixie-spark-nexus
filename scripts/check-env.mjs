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

if (!existsSync(".env")) {
  console.error(
    "\n[check-env] BLOCKED: .env is missing.\n" +
      "  .env is gitignored and does not survive a fresh checkout or a\n" +
      "  session/container restart. Building without it compiles an empty\n" +
      "  Supabase URL into the bundle -- the site loads to a blank white\n" +
      "  screen for every visitor, and `vite build` will not warn you.\n" +
      "  See .env.example for the required keys, and the runbook entries\n" +
      "  for the 26 Aug / 4 Sep incidents this exact gap caused.\n",
  );
  process.exit(1);
}

const env = readFileSync(".env", "utf8");
const missing = REQUIRED_VARS.filter((key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return !match || !match[1].trim();
});

if (missing.length > 0) {
  console.error(
    `\n[check-env] BLOCKED: .env exists but is missing values for: ${missing.join(", ")}.\n` +
      "  Same failure mode as a missing .env -- these compile in as empty\n" +
      "  strings, not undefined, so nothing else catches it either.\n",
  );
  process.exit(1);
}

console.log("[check-env] .env present with all required values, proceeding.");
