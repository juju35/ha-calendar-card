import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

// Values from the card's sandbox come from another realm: compare them as plain JSON.
const plain = (v) => JSON.parse(JSON.stringify(v));

const { CalendarAgendaCard, CalendarAgendaCardEditor, CcI18n, ccParse, ccByDay, ccCalendars, ccDayStart, ccEsc, customElements } = loadCard(
  "calendar-card.js",
  ["CalendarAgendaCard", "CalendarAgendaCardEditor", "CcI18n", "ccParse", "ccByDay", "ccCalendars", "ccDayStart", "ccEsc"]
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

test("a pending fetch is not re-triggered by hass updates", async () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home", "calendar.work"] });
  const hass = mockHass({});
  hass.callApi = (method, path) => { hass.calls.push([method, path]); return new Promise(() => {}); };
  card.hass = hass;
  card.hass = hass;
  card.hass = hass;
  assert.equal(hass.calls.length, 2);
});

test("show_empty_days keeps the empty days past the max_events cut", async () => {
  const events = { "calendar.home": [1, 2].map((i) => ({ summary: `E${i}`, start: { dateTime: at(0, 10 + i) }, end: { dateTime: at(0, 11 + i) } })) };
  const card = await render(CalendarAgendaCard, events, { max_events: 2, show_empty_days: true, days_to_show: 3, show_past_events: true });
  const html = card.shadowRoot.innerHTML;
  assert.equal(html.match(/class="none"/g).length, 2);
  assert.doesNotMatch(html, /data-action="more"/);
});

test("changing the calendars drops the events indexed on the old list", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  assert.equal(card._events.length, 1);
  card.setConfig({ entities: ["calendar.work", "calendar.home"] });
  assert.equal(card._events.length, 0);
  card.setConfig({ entities: [{ entity: "calendar.work" }, "calendar.home"], max_events: 9 });
  assert.equal(card._loaded, false);
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(card._events.length, 1);
});

test("clicking an event opens its details at the top of the card", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) }, description: "Bring the card" }],
  });
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /class="pop"/);
  assert.match(html, /Bring the card/);
  assert.match(html, /Home/);
  card._onKey({ key: "Enter", target: { dataset: { ev: "0" } }, preventDefault() {} });
  assert.doesNotMatch(card.shadowRoot.innerHTML, /class="pop"/);
});

test("the open details follow their event when the rows before it change, and close when it is gone", async () => {
  const events = {
    "calendar.home": [
      { summary: "Dentist", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: "Review", start: { dateTime: at(2, 14) }, end: { dateTime: at(2, 15) }, description: "Slides" },
    ],
  };
  const card = await render(CalendarAgendaCard, events);
  card._onClick({ composedPath: () => [{ dataset: { ev: "1" } }] });
  assert.match(card.shadowRoot.innerHTML, /class="pop" role="dialog" aria-label="Review"/);
  // A refetch drops the event listed before the open one: the popup keeps showing "Review".
  events["calendar.home"].shift();
  card._fetch(card._cals);
  await new Promise((r) => setTimeout(r, 0));
  assert.match(card.shadowRoot.innerHTML, /class="pop" role="dialog" aria-label="Review"/);
  // The open event itself disappears: its details close instead of showing another event.
  events["calendar.home"] = [{ summary: "Other", start: { dateTime: at(3, 9) }, end: { dateTime: at(3, 10) } }];
  card._fetch(card._cals);
  await new Promise((r) => setTimeout(r, 0));
  assert.doesNotMatch(card.shadowRoot.innerHTML, /class="pop"/);
  assert.equal(card._detail, null);
});

test("hass updates after a minute change do not re-render under the open popup", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  let renders = 0;
  const orig = card._render.bind(card);
  card._render = (...a) => { renders++; return orig(...a); };
  const realNow = Date.now;
  Date.now = () => realNow() + 61000;
  try {
    card.hass = card._hass;
    assert.equal(renders, 0);
    card._onKey({ key: "Escape" });
    assert.equal(renders, 1);
    card.hass = card._hass;
    assert.equal(renders, 1);
  } finally {
    Date.now = realNow;
  }
});

// A fake `.pop` element, recreated on every render like the real shadow DOM, so the scroll restore can be observed.
function trackPopup(card) {
  const root = card.shadowRoot;
  let html = root.innerHTML;
  let pop = null;
  Object.defineProperty(root, "innerHTML", {
    get: () => html,
    set: (v) => { html = v; pop = /class="pop"/.test(v) ? { scrollTop: 0 } : null; },
  });
  root.querySelector = (sel) => (sel === ".pop" ? pop : null);
  return () => pop;
}

test("the popup scroll is kept on re-render, not carried over to another event's popup", async () => {
  const events = {
    "calendar.home": [
      { summary: "Dentist", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) }, description: "Long notes" },
      { summary: "Review", start: { dateTime: at(2, 14) }, end: { dateTime: at(2, 15) }, description: "Slides" },
    ],
  };
  const card = await render(CalendarAgendaCard, events);
  const pop = trackPopup(card);
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  pop().scrollTop = 120;
  // The same popup re-rendered (a refetch) keeps its scroll position.
  card._fetch(card._cals);
  await new Promise((r) => setTimeout(r, 0));
  assert.match(card.shadowRoot.innerHTML, /aria-label="Dentist"/);
  assert.equal(pop().scrollTop, 120);
  // Keyboard: Enter on another row (hidden under the popup) opens that event's popup at the top.
  card._onKey({ key: "Enter", target: { dataset: { ev: "1" } }, preventDefault() {} });
  assert.match(card.shadowRoot.innerHTML, /aria-label="Review"/);
  assert.equal(pop().scrollTop, 0);
  // Closed then reopened, the popup starts at the top as well.
  pop().scrollTop = 80;
  card._onKey({ key: "Escape" });
  assert.equal(pop(), null);
  card._onClick({ composedPath: () => [{ dataset: { ev: "1" } }] });
  assert.equal(pop().scrollTop, 0);
});

test("a language change in the Home Assistant profile re-renders at once", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentiste", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  assert.match(card.shadowRoot.innerHTML, /Tomorrow/);
  card.hass = { ...card._hass, language: "fr" };
  assert.match(card.shadowRoot.innerHTML, /Demain/);
});

test("countdowns pad the minutes only in the clock-style languages", async () => {
  const now = new Date();
  const e = { allDay: false, start: new Date(+now + 125 * 60000), end: new Date(+now + 185 * 60000) };
  const expect = { en: "in 2 h 05", fr: "dans 2 h 05", de: "in 2 Std. 5 Min.", es: "en 2 h 5 min" };
  for (const [language, text] of Object.entries(expect)) {
    const card = await render(CalendarAgendaCard, {}, { language });
    assert.equal(card._countdown(e, now), text);
  }
});

test("an invalid language tag is checked against Intl only once", async () => {
  const card = await render(CalendarAgendaCard, {}, { language: "zz_ZZ" });
  assert.equal(card._fmtLang(), "en");
  assert.equal(card._fmtBad, "zz_ZZ");
  assert.equal(card._fmtLang(), "en");
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

test("I18N parity: every language has exactly the English keys and placeholders", () => {
  const ph = (v) => (String(v).match(/\{\w+\}/g) || []).sort();
  const en = CcI18n.en;
  assert.deepEqual(Object.keys(CcI18n).sort(), ["de", "en", "es", "fr"]);
  for (const [lang, strings] of Object.entries(CcI18n)) {
    assert.deepEqual(Object.keys(strings).sort(), Object.keys(en).sort(), lang);
    for (const k of Object.keys(en)) assert.deepEqual(ph(strings[k]), ph(en[k]), `${lang}.${k}`);
  }
});

test("German and Spanish labels follow the language option", async () => {
  const events = { "calendar.home": [{ summary: "Zahnarzt", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  assert.match((await render(CalendarAgendaCard, events, { language: "de" })).shadowRoot.innerHTML, /Morgen/);
  assert.match((await render(CalendarAgendaCard, events, { language: "es" })).shadowRoot.innerHTML, /Mañana/);
  assert.equal(editor({ language: "de" })._form.computeLabel({ name: "title" }), "Titel");
  assert.equal(editor({ language: "es" })._form.computeLabel({ name: "title" }), "Título");
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
  card._onClick({ composedPath: () => [{ dataset: { action: "zoom" } }], detail: 1 });
  html = card.shadowRoot.innerHTML;
  assert.doesNotMatch(html, /ha-card class="mini/);
  assert.match(html, /mdi:arrow-collapse/);
  assert.match(html, /Holiday/);
  const noZoom = await render(Mini, events, { zoom: false });
  assert.doesNotMatch(noZoom.shadowRoot.innerHTML, /data-action="zoom"/);
  assert.equal(Mini.getConfigElement().mini, true);
});

test("mini card: an all-day event under way is shown on top, before the next timed event", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const card = await render(Mini, {
    "calendar.work": [{ summary: "School holidays", start: { date: day(-8) }, end: { date: day(7) } }],
    "calendar.home": [
      { summary: "First", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: "Second", start: { dateTime: at(2, 9) }, end: { dateTime: at(2, 10) } },
    ],
  });
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /class="mallday"[^>]*data-ev="0"[\s\S]*School holidays[\s\S]*until [^<]+<[\s\S]*class="etitle">First<[\s\S]*Second/);
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

test("editor turns a YAML single entity into the calendar list", () => {
  const ed = editor({ type: "custom:calendar-agenda-card", entity: "calendar.home" });
  assert.deepEqual(plain(ed._form.data.entities), ["calendar.home"]);
  assert.equal(ed._form.data.entity, undefined);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { ...ed._form.data, title: "Family" } } });
  assert.deepEqual(plain(ed._config.entities), ["calendar.home"]);
  assert.equal(ed._config.entity, undefined);
  assert.equal(ed._config.title, "Family");
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
