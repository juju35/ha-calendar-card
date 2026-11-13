// Renders the card with mock calendars and saves the README screenshots and GIFs.
// Usage: npm run build && npm run screenshots  (CHROMIUM_PATH=/path/to/chrome to use an installed browser; needs ffmpeg)
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
// Fixed clock and time zone: countdowns and dates in the captures do not depend on when they are taken.
const NOW = Date.parse("2026-10-26T09:40:00Z");
const cardJs = readFileSync(`${root}dist/calendar-card.js`, "utf8");

// Captures are rendered into a scratch folder and only replace the committed file when their decoded pixels
// (every frame of a GIF) differ: an encoder or metadata change alone never rewrites a screenshot.
const scratch = mkdtempSync(join(tmpdir(), "cc-shots-"));
const pixels = (file) => execFileSync("ffmpeg", ["-loglevel", "error", "-i", file, "-f", "rawvideo", "-pix_fmt", "rgba", "-"], { maxBuffer: 1 << 30 });
function keep(fresh, name) {
  const target = `${root}screenshots/${name}`;
  if (existsSync(target) && pixels(fresh).equals(pixels(target))) {
    console.log(`screenshots/${name} (unchanged)`);
    return;
  }
  copyFileSync(fresh, target);
  console.log(`screenshots/${name}`);
}

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
  "check": "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
  "check-all": "M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z",
  "chevron-down": "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  "chevron-right": "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
  "chevron-left": "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",
  "clock-outline": "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  "delete-outline": "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",
  "delete-sweep-outline": "M15,16H19V18H15V16M15,8H22V10H15V8M15,12H21V14H15V12M11,10V18H5V10H11M13,8H3V18A2,2 0 0,0 5,20H11A2,2 0 0,0 13,18V8M14,5H11L10,4H6L5,5H2V7H14V5Z",
  "close": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  "map-marker-outline": "M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z",
  "pencil-outline": "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z",
  "plus": "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  "beach": "M15,18.54C17.13,18.21 19.5,18 22,18V22H5C5,21.35 8.2,19.86 13,18.9V12.4C12.16,12.65 11.45,13.21 11,13.95C10.39,12.93 9.27,12.25 8,12.25C6.73,12.25 5.61,12.93 5,13.95C5.03,10.37 8.5,7.43 13,7.04V7A1,1 0 0,1 14,6A1,1 0 0,1 15,7V7.04C19.5,7.43 22.96,10.37 23,13.95C22.39,12.93 21.27,12.25 20,12.25C18.73,12.25 17.61,12.93 17,13.95C16.55,13.21 15.84,12.65 15,12.39V18.54M7,2A5,5 0 0,1 2,7V2H7Z",
  "briefcase-outline": "M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M14,6V4H10V6H14Z",
  "checkbox-blank-circle-outline": "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  "format-list-checks": "M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z",
  "school-outline": "M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3M18.82 9L12 12.72L5.18 9L12 5.28L18.82 9M17 16L12 18.72L7 16V12.27L12 15L17 12.27V16Z",
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
// Each event has a uid, like the events of a Local Calendar: the details popup offers edit and delete.
for (const [id, list] of Object.entries(EVENTS)) list.forEach((e, i) => { e.uid = `${id}-${i}`; });

const states = {
  // Home and Work accept new, changed and deleted events (CREATE_EVENT | DELETE_EVENT | UPDATE_EVENT),
  // like a Local Calendar or CalDAV: the + button and the edit and delete buttons show.
  "calendar.home": { entity_id: "calendar.home", state: "on", attributes: { friendly_name: "Home", supported_features: 7 }, last_changed: "x" },
  "calendar.work": { entity_id: "calendar.work", state: "on", attributes: { friendly_name: "Work", supported_features: 7 }, last_changed: "x" },
  "calendar.holidays": { entity_id: "calendar.holidays", state: "off", attributes: { friendly_name: "Public holidays" }, last_changed: "x" },
};
// To-do lists (a Bring! shopping list), the Workday sensor and a school holidays calendar (Remote Calendar), for
// the captures of `todo_entities`, the working day badge and `school_holidays_calendar`; the other captures
// leave them out.
EVENTS["calendar.school_holidays"] = [{ uid: "sh-0", summary: "Autumn holidays", start: { date: "2026-10-17" }, end: { date: "2026-11-02" } }];
const TODO_ITEMS = {
  "todo.shopping": [
    { uid: "t1", summary: "Milk", status: "needs_action" },
    { uid: "t2", summary: "Bread", status: "needs_action", description: "Wholemeal" },
    { uid: "t3", summary: "Tomatoes", status: "needs_action" },
    { uid: "t4", summary: "Coffee", status: "completed" },
  ],
  "todo.chores": [
    { uid: "c1", summary: "Water the plants", status: "needs_action", due: "2026-10-25" },
    { uid: "c2", summary: "Take the parcel to the post office", status: "needs_action", due: "2026-10-27" },
  ],
};
const EXTRA_STATES = {
  "todo.shopping": { entity_id: "todo.shopping", state: "3", attributes: { friendly_name: "Shopping list" }, last_updated: "x" },
  "todo.chores": { entity_id: "todo.chores", state: "2", attributes: { friendly_name: "Chores" }, last_updated: "x" },
  "binary_sensor.workday_sensor": { entity_id: "binary_sensor.workday_sensor", state: "on", attributes: { friendly_name: "Workday Sensor" }, last_updated: "x" },
  "calendar.school_holidays": { entity_id: "calendar.school_holidays", state: "on", attributes: { friendly_name: "School holidays" }, last_changed: "x" },
};
const EXTRA_ENTITIES = {
  "todo.shopping": { entity_id: "todo.shopping", platform: "bring" },
  "todo.chores": { entity_id: "todo.chores", platform: "local_todo" },
  "binary_sensor.workday_sensor": { entity_id: "binary_sensor.workday_sensor", platform: "workday" },
};
const EXTRAS = { todo_entities: ["todo.shopping", "todo.chores"], school_holidays_calendar: "calendar.school_holidays" };

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
  // The new event form, a title typed in.
  ...["light", "dark"].map((theme) => ({
    file: theme === "dark" ? "agenda-add-dark" : "agenda-add", type: "calendar-agenda-card", theme, width: 460, config: {},
    after: async (page) => {
      await page.locator("calendar-agenda-card .addb").click();
      await page.locator("calendar-agenda-card input[data-f=summary]").fill("Dentist");
      await page.locator("calendar-agenda-card input[data-f=location]").fill("12 High Street");
      await page.mouse.move(0, 0);
    },
  })),
  // The edit form of an event, opened from its details.
  ...["light", "dark"].map((theme) => ({
    file: theme === "dark" ? "agenda-edit-dark" : "agenda-edit", type: "calendar-agenda-card", theme, width: 460, config: {},
    after: async (page) => {
      await page.locator("calendar-agenda-card .ev", { hasText: "Project review" }).click();
      await page.locator("calendar-agenda-card .pclose[data-action=edit]").click();
      await page.mouse.move(0, 0);
    },
  })),
  // The delete confirmation in the details popup.
  ...["light", "dark"].map((theme) => ({
    file: theme === "dark" ? "agenda-delete-dark" : "agenda-delete", type: "calendar-agenda-card", theme, width: 460, config: {},
    after: async (page) => {
      await page.locator("calendar-agenda-card .ev", { hasText: "Project review" }).click();
      await page.locator("calendar-agenda-card .pclose[data-action=delete]").click();
      await page.mouse.move(0, 0);
    },
  })),
  { file: "week", type: "calendar-agenda-card", theme: "light", width: 760, config: { view: "week" } },
  { file: "week-dark", type: "calendar-agenda-card", theme: "dark", width: 760, config: { view: "week" } },
  // To-do lists, the working day badge and the school holidays, in the agenda and the week.
  ...["light", "dark"].flatMap((theme) => [
    { file: theme === "dark" ? "agenda-extras-dark" : "agenda-extras", type: "calendar-agenda-card", theme, width: 460, extras: true, config: { ...EXTRAS, days_to_show: 3 } },
    { file: theme === "dark" ? "week-extras-dark" : "week-extras", type: "calendar-agenda-card", theme, width: 760, extras: true, config: { ...EXTRAS, view: "week" } },
  ]),
  { file: "mini", type: "calendar-agenda-mini-card", theme: "light", width: 380, config: {} },
  // Folded mini card with to-do lists: a line per list with its number of open items.
  ...["light", "dark"].map((theme) => ({ file: theme === "dark" ? "mini-todos-dark" : "mini-todos", type: "calendar-agenda-mini-card", theme, width: 380, extras: true, config: { ...EXTRAS } })),
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
  // Each animation also gets its dark twin (<file>-dark.gif), with the exact same setup.
].flatMap((g) => [g, { ...g, file: `${g.file}-dark`, theme: "dark" }]);

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
    ({ type, config, states, events, entities, registry, todos }) => {
      const el = document.createElement(type);
      el.setConfig({ type: `custom:${type}`, entities, ...config });
      el.hass = {
        states, entities: registry, devices: {}, language: "en", locale: { language: "en", time_format: "24" },
        callService: async () => {},
        callApi: async (_method, path) => events[path.split("?")[0].replace("calendars/", "")] || [],
        callWS: async (msg) => (msg.type === "todo/item/list" ? { items: todos[msg.entity_id] || [] } : null),
      };
      document.getElementById("root").appendChild(el);
    },
    {
      type: s.type, config: s.config, events: EVENTS, entities, todos: TODO_ITEMS,
      states: s.extras ? { ...states, ...EXTRA_STATES } : states, registry: s.extras ? EXTRA_ENTITIES : {},
    }
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
    path: join(scratch, `${s.file}.png`),
    clip: { x: 0, y: 0, width: s.width + 32, height: Math.ceil(box.height) + 32 },
    animations: "disabled",
  });
  keep(join(scratch, `${s.file}.png`), `${s.file}.png`);
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
  const out = join(scratch, `${s.file}.gif`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(dir, "f%03d.png"),
    "-vf", `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop", "0", out,
  ]);
  rmSync(dir, { recursive: true });
  keep(out, `${s.file}.gif`);
}

await browser.close();
rmSync(scratch, { recursive: true });
