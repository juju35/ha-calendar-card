// Renders the card with mock calendars and saves the README screenshots and GIFs.
// Usage: npm run build && npm run screenshots  (CHROMIUM_PATH=/path/to/chrome to use an installed browser; GIFs need ffmpeg)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
// Fixed clock and time zone: countdowns and dates in the captures do not depend on when they are taken.
const NOW = Date.parse("2026-10-26T09:40:00Z");
const cardJs = readFileSync(`${root}dist/calendar-card.js`, "utf8");

const THEMES = {
  light: {
    "--primary-background-color": "#e8eaed",
    "--secondary-background-color": "#ececec",
    "--card-background-color": "#ffffff",
    "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272",
    "--divider-color": "rgba(0,0,0,.12)",
  },
  dark: {
    "--primary-background-color": "#111111",
    "--secondary-background-color": "#282828",
    "--card-background-color": "#1c1c1c",
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--divider-color": "rgba(225,225,225,.12)",
  },
};
const COMMON = {
  "--primary-color": "#03a9f4",
  "--error-color": "#db4437",
  "--text-primary-color": "#ffffff",
};

// Minimal stand-ins for Home Assistant's <ha-card> and <ha-icon> (Material Design Icons paths below).
const haElements = (icons) => `
const ICONS = ${JSON.stringify(icons)};
customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});
customElements.define("ha-icon", class extends HTMLElement {
  static get observedAttributes() { return ["icon"]; }
  connectedCallback() { this._draw(); }
  attributeChangedCallback() { this._draw(); }
  _draw() {
    const path = ICONS[(this.getAttribute("icon") || "").replace("mdi:", "")] || "";
    this.style.display = "inline-flex";
    this.innerHTML = '<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor"><path d="' + path + '"/></svg>';
  }
});`;

const pageHtml = (theme, width) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root { ${Object.entries({ ...THEMES[theme], ...COMMON }).map(([k, v]) => `${k}:${v};`).join("")} }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: ${width}px; }
</style></head><body><div id="root"></div></body></html>`;

const icons = {
  "alert-circle-outline": "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  "arrow-collapse": "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
  "arrow-expand": "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  "chevron-down": "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  "chevron-right": "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
  "clock-outline": "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  "close": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  "map-marker-outline": "M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z",
};

// Mock calendars, neutral data. Times are UTC, like the page's time zone.
const at = (day, hm) => `2026-10-${day}T${hm}:00Z`;
const EVENTS = {
  "calendar.home": [
    { summary: "Bin collection", start: { date: "2026-10-26" }, end: { date: "2026-10-27" } },
    { summary: "Dentist", start: { dateTime: at(26, "11:30") }, end: { dateTime: at(26, "12:00") }, location: "12 High Street" },
    { summary: "Swimming lesson", start: { dateTime: at(27, "17:30") }, end: { dateTime: at(27, "18:30") }, location: "Municipal pool" },
    { summary: "Dinner with friends", start: { dateTime: at(28, "19:30") }, end: { dateTime: at(28, "23:00") } },
    { summary: "Boiler service", start: { dateTime: at(30, "08:00") }, end: { dateTime: at(30, "10:00") },
      description: "Technician visit.\nLeave the access to the boiler room clear." },
  ],
  "calendar.work": [
    { summary: "Team stand-up", start: { dateTime: at(26, "09:30") }, end: { dateTime: at(26, "10:00") }, location: "Room 2" },
    { summary: "Project review", start: { dateTime: at(26, "14:00") }, end: { dateTime: at(26, "15:30") }, location: "Video call",
      description: "Sprint demo, then the roadmap for next quarter." },
    { summary: "Training", start: { date: "2026-10-28" }, end: { date: "2026-10-30" }, location: "Paris" },
  ],
  "calendar.holidays": [
    { summary: "Autumn school holidays", start: { date: "2026-10-17" }, end: { date: "2026-11-02" } },
    { summary: "All Saints' Day", start: { date: "2026-11-01" }, end: { date: "2026-11-02" } },
  ],
};

const states = {
  "calendar.home": { entity_id: "calendar.home", state: "on", attributes: { friendly_name: "Home" }, last_changed: "x" },
  "calendar.work": { entity_id: "calendar.work", state: "on", attributes: { friendly_name: "Work" }, last_changed: "x" },
  "calendar.holidays": { entity_id: "calendar.holidays", state: "off", attributes: { friendly_name: "Public holidays" }, last_changed: "x" },
};
const entities = ["calendar.home", { entity: "calendar.work", color: "#33b679" }, { entity: "calendar.holidays", color: "#8e24aa" }];

const shots = [
  { file: "agenda", type: "calendar-agenda-card", theme: "light", width: 460, config: { max_events: 0 } },
  { file: "agenda-dark", type: "calendar-agenda-card", theme: "dark", width: 460, config: { max_events: 0 } },
  { file: "agenda-more", type: "calendar-agenda-card", theme: "light", width: 460, config: {} },
  { file: "agenda-more-dark", type: "calendar-agenda-card", theme: "dark", width: 460, config: {} },
  {
    file: "agenda-details", type: "calendar-agenda-card", theme: "light", width: 460, config: {},
    after: (page) => page.locator("calendar-agenda-card .ev", { hasText: "Project review" }).click(),
  },
  {
    file: "agenda-details-dark", type: "calendar-agenda-card", theme: "dark", width: 460, config: {},
    after: (page) => page.locator("calendar-agenda-card .ev", { hasText: "Project review" }).click(),
  },
  { file: "mini", type: "calendar-agenda-mini-card", theme: "light", width: 380, config: {} },
  { file: "mini-dark", type: "calendar-agenda-mini-card", theme: "dark", width: 380, config: {} },
  {
    file: "mini-zoom", type: "calendar-agenda-mini-card", theme: "light", width: 460, config: { days_to_show: 4 },
    after: async (page) => {
      await page.locator("calendar-agenda-mini-card .zoom").click();
      await page.mouse.move(0, 0);
    },
  },
  {
    file: "mini-zoom-dark", type: "calendar-agenda-mini-card", theme: "dark", width: 460, config: { days_to_show: 4 },
    after: async (page) => {
      await page.locator("calendar-agenda-mini-card .zoom").click();
      await page.mouse.move(0, 0);
    },
  },
];

// The GIFs of the card's interactions: each step clicks an element of the card (found by selector and,
// optionally, by its text) and holds a number of frames; `anim` steps the triggered CSS animation frame
// by frame (slowed down ~2x), so the GIF is identical whatever the machine's speed. FPS below.
const gifs = [
  {
    file: "agenda-popup", type: "calendar-agenda-card", theme: "light", width: 460, config: {},
    steps: [
      { hold: 8 },
      { click: { sel: ".ev", text: "Project review" }, anim: 160, frames: 8 },
      { hold: 26 },
      { click: { sel: ".pclose" } },
      { hold: 8 },
    ],
  },
  {
    file: "agenda-more", type: "calendar-agenda-card", theme: "light", width: 460, config: {},
    steps: [
      { hold: 8 },
      { click: { sel: ".more" } },
      { hold: 26 },
      { click: { sel: ".more" } },
      { hold: 8 },
    ],
  },
  {
    file: "mini-zoom", type: "calendar-agenda-mini-card", theme: "light", width: 460, config: { days_to_show: 4 },
    steps: [
      { hold: 8 },
      { click: { sel: ".zoom" } },
      { hold: 26 },
      { click: { sel: ".zoom" } },
      { hold: 8 },
    ],
  },
];

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

// A fresh page per shot: re-running the scripts in the same realm would redeclare their globals.
async function openCard(s) {
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1000, height: 2000 }, timezoneId: "UTC" });
  await page.clock.setFixedTime(NOW);
  page.on("pageerror", (err) => console.error(`${s.file}: ${err.message}`));
  await page.setContent(pageHtml(s.theme, s.width));
  await page.addScriptTag({ content: haElements(icons) });
  await page.addScriptTag({ content: cardJs });
  await page.evaluate(
    ({ type, config, states, events, entities }) => {
      const el = document.createElement(type);
      el.setConfig({ type: `custom:${type}`, entities, ...config });
      el.hass = {
        states, entities: {}, devices: {}, language: "en", locale: { language: "en", time_format: "24" },
        callService: async () => {},
        callApi: async (_method, path) => events[path.split("?")[0].replace("calendars/", "")] || [],
      };
      document.getElementById("root").appendChild(el);
    },
    { type: s.type, config: s.config, states, events: EVENTS, entities }
  );
  await page.waitForTimeout(300);
  return page;
}

// Clicks the step's element inside the card's shadow root and pauses the animations it starts, all in
// one synchronous script, so a short animation cannot finish before it is stepped.
const doClick = (page, s, step) => page.evaluate(({ type, click }) => {
  const sr = document.querySelector(type).shadowRoot;
  const el = [...sr.querySelectorAll(click.sel)].find((n) => !click.text || n.textContent.includes(click.text));
  el.click();
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; }
}, { type: s.type, click: step.click });

for (const s of shots) {
  const page = await openCard(s);
  if (s.after) await s.after(page);
  await page.waitForTimeout(400);
  // The card on the theme background, with the body's 16px padding around it.
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({
    path: `${root}screenshots/${s.file}.png`,
    clip: { x: 0, y: 0, width: s.width + 32, height: Math.ceil(box.height) + 32 },
    animations: "disabled",
  });
  console.log(`screenshots/${s.file}.png`);
  await page.close();
}

const FPS = 20;
for (const s of gifs) {
  // First pass: play the steps without capturing, to measure the tallest state the clip must hold.
  let page = await openCard(s);
  let maxH = 0;
  const measure = async () => { maxH = Math.max(maxH, (await page.locator("#root").boundingBox()).height); };
  await measure();
  for (const step of s.steps) {
    if (!step.click) continue;
    await doClick(page, s, step);
    await page.waitForTimeout(100);
    await measure();
  }
  await page.close();

  // Second pass: capture the frames.
  page = await openCard(s);
  const clip = { x: 0, y: 0, width: s.width + 32, height: Math.ceil(maxH) + 32 };
  const dir = mkdtempSync(join(tmpdir(), "cc-frames-"));
  let n = 0;
  const snap = () => page.screenshot({ path: join(dir, `f${String(n++).padStart(3, "0")}.png`), clip });
  for (const step of s.steps) {
    if (step.click) {
      await doClick(page, s, step);
      // Step the triggered animation at half speed; without one, the change is instant.
      const frames = step.anim ? step.frames : 1;
      for (let i = 1; i <= frames; i++) {
        if (step.anim) {
          await page.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, (step.anim * i) / frames);
        }
        await snap();
      }
    } else {
      for (let i = 0; i < step.hold; i++) await snap();
    }
  }
  await page.close();
  const out = `${root}screenshots/${s.file}.gif`;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(dir, "f%03d.png"),
    "-vf", `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop", "0", out,
  ]);
  rmSync(dir, { recursive: true });
  console.log(`screenshots/${s.file}.gif`);
}

await browser.close();
