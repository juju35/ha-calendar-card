import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

// Values from the card's sandbox come from another realm: compare them as plain JSON.
const plain = (v) => JSON.parse(JSON.stringify(v));

const { CalendarAgendaCard, CalendarAgendaCardEditor, CcI18n, ccParse, ccByDay, ccCalendars, ccDayStart, ccEsc, ccOnColor, customElements } = loadCard(
  "calendar-card.js",
  ["CalendarAgendaCard", "CalendarAgendaCardEditor", "CcI18n", "ccParse", "ccByDay", "ccCalendars", "ccDayStart", "ccEsc", "ccOnColor"]
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

// A refetch after a calendar entity change, with `fail` listing the calendars whose request throws.
async function refetch(card, events, fail) {
  const hass = mockHass(events);
  const callApi = hass.callApi;
  hass.callApi = async (method, path) => {
    if (fail.some((id) => path.startsWith(`calendars/${id}?`))) { hass.calls.push([method, path]); throw new Error("offline"); }
    return callApi(method, path);
  };
  for (const id of Object.keys(hass.states)) hass.states[id] = { ...hass.states[id], last_changed: "2", last_updated: "2" };
  card.hass = hass;
  await new Promise((r) => setTimeout(r, 0));
  return hass;
}

test("a failed refetch keeps the events already shown and retries within a minute", async () => {
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  const card = await render(CalendarAgendaCard, events);
  await refetch(card, events, ["calendar.home", "calendar.work"]);
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Dentist/);
  assert.match(html, /Calendar not loaded: Home, Work/);
  assert.doesNotMatch(html, /No upcoming events/);
  // Network back: the next hass update a minute later fetches again, without waiting for the 5-minute refresh.
  const hass = mockHass(events);
  for (const id of Object.keys(hass.states)) hass.states[id] = { ...hass.states[id], last_changed: "2", last_updated: "2" };
  const realNow = Date.now;
  Date.now = () => realNow() + 61000;
  try {
    card.hass = hass;
  } finally {
    Date.now = realNow;
  }
  assert.equal(hass.calls.length, 2);
  await new Promise((r) => setTimeout(r, 0));
  assert.doesNotMatch(card.shadowRoot.innerHTML, /Calendar not loaded/);
});

test("a partly failed refetch updates the calendars that answered and keeps the others", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
    "calendar.work": [{ summary: "Review", start: { dateTime: at(2, 14) }, end: { dateTime: at(2, 15) } }],
  });
  await refetch(card, {
    "calendar.work": [{ summary: "Standup", start: { dateTime: at(2, 9) }, end: { dateTime: at(2, 10) } }],
  }, ["calendar.home"]);
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Dentist/);
  assert.match(html, /Standup/);
  assert.doesNotMatch(html, /Review/);
  assert.match(html, /Calendar not loaded: Home/);
});

test("a failed fetch after a calendar list change does not bring back the old list's events", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  card._hass.callApi = async () => { throw new Error("offline"); };
  card.setConfig({ entities: ["calendar.work", "calendar.home"] });
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(card._events.length, 0);
  assert.doesNotMatch(card.shadowRoot.innerHTML, /Dentist/);
  assert.match(card.shadowRoot.innerHTML, /Calendar not loaded: Work, Home/);
});

test("a first fetch where every calendar fails shows the error, not 'No upcoming events'", async () => {
  for (const Card of [CalendarAgendaCard, customElements.get("calendar-agenda-mini-card")]) {
    const card = await render(Card, {}, { entities: ["calendar.broken"] });
    const html = card.shadowRoot.innerHTML;
    assert.match(html, /Calendar not loaded: calendar\.broken/);
    assert.doesNotMatch(html, /No upcoming events/);
  }
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
  assert.deepEqual(Object.keys(CcI18n).sort(), ["de", "en", "es", "fr", "sr", "sr-Latn"]);
  for (const [lang, strings] of Object.entries(CcI18n)) {
    assert.deepEqual(Object.keys(strings).sort(), Object.keys(en).sort(), lang);
    for (const k of Object.keys(en)) assert.deepEqual(ph(strings[k]), ph(en[k]), `${lang}.${k}`);
  }
});

test("Serbian has exactly the English keys, Cyrillic in sr and Latin in sr-Latn", () => {
  const en = CcI18n.en;
  // Placeholders and proper names / units kept as they are in both scripts.
  const bare = (v) => String(v).replace(/\{\w+\}|Home Assistant|YAML|README/g, "");
  for (const [lang, other] of [["sr", /[A-Za-z\u00C0-\u024F]/], ["sr-Latn", /[\u0400-\u04FF]/]]) {
    const strings = CcI18n[lang];
    assert.deepEqual(Object.keys(strings).sort(), Object.keys(en).sort(), lang);
    for (const k of Object.keys(en)) {
      assert.equal(Array.isArray(strings[k]), Array.isArray(en[k]), `${lang}.${k}`);
      if (Array.isArray(en[k])) assert.equal(strings[k].length, en[k].length, `${lang}.${k}`);
      assert.doesNotMatch(bare(strings[k]), other, `${lang}.${k}`);
    }
  }
});

test("language tags resolve to the full tag, then the part before the dash, then English", async () => {
  const expect = { "fr-FR": "fr", "de-CH": "de", "sr-Latn": "sr-Latn", sr: "sr", "pt-BR": "en", toString: "en" };
  for (const [language, lang] of Object.entries(expect)) {
    assert.equal((await render(CalendarAgendaCard, {}, { language }))._lang(), lang, language);
    assert.equal(editor({ language })._lang(), lang, language);
  }
  // Home Assistant set to sr-Latn picks the Latin strings without a language option.
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"] });
  card.hass = mockHass({}, { language: "sr-Latn" });
  assert.equal(card._lang(), "sr-Latn");
  const ed = editor({});
  ed.hass = { language: "sr-Latn" };
  assert.equal(ed._form.computeLabel({ name: "title" }), "Naslov");
  // The config option still comes first.
  card.setConfig({ entities: ["calendar.home"], language: "sr" });
  assert.equal(card._lang(), "sr");
});

test("Serbian labels follow the language option, in both scripts", async () => {
  const events = { "calendar.home": [{ summary: "Zubar", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  assert.match((await render(CalendarAgendaCard, events, { language: "sr" })).shadowRoot.innerHTML, /Сутра/);
  assert.match((await render(CalendarAgendaCard, events, { language: "sr-Latn" })).shadowRoot.innerHTML, /Sutra/);
  assert.equal(editor({ language: "sr" })._form.computeLabel({ name: "title" }), "Наслов");
  const options = editor({})._schema().find((s) => s.name === "language").selector.select.options;
  assert.deepEqual(plain(options.slice(-2)), [{ value: "sr", label: "Српски" }, { value: "sr-Latn", label: "Srpski (latinica)" }]);
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

// A YAML scalar where a list is expected (`entities: calendar.home`, `exclude: Private`) is read as a one-item list,
// instead of throwing in the hass setter / an unhandled fetch promise and leaving an empty card.
test("a single calendar given as a string instead of a list is shown", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  }, { entities: "calendar.home" });
  assert.deepEqual(card._hass.calls.map((c) => c[1].split("?")[0]), ["calendars/calendar.home"]);
  assert.match(card.shadowRoot.innerHTML, /Dentist/);
  assert.equal(ccCalendars({ entities: "calendar.home" }, mockHass({}))[0].name, "Home");
});

test("an exclude text given as a string instead of a list hides by title", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [
      { summary: "Meeting", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: "Private stuff", start: { dateTime: at(1, 12) }, end: { dateTime: at(1, 13) } },
    ],
  }, { exclude: "Private" });
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Meeting/);
  assert.doesNotMatch(html, /Private stuff/);
});

test("changing a string calendar to a list (or back) still drops the old list's events only when the ids change", async () => {
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  const card = await render(CalendarAgendaCard, events, { entities: "calendar.home" });
  card.setConfig({ entities: ["calendar.home"] });
  assert.equal(card._loaded, true);
  card.setConfig({ entities: "calendar.work" });
  assert.equal(card._loaded, false);
});

test("editor turns a YAML string calendar into the calendar list", () => {
  const ed = editor({ type: "custom:calendar-agenda-card", entities: "calendar.home", exclude: "Private" });
  assert.deepEqual(plain(ed._form.data.entities), ["calendar.home"]);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { ...ed._form.data, title: "Family" } } });
  assert.deepEqual(plain(ed._config.entities), ["calendar.home"]);
  assert.equal(ed._config.exclude, "Private");
});

// ── Review pass 8 ────────────────────────────────────────────────────────────
const PALETTE = ["#039be5", "#e67c73", "#33b679", "#f6bf26", "#8e24aa", "#f4511e", "#3f51b5", "#0b8043", "#d81b60", "#616161"];
// WCAG 2 contrast ratio between two #rrggbb (or [r, g, b]) colors.
const rgbOf = (c) => (Array.isArray(c) ? c : [1, 3, 5].map((i) => Number.parseInt(c.slice(i, i + 2), 16)));
const lum = (c) => {
  const [r, g, b] = rgbOf(c).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const mixRgb = (a, b, p) => rgbOf(a).map((v, i) => v * p + rgbOf(b)[i] * (1 - p));
const cssRule = (html, sel) => html.match(new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] || "";

test("a calendar color cannot break out of the card's style", async () => {
  const payload = "red}</style><img src=x onerror=alert(1)><style>";
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  }, { entities: [{ entity: "calendar.home", color: payload }] });
  const html = card.shadowRoot.innerHTML;
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /<\/style>[\s\S]*<style>/);
  assert.match(html, /--cc-accent: #039be5;/);
});

test("valid calendar colors are kept, in every CSS form", () => {
  const colors = ["#123456", "#abc", "red", "rgb(1, 2, 3)", "hsl(120 50% 40% / 0.5)", "var(--red-color)", "color-mix(in srgb, red 50%, blue)"];
  const cals = ccCalendars({ entities: colors.map((color, i) => ({ entity: `calendar.c${i}`, color })) }, mockHass({}));
  assert.deepEqual(plain(cals.map((c) => c.color)), colors);
});

test("text on a calendar color (live countdown, today's date, logo) reaches 4.5:1", async () => {
  for (const color of PALETTE) {
    const card = await render(CalendarAgendaCard, {
      "calendar.home": [{ summary: "Stand-up", start: { dateTime: new Date(Date.now() - 600000).toISOString() }, end: { dateTime: new Date(Date.now() + 600000).toISOString() } }],
    }, { entities: [{ entity: "calendar.home", color }] });
    const html = card.shadowRoot.innerHTML;
    assert.match(cssRule(html, ".cd.live"), /color: var\(--c-on\)/);
    assert.match(cssRule(html, ".date.today .dn"), /color: var\(--cc-accent-on\)/);
    assert.match(html, /<text [^>]*fill="var\(--cc-accent-on\)"/);
    assert.doesNotMatch(html, /fill="#fff"/);
    const on = html.match(/--cc-accent-on: (#[0-9a-f]{6});/)?.[1];
    assert.ok(on, `${color}: --cc-accent-on`);
    assert.ok(contrast(on, color) >= 4.5, `${color}: ${on} ${contrast(on, color).toFixed(2)}:1`);
    const evOn = html.match(/class="ev ongoing"[^>]*style="--c:[^;"]+;--c-on:(#[0-9a-f]{6})"/)?.[1];
    assert.equal(evOn, on, color);
  }
});

test("a calendar color the card cannot read falls back to the theme's text color on it", async () => {
  const card = await render(CalendarAgendaCard, {}, { entities: [{ entity: "calendar.home", color: "var(--red-color)" }] });
  assert.match(card.shadowRoot.innerHTML, /--cc-accent-on: var\(--text-primary-color, #fff\);/);
});

test("text color on a calendar color reads every opaque hex and rgb() form", () => {
  assert.equal(ccOnColor("#fff"), "#000000");
  assert.equal(ccOnColor("#000F"), "#ffffff");
  assert.equal(ccOnColor("#3F51B5"), "#ffffff");
  assert.equal(ccOnColor("#f6bf26ff"), "#000000");
  assert.equal(ccOnColor("rgb(63, 81, 181)"), "#ffffff");
  assert.equal(ccOnColor("rgb(246 191 38 / 100%)"), "#000000");
  // Translucent or unresolved colors: the card cannot know what is behind them.
  assert.equal(ccOnColor("rgba(0, 0, 0, 0.5)"), "var(--text-primary-color, #fff)");
  assert.equal(ccOnColor("#00000080"), "var(--text-primary-color, #fff)");
  assert.equal(ccOnColor("var(--red-color)"), "var(--text-primary-color, #fff)");
});

test("accent-colored text (today's counter, today's weekday) reaches 4.5:1 in light and dark themes", async () => {
  const card = await render(CalendarAgendaCard, {});
  const html = card.shadowRoot.innerHTML;
  const themes = { light: { text: "#212121", bg: "#ffffff" }, dark: { text: "#e1e1e1", bg: "#1c1c1c" } };
  for (const [sel, tinted] of [[".st", true], [".date.today .wd", false]]) {
    const m = cssRule(html, sel).match(/color: color-mix\(in srgb, var\(--cc-accent\) (\d+)%, var\(--primary-text-color\)\)/);
    assert.ok(m, `${sel} text color`);
    const p = Number(m[1]) / 100;
    for (const [name, t] of Object.entries(themes)) {
      for (const c of PALETTE) {
        const fg = mixRgb(c, t.text, p);
        const bg = tinted ? mixRgb(c, t.bg, 0.15) : rgbOf(t.bg);
        assert.ok(contrast(fg, bg) >= 4.5, `${sel} ${name} ${c}: ${contrast(fg, bg).toFixed(2)}:1`);
      }
    }
  }
});

test("mini card with show_header: false keeps its fold button once unfolded", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const card = await render(Mini, {}, { show_header: false });
  assert.match(card.shadowRoot.innerHTML, /data-action="zoom"/);
  card._onClick({ composedPath: () => [{ dataset: { action: "zoom" } }], detail: 1 });
  assert.match(card.shadowRoot.innerHTML, /data-action="zoom"[^>]*><ha-icon icon="mdi:arrow-collapse"/);
  // The full card itself still follows show_header.
  const full = await render(CalendarAgendaCard, {}, { show_header: false });
  assert.doesNotMatch(full.shadowRoot.innerHTML, /class="header"/);
});

test("mini card with show_header: false and zoom: false still has no fold button", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const card = await render(Mini, {}, { show_header: false, zoom: false });
  assert.doesNotMatch(card.shadowRoot.innerHTML, /data-action="zoom"/);
});

test("the popup close button shows a keyboard focus ring", async () => {
  const card = await render(CalendarAgendaCard, {});
  assert.match(cssRule(card.shadowRoot.innerHTML, ".pclose:focus-visible"), /outline: 2px solid var\(--primary-color/);
});
