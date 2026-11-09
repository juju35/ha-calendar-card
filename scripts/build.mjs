// Builds src/calendar-card.js into the single HACS file dist/calendar-card.js, stamping the package version.
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";

const FILE = "calendar-card.js";
const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));

const out = readFileSync(`${root}src/${FILE}`, "utf8").replace("__VERSION__", pkg.version);

const target = `${root}dist/${FILE}`;
mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(target, out);
console.log(`Built dist/${FILE} (${(out.length / 1024).toFixed(1)} KB)`);

// Translations: English stays in the bundle, each other language goes to dist/calendar-card.i18n.<lang>.js,
// fetched when a card needs it (scripts/i18n-split.mjs).
if (process.argv[1] === fileURLToPath(import.meta.url)) splitDist(`${root}dist`, "calendar-card.js", { version: pkg.version });
