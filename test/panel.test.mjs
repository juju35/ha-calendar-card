// The optional sidebar panel: its views, its range, the calendar toggles, the repeat rule of its form.
import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { CalendarPanel, ccRule, ccDayStart, customElements } = loadCard(["calendar-card.js", "calendar-panel.js"], ["CalendarPanel", "ccRule", "ccDayStart"]);
const plain = (v) => JSON.parse(JSON.stringify(v));

const today = ccDayStart(new Date());
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const at = (days, h) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, h).toISOString();

function mockHass(events, calls = []) {
  return {
    language: "en",
    locale: { time_format: "24", first_weekday: "monday" },
    states: {
      "calendar.work": { state: "off", attributes: { friendly_name: "Work", supported_features: 7 }, last_changed: "1" },
      "calendar.home": { state: "off", attributes: { friendly_name: "Home", supported_features: 7 }, last_changed: "1" },
      "light.kitchen": { state: "on", attributes: {} },
    },
    callApi: async (_method, path) => {
      calls.push(path);
      return events[path.split("?")[0].replace("calendars/", "")] || [];
    },
    callService: async (...a) => calls.push(["service", ...a]),
    callWS: async (msg) => calls.push(msg),
  };
}

const EVENTS = {
  "calendar.home": [{ uid: "h1", summary: "Dentist", start: { dateTime: at(0, 23) }, end: { dateTime: at(0, 23) } }],
  "calendar.work": [{ uid: "w1", summary: "Trip", start: { date: iso(today) }, end: { date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)) } }],
};

async function open(view = "month", config = {}, calls = []) {
  const p = new CalendarPanel();
  p.route = { prefix: "/calendar", path: `/${view}` };
  p.panel = { config };
  p.hass = mockHass(EVENTS, calls);
  await new Promise((r) => setTimeout(r, 0));
  return p;
}
const html = (p) => p.shadowRoot.innerHTML;
const click = (p, dataset, extra = []) => p._onClick({ composedPath: () => [{ dataset }, ...extra], detail: 1 });

test("the panel is defined by the same bundle, not offered as a card", () => {
  assert.ok(customElements.get("calendar-agenda-panel"));
});

test("every calendar by name by default, the four tabs, the banner and the toggles", async () => {
  const p = await open();
  assert.deepEqual(plain(p._config.entities), ["calendar.home", "calendar.work"]);
  const out = html(p);
  for (const v of ["month", "week", "day", "list"]) assert.match(out, new RegExp(`data-view="${v}"`));
  assert.match(out, /data-view="month" aria-selected="true"/);
  assert.match(out, /class="header banner/);
  assert.match(out, /<ha-menu-button><\/ha-menu-button><div class="logo"/);
  assert.match(out, /data-action="refresh"/);
  assert.match(out, /class="hbtn addb" data-action="add"/);
  assert.equal((out.match(/class="calb"/g) || []).length, 2);
  assert.match(out, /class="mcell[^"]* today/);
});

test("the month range starts on the first weekday and holds whole weeks", async () => {
  const p = await open();
  const r = p._range();
  assert.equal(r.from.getDay(), 1);
  assert.equal(r.days % 7, 0);
  assert.ok(r.from <= new Date(today.getFullYear(), today.getMonth(), 1));
});

test("a multi-day event shows on each of its days, and a click opens its details", async () => {
  const p = await open("week");
  const out = html(p);
  assert.ok((out.match(/Trip/g) || []).length >= 3);
  const idx = p._flat.findIndex((x) => x.e.summary === "Dentist");
  click(p, { ev: String(idx) });
  assert.match(html(p), /class="backdrop"><div class="pop"/);
  assert.match(html(p), /data-action="edit"/);
});

test("tabs, arrows and Today move the range; the view goes to the address", async () => {
  const p = await open("day");
  const first = p._range().from;
  click(p, { action: "nav-next" });
  assert.equal(iso(p._range().from), iso(new Date(first.getFullYear(), first.getMonth(), first.getDate() + 1)));
  click(p, { action: "nav-today" });
  assert.equal(+p._range().from, +first);
  click(p, { action: "view", view: "list" });
  assert.equal(p._view, "list");
  assert.match(html(p), /data-view="list" aria-selected="true"/);
  click(p, { action: "goto-day", day: iso(today) });
  assert.equal(p._view, "day");
});

test("a hidden calendar leaves the page and the header count", async () => {
  const p = await open("list");
  assert.match(html(p), /Dentist/);
  click(p, { action: "cal", entity: "calendar.home" });
  assert.doesNotMatch(html(p).split('class="page"')[1], /Dentist/);
  assert.match(html(p), /data-entity="calendar.home" aria-pressed="false"/);
});

test("ccRule reads the simple rules and keeps the others as custom", () => {
  assert.deepEqual(plain(ccRule("")), { freq: "", until: "" });
  assert.deepEqual(plain(ccRule("FREQ=WEEKLY")), { freq: "WEEKLY", until: "" });
  assert.deepEqual(plain(ccRule("FREQ=DAILY;INTERVAL=1;UNTIL=20261231T225900Z")), { freq: "DAILY", until: "2026-12-31" });
  assert.equal(ccRule("FREQ=WEEKLY;BYDAY=MO,WE").freq, "custom");
  assert.equal(ccRule("FREQ=MONTHLY;INTERVAL=2").freq, "custom");
});

test("a repeating new event goes through calendar/event/create with its rule", async () => {
  const calls = [];
  const p = await open("month", {}, calls);
  click(p, { action: "add" });
  assert.match(html(p), /data-f="freq"/);
  Object.assign(p._form, { summary: "Yoga", freq: "WEEKLY", until: "", all_day: true });
  await p._saveForm();
  const ws = calls.find((c) => c.type === "calendar/event/create");
  assert.ok(ws);
  assert.equal(ws.event.rrule, "FREQ=WEEKLY");
  assert.equal(ws.event.summary, "Yoga");
});

test("a plain new event still uses calendar.create_event", async () => {
  const calls = [];
  const p = await open("month", {}, calls);
  click(p, { action: "add" });
  p._form.summary = "Lunch";
  await p._saveForm();
  assert.ok(calls.some((c) => Array.isArray(c) && c[0] === "service" && c[2] === "create_event"));
});

test("an end of repeat before the start is refused", async () => {
  const p = await open();
  click(p, { action: "add" });
  Object.assign(p._form, { summary: "X", freq: "DAILY", until: "2000-01-01" });
  await p._saveForm();
  assert.ok(p._form.error);
});
