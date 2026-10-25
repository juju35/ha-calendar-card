import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

// Values from the card's sandbox come from another realm: compare them as plain JSON.
const plain = (v) => JSON.parse(JSON.stringify(v));

const { CalendarAgendaCard, CalendarAgendaCardEditor, ccParse, ccByDay, ccCalendars, ccDayStart, ccEsc, customElements } = loadCard(
  "calendar-card.js",
  ["CalendarAgendaCard", "CalendarAgendaCardEditor", "ccParse", "ccByDay", "ccCalendars", "ccDayStart", "ccEsc"]
);

// Today at 09:40 local time, events around it.
const today = ccDayStart(new Date());
const at = (days, h, m = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, h, m).toISOString();
const day = (days) => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function mockHass(events, extra = {}) {
  const calls = [];
  return {
    language: "en",
    locale: { time_format: "24" },
    states: {
      "calendar.home": { state: "on", attributes: { friendly_name: "Home" }, last_changed: "1" },
      "calendar.work": { state: "off", attributes: { friendly_name: "Work" }, last_changed: "1" },
    },
    calls,
    callApi: async (method, path) => {
      calls.push([method, path]);
      const id = path.split("?")[0].replace("calendars/", "");
      if (id === "calendar.broken") throw new Error("boom");
      return events[id] || [];
    },
    ...extra,
  };
}

async function render(Card, events, config = {}) {
  const card = new Card();
  card.setConfig({ entities: ["calendar.home", "calendar.work"], ...config });
  card.hass = mockHass(events);
  await new Promise((r) => setTimeout(r, 0));
  return card;
}

test("ccParse reads timed and all-day events", () => {
  const timed = ccParse({ summary: "A", start: { dateTime: "2026-10-26T09:30:00Z" }, end: { dateTime: "2026-10-26T10:00:00Z" } }, 0);
  assert.equal(timed.allDay, false);
  assert.equal(timed.end - timed.start, 30 * 60000);
  const allDay = ccParse({ summary: "B", start: { date: "2026-10-26" }, end: { date: "2026-10-27" } }, 1);
  assert.equal(allDay.allDay, true);
  assert.equal(allDay.start.getDate(), 26);
  assert.equal(allDay.start.getHours(), 0);
  const noEnd = ccParse({ summary: "C", start: "2026-10-26" }, 0);
  assert.equal(noEnd.end.getDate(), 27);
  assert.equal(ccParse({ summary: "D", start: "nope" }, 0), null);
});

test("ccByDay lists a multi-day event once and hides today's finished ones", () => {
  const now = new Date(at(0, 12));
  const events = [
    ccParse({ summary: "Done", start: { dateTime: at(0, 8) }, end: { dateTime: at(0, 9) } }, 0),
    ccParse({ summary: "Trip", start: { date: day(0) }, end: { date: day(3) } }, 0),
    ccParse({ summary: "Later", start: { dateTime: at(1, 10) }, end: { dateTime: at(1, 11) } }, 0),
  ];
  const days = ccByDay(events, today, 4, now, false);
  assert.deepEqual(plain(days.map((d) => d.events.map((e) => e.summary))), [["Trip"], ["Later"], [], []]);
  assert.deepEqual(plain(ccByDay(events, today, 1, now, true)[0].events.map((e) => e.summary)), ["Trip", "Done"]);
});

test("a multi-day event shows once, with its date range", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [
      { summary: "Holidays", start: { date: day(1) }, end: { date: day(4) } },
      { summary: "Trip", start: { dateTime: at(2, 18) }, end: { dateTime: at(4, 10) } },
    ],
  }, { max_events: 0 });
  const html = card.shadowRoot.innerHTML;
  assert.equal(html.match(/class="etitle">Holidays</g).length, 1);
  assert.equal(html.match(/class="etitle">Trip</g).length, 1);
  assert.match(html, /All day · [^<]+ – [^<]+</);
  assert.match(html, /\d\d:\d\d – [^<]*\d\d:\d\d/);
});

test("ccCalendars accepts ids or objects and fills colors and names", () => {
  const cals = ccCalendars({ entities: ["calendar.home", { entity: "calendar.work", color: "#123456", name: "Job" }] }, mockHass({}));
  assert.equal(cals[0].name, "Home");
  assert.match(cals[0].color, /^#/);
  assert.equal(cals[1].color, "#123456");
  assert.equal(cals[1].name, "Job");
});

test("card fetches each calendar over the window and lists events by day", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11, 30) }, end: { dateTime: at(1, 12) }, location: "Downtown" }],
    "calendar.work": [{ summary: "Review", start: { dateTime: at(2, 14) }, end: { dateTime: at(2, 15) } }],
  });
  assert.equal(card._hass.calls.length, 2);
  assert.match(card._hass.calls[0][1], /^calendars\/calendar\.home\?start=.*&end=/);
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Dentist/);
  assert.match(html, /Downtown/);
  assert.match(html, /Review/);
  assert.match(html, /Tomorrow/);
  assert.match(html, /class="logo"/);
});

test("shared events are listed once and exclude hides by title", async () => {
  const ev = { summary: "Meeting", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } };
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [ev, { summary: "Private stuff", start: { dateTime: at(1, 12) }, end: { dateTime: at(1, 13) } }],
    "calendar.work": [ev],
  }, { exclude: ["private"] });
  const html = card.shadowRoot.innerHTML;
  assert.equal(html.match(/class="etitle">Meeting</g).length, 1);
  assert.doesNotMatch(html, /Private stuff/);
});

test("events past max_events go into a folded 'more' section", async () => {
  const events = { "calendar.home": [1, 2, 3, 4].map((i) => ({ summary: `E${i}`, start: { dateTime: at(i, 10) }, end: { dateTime: at(i, 11) } })) };
  const card = await render(CalendarAgendaCard, events, { max_events: 2 });
  let html = card.shadowRoot.innerHTML;
  assert.match(html, /2 more events/);
  assert.match(html, /mdi:chevron-right/);
  assert.doesNotMatch(html, /E3/);
  card._expanded = true;
  card._update();
  html = card.shadowRoot.innerHTML;
  assert.match(html, /E3/);
  assert.match(html, /mdi:chevron-down/);
  assert.doesNotMatch((await render(CalendarAgendaCard, events, { max_events: 0 })).shadowRoot.innerHTML, /data-action="more"/);
});

test("clicking an event opens its details at the top of the card", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) }, description: "Bring the card" }],
  });
  card._detail = 0;
  card._update();
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /class="pop"/);
  assert.match(html, /Bring the card/);
  assert.match(html, /Home/);
});

test("failed calendars are reported, the others still shown", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  }, { entities: ["calendar.home", "calendar.broken"] });
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Dentist/);
  assert.match(html, /Calendar not loaded: calendar\.broken/);
});

test("event text is escaped", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: '<img src=x onerror="alert(1)">', start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  assert.doesNotMatch(card.shadowRoot.innerHTML, /<img src=x/);
  assert.equal(ccEsc(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
});

test("French labels follow the language option", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentiste", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  }, { language: "fr" });
  assert.match(card.shadowRoot.innerHTML, /Demain/);
});

test("mini card: next event, detail button unfolds the full card", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const events = {
    "calendar.home": [
      { summary: "Holiday", start: { date: day(1) }, end: { date: day(2) } },
      { summary: "First", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: "Second", start: { dateTime: at(2, 9) }, end: { dateTime: at(2, 10) } },
    ],
  };
  const card = await render(Mini, events);
  let html = card.shadowRoot.innerHTML;
  assert.match(html, /ha-card class="mini/);
  assert.match(html, /class="etitle">First</);
  assert.match(html, /class="mnext"[\s\S]*Second/);
  assert.match(html, /data-action="zoom"[^>]*><ha-icon icon="mdi:arrow-expand"/);
  assert.deepEqual({ ...card.getGridOptions() }, { columns: 6, min_columns: 6 });
  card._setZoom(true);
  html = card.shadowRoot.innerHTML;
  assert.doesNotMatch(html, /ha-card class="mini/);
  assert.match(html, /mdi:arrow-collapse/);
  assert.match(html, /Holiday/);
  const noZoom = await render(Mini, events, { zoom: false });
  assert.doesNotMatch(noZoom.shadowRoot.innerHTML, /data-action="zoom"/);
  assert.equal(Mini.getConfigElement().mini, true);
});

test("stub config picks the first calendars", () => {
  assert.deepEqual(plain(CalendarAgendaCard.getStubConfig(mockHass({}))), { entities: ["calendar.home", "calendar.work"] });
});

function editor(config, language = "en") {
  const ed = new CalendarAgendaCardEditor();
  ed.setConfig(config);
  ed.hass = { language };
  return ed;
}

test("editor labels follow the language option", () => {
  assert.equal(editor({})._form.computeLabel({ name: "title" }), "Title");
  assert.equal(editor({ language: "fr" })._form.computeLabel({ name: "title" }), "Titre");
});

test("editor keeps YAML colors of the calendars still listed and drops defaults", () => {
  const ed = editor({ type: "custom:calendar-agenda-card", entities: [{ entity: "calendar.home", color: "#ff0000" }, "calendar.work"] });
  assert.deepEqual(plain(ed._form.data.entities), ["calendar.home", "calendar.work"]);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { entities: ["calendar.home", "calendar.new"], days_to_show: 7, show_location: false } } });
  const out = ed._config;
  assert.equal(out.type, "custom:calendar-agenda-card");
  assert.deepEqual(plain(out.entities), [{ entity: "calendar.home", color: "#ff0000" }, "calendar.new"]);
  assert.equal(out.days_to_show, undefined);
  assert.equal(out.show_location, false);
});
