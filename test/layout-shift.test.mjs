// State updates patch the cards in place: an update of an entity the card does not use changes nothing in its shadow
// DOM, a new render (the minute tick, a fetch) keeps every node (no innerHTML rebuild, so nothing shows anew for a
// frame and the Sections view does not reflow, the page jumping by itself), and the card's height does not move.
// Needs the built card and Playwright's Chromium (CHROMIUM_PATH=… to use another); skipped without them.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const dist = new URL("../dist/calendar-card.js", import.meta.url);
let browser;
let why;
try {
  if (!existsSync(dist)) throw new Error("dist/calendar-card.js not built");
  const { chromium } = await import("playwright");
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
} catch (err) {
  why = err.message.split("\n")[0];
}
const skip = browser ? false : `no browser: ${why}`;
test.after(() => browser?.close());

const NOW = Date.parse("2026-10-26T09:40:00Z");
const at = (day, hm) => `2026-10-${day}T${hm}:00Z`;
const EVENTS = {
  "calendar.home": [
    { uid: "h0", summary: "Bin collection", start: { date: "2026-10-26" }, end: { date: "2026-10-27" } },
    { uid: "h1", summary: "Dentist", start: { dateTime: at(26, "11:30") }, end: { dateTime: at(26, "12:00") }, location: "12 High Street" },
    { uid: "h2", summary: "Swimming lesson", start: { dateTime: at(27, "17:30") }, end: { dateTime: at(27, "18:30") } },
  ],
};
const STATES = { "calendar.home": { entity_id: "calendar.home", state: "on", attributes: { friendly_name: "Home", supported_features: 7 } } };

const STAND_INS = `
customElements.define("ha-card", class extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block}</style><slot></slot>"; }
});
customElements.define("ha-icon", class extends HTMLElement {
  connectedCallback() {
    this.shadowRoot || this.attachShadow({ mode: "open" }).append(Object.assign(document.createElement("style"), { textContent: ":host{display:inline-flex;width:24px;height:24px}" }));
  }
});`;

const run = (page, next, n = 6) =>
  page.evaluate(
    async ({ next, n }) => {
      const make = new Function("hass", "i", next);
      const cards = [...document.querySelectorAll("#root > *")];
      const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
      const stats = cards.map(() => ({ removed: 0, mutations: 0, heights: new Set() }));
      const observers = cards.map((el, i) => {
        const o = new MutationObserver((recs) => {
          for (const r of recs) {
            stats[i].mutations++;
            if (r.type === "childList") stats[i].removed += r.removedNodes.length;
          }
        });
        o.observe(el.shadowRoot, { childList: true, subtree: true, attributes: true, characterData: true });
        return o;
      });
      let on = true;
      (async () => {
        while (on) {
          cards.forEach((el, i) => {
            stats[i].heights.add(Math.round(el.getBoundingClientRect().height));
          });
          await raf();
        }
      })();
      for (let k = 0; k < n; k++) {
        for (const el of cards) el.hass = make(el._hass, k);
        await raf();
        await raf();
      }
      on = false;
      for (const o of observers) o.disconnect();
      return stats.map((s, i) => ({ tag: cards[i].localName, removed: s.removed, mutations: s.mutations, heights: [...s.heights] }));
    },
    { next, n },
  );

test("state updates: nothing moves for another entity, a new render patches the card in place", { skip }, async () => {
  const page = await browser.newPage({ viewport: { width: 500, height: 1600 }, timezoneId: "UTC" });
  await page.clock.setFixedTime(NOW);
  await page.setContent('<!doctype html><body style="margin:0;width:400px"><div id="root" style="display:grid;gap:12px"></div></body>');
  await page.addScriptTag({ content: STAND_INS });
  await page.addScriptTag({ content: readFileSync(dist, "utf8") });
  await page.evaluate(
    ({ states, events }) => {
      for (const type of ["calendar-agenda-mini-card", "calendar-agenda-card"]) {
        const el = document.createElement(type);
        el.setConfig({ type: `custom:${type}`, entities: ["calendar.home"] });
        el.hass = {
          states, entities: {}, devices: {}, language: "en", themes: { darkMode: false }, locale: { language: "en", time_format: "24" },
          callService: async () => {}, callWS: async () => null,
          callApi: async (_m, path) => events[path.split("?")[0].replace("calendars/", "")] || [],
        };
        document.getElementById("root").appendChild(el);
      }
    },
    { states: STATES, events: EVENTS },
  );
  await page.waitForTimeout(400);
  const other = `return { ...hass, states: { ...hass.states, "sensor.elsewhere": { entity_id: "sensor.elsewhere", state: String(i), attributes: {} } } };`;
  for (const c of await run(page, other)) {
    assert.equal(c.mutations, 0, `${c.tag}: an update of another entity changes nothing`);
    assert.equal(c.heights.length, 1, `${c.tag}: its height holds`);
  }
  // A new render, as on the minute tick (the signature dropped).
  const tick = `for (const el of document.querySelectorAll("#root > *")) el._sig = null; return { ...hass };`;
  for (const c of await run(page, tick)) {
    assert.equal(c.removed, 0, `${c.tag}: no node is replaced`);
    assert.equal(c.heights.length, 1, `${c.tag}: its height holds (${c.heights})`);
  }
  await page.close();
});
