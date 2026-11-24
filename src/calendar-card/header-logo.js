// ── Header logo: a tear-off calendar page with today's date ─────────────────
import { ccEsc } from "./i18n-helpers.js";

export var ccLogo = (wd, day) => '<svg class="logo" viewBox="0 0 40 40" role="img" aria-hidden="true">' +
  '<rect x="2" y="3" width="36" height="35" rx="8" fill="var(--card-background-color, #fff)" stroke="var(--divider-color, rgba(0,0,0,.12))"/>' +
  '<path d="M10 3h20a8 8 0 0 1 8 8v3H2v-3a8 8 0 0 1 8-8Z" fill="var(--cc-accent)"/>' +
  `<text x="20" y="11.6" text-anchor="middle" font-size="7.2" font-weight="700" fill="var(--cc-accent-on)" letter-spacing=".4">${ccEsc(wd)}</text>` +
  `<text x="20" y="32" text-anchor="middle" font-size="17" font-weight="500" fill="var(--primary-text-color, #212121)">${ccEsc(day)}</text></svg>`;
