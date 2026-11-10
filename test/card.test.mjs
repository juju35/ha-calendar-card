import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { loadCard } from "./load.mjs";

// Values from the card's sandbox come from another realm: compare them as plain JSON.
const plain = (v) => JSON.parse(JSON.stringify(v));

const { CalendarAgendaCard, CalendarAgendaCardEditor, CcI18n, ccParse, ccByDay, ccCalendars, ccDayStart, ccEsc, ccOnColor, ccFormTimes, ccUtc, customElements } = loadCard(
  "calendar-card.js",
  ["CalendarAgendaCard", "CalendarAgendaCardEditor", "CcI18n", "ccParse", "ccByDay", "ccCalendars", "ccDayStart", "ccEsc", "ccOnColor", "ccFormTimes", "ccUtc"]
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
  const ev = { uid: "inv-1", summary: "Meeting", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } };
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
  assert.match(card.shadowRoot.innerHTML, /class="pop" role="dialog" aria-modal="true" aria-label="Review"/);
  // A refetch drops the event listed before the open one: the popup keeps showing "Review".
  events["calendar.home"].shift();
  card._fetch(card._cals);
  await new Promise((r) => setTimeout(r, 0));
  assert.match(card.shadowRoot.innerHTML, /class="pop" role="dialog" aria-modal="true" aria-label="Review"/);
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
  const expect = {
    en: "in 2 h 05", fr: "dans 2 h 05", de: "in 2 Std. 5 Min.", es: "en 2 h 5 min",
    it: "tra 2 h 5 min", nl: "over 2 u 5 min", pt: "daqui a 2 h 05", pl: "za 2 godz. 05",
    ro: "în 2 h 05", da: "om 2 t. 5 min.", sv: "om 2 tim 5 min", bg: "след 2 ч 5 мин", ru: "через 2 ч 5 мин",
    uk: "через 2 год 5 хв", hu: "2 óra 5 perc múlva", sk: "o 2 h 5 min", cs: "za 2 h 5 min",
    sl: "čez 2 h 5 min", lv: "pēc 2 st. 5 min", el: "σε 2 ώ. 5 λεπ.",
  };
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

test("dates use the full Home Assistant locale, with bare pt as European Portuguese", async () => {
  const fmt = async (config, hass) => {
    const card = new CalendarAgendaCard();
    card.setConfig({ entities: ["calendar.home"], ...config });
    card.hass = mockHass({}, hass);
    return card._fmtLang();
  };
  assert.equal(await fmt({}, { language: "pt", locale: { language: "pt" } }), "pt-PT");
  assert.equal(await fmt({}, { language: "pt-BR", locale: { language: "pt-BR" } }), "pt-BR");
  assert.equal(await fmt({}, { language: "en", locale: { language: "en-GB" } }), "en-GB");
  assert.equal(await fmt({}, { language: "sr-Latn", locale: { language: "sr-Latn" } }), "sr-Latn");
  // A locale whose base differs from the card language falls back to the card language.
  assert.equal(await fmt({}, { language: "fr", locale: { language: "en-GB" } }), "fr");
  // The language option still comes first.
  assert.equal(await fmt({ language: "pt" }, { language: "pt-BR", locale: { language: "pt-BR" } }), "pt-PT");
  assert.equal(await fmt({ language: "de" }, { language: "pt", locale: { language: "pt" } }), "de");
  // pt-PT dates: no Brazilian "de" between day and month.
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"] });
  card.hass = mockHass({}, { language: "pt", locale: { language: "pt" } });
  assert.equal(card._dateFmt(new Date(2026, 10, 1), { day: "numeric", month: "short", year: "numeric" }),
    new Date(2026, 10, 1).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" }));
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

test("I18N parity: every language has exactly the English keys, placeholders and array lengths", () => {
  const ph = (v) => (String(v).match(/\{\w+\}/g) || []).sort();
  const en = CcI18n.en;
  assert.deepEqual(Object.keys(CcI18n).sort(), [
    "bg", "cs", "da", "de", "el", "en", "es", "fr", "hu", "it", "lv", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sr",
    "sr-Latn", "sv", "uk",
  ]);
  for (const [lang, strings] of Object.entries(CcI18n)) {
    assert.deepEqual(Object.keys(strings).sort(), Object.keys(en).sort(), lang);
    for (const k of Object.keys(en)) {
      assert.deepEqual(ph(strings[k]), ph(en[k]), `${lang}.${k}`);
      assert.equal(Array.isArray(strings[k]), Array.isArray(en[k]), `${lang}.${k}`);
      if (Array.isArray(en[k])) assert.equal(strings[k].length, en[k].length, `${lang}.${k}`);
      for (const v of [].concat(strings[k])) assert.ok(String(v).trim(), `${lang}.${k} is empty`);
    }
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
  const expect = {
    "fr-FR": "fr", "de-CH": "de", "sr-Latn": "sr-Latn", sr: "sr", toString: "en",
    "it-IT": "it", "nl-BE": "nl", pt: "pt", "pt-BR": "pt", "pl-PL": "pl", ja: "en",
    "ro-RO": "ro", "da-DK": "da", "sv-SE": "sv", "bg-BG": "bg", "ru-RU": "ru", "uk-UA": "uk", "hu-HU": "hu",
    "sk-SK": "sk", "cs-CZ": "cs", "sl-SI": "sl", "lv-LV": "lv", "el-GR": "el",
  };
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
  assert.deepEqual(plain(options.filter((o) => o.value.startsWith("sr"))), [{ value: "sr", label: "Српски" }, { value: "sr-Latn", label: "Srpski (latinica)" }]);
});

test("Italian, Dutch, Portuguese and Polish labels follow the language option", async () => {
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  const expect = { it: [/Domani/, "Titolo"], nl: [/Morgen/, "Titel"], pt: [/Amanhã/, "Título"], pl: [/Jutro/, "Tytuł"] };
  for (const [language, [tomorrow, title]] of Object.entries(expect)) {
    assert.match((await render(CalendarAgendaCard, events, { language })).shadowRoot.innerHTML, tomorrow, language);
    assert.equal(editor({ language })._form.computeLabel({ name: "title" }), title, language);
  }
  const options = editor({})._schema().find((s) => s.name === "language").selector.select.options;
  assert.deepEqual(plain(options.slice(6, 10)), [
    { value: "it", label: "Italiano" }, { value: "nl", label: "Nederlands" },
    { value: "pt", label: "Português (Portugal)" }, { value: "pl", label: "Polski" },
  ]);
  assert.deepEqual(plain(options.map((o) => o.value)).sort(), Object.keys(CcI18n).sort());
});

test("Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek labels follow the language option", async () => {
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  const expect = {
    ro: [/Mâine/, "Titlu"], da: [/I\u00a0morgen/, "Titel"], sv: [/I\u00a0morgon/, "Titel"], bg: [/Утре/, "Заглавие"],
    ru: [/Завтра/, "Заголовок"], uk: [/Завтра/, "Заголовок"], hu: [/Holnap/, "Cím"],
    sk: [/Zajtra/, "Názov"], cs: [/Zítra/, "Název"], sl: [/Jutri/, "Naslov"],
    lv: [/Rīt/, "Virsraksts"], el: [/Αύριο/, "Τίτλος"],
  };
  for (const [language, [tomorrow, title]] of Object.entries(expect)) {
    assert.match((await render(CalendarAgendaCard, events, { language })).shadowRoot.innerHTML, tomorrow, language);
    assert.equal(editor({ language })._form.computeLabel({ name: "title" }), title, language);
  }
  const options = editor({})._schema().find((s) => s.name === "language").selector.select.options;
  assert.deepEqual(plain(options.slice(-12)), [
    { value: "ro", label: "Română" }, { value: "da", label: "Dansk" }, { value: "sv", label: "Svenska" },
    { value: "bg", label: "Български" }, { value: "ru", label: "Русский" }, { value: "uk", label: "Українська" },
    { value: "hu", label: "Magyar" }, { value: "sk", label: "Slovenčina" },
    { value: "cs", label: "Čeština" }, { value: "sl", label: "Slovenščina" },
    { value: "lv", label: "Latviešu" }, { value: "el", label: "Ελληνικά" },
  ]);
});

test("the new languages are passed to Intl for dates, with a readable short month and Greek upper case", async () => {
  const day = new Date(2026, 10, 4);
  for (const language of ["ro", "da", "sv", "bg", "ru", "uk", "hu", "sk", "cs", "sl", "lv", "el"]) {
    const card = await render(CalendarAgendaCard, {}, { language });
    assert.equal(card._fmtLang(), language, language);
    assert.equal(card._dateFmt(day, { weekday: "long" }), day.toLocaleDateString(language, { weekday: "long" }), language);
    assert.match(card.shadowRoot.innerHTML, new RegExp(`<ha-card[^>]* lang="${language}"`), language);
    assert.doesNotMatch(card._monthShort(day), /^\d+$/, language);
  }
  // Home Assistant's full locale is kept when its base matches (ru-RU), else the card language.
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"] });
  card.hass = mockHass({}, { language: "ru", locale: { language: "ru-RU" } });
  assert.equal(card._fmtLang(), "ru-RU");
  card.hass = mockHass({}, { language: "el", locale: { language: "en-GB" } });
  assert.equal(card._fmtLang(), "el");
  // Bulgarian: Intl gives "11" for a lone short month; the card shows the start of the month name.
  assert.equal((await render(CalendarAgendaCard, {}, { language: "bg" }))._monthShort(day), "ное");
  // Latvian: Intl's long "short" weekdays (Ceturtd) are cut to three letters for the whole week, so they fit
  // the 40px date column; the other languages, Portuguese included, keep Intl's form (Polish niedz).
  const thu = new Date(2026, 9, 29), sun = new Date(2026, 10, 1);
  const short = async (language, d) => (await render(CalendarAgendaCard, {}, { language }))._wdShort(d);
  assert.equal(await short("lv", thu), "Cet");
  assert.equal(await short("lv", new Date(2026, 9, 31)), "Ses");
  const pt = await render(CalendarAgendaCard, {}, { language: "pt" });
  assert.equal(pt._wdShort(thu), pt._dateFmt(thu, { weekday: "short" }).replace(".", ""));
  assert.equal(await short("pl", sun), "niedz");
  assert.equal(await short("el", thu), thu.toLocaleDateString("el", { weekday: "short" }));
  // Greek: the header weekday is upper-cased without accents (ΤΡΙ, not ΤΡΊ).
  const el = await render(CalendarAgendaCard, {}, { language: "el" });
  const wd = new Date().toLocaleDateString("el", { weekday: "short" }).replace(".", "").toLocaleUpperCase("el");
  assert.doesNotMatch(wd, /[\u0386\u0388-\u038F]/);
  assert.match(el.shadowRoot.innerHTML, new RegExp(`>${wd}<`));
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

test("narrow header: the title keeps a few characters, the pill shrinks to its dot, the buttons never shrink", async () => {
  // At 09:40, so the 23:00 event is still ahead whatever the hour the tests run at.
  mock.timers.enable({ apis: ["Date"], now: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 40) });
  try {
    const Mini = customElements.get("calendar-agenda-mini-card");
    const events = { "calendar.home": [{ summary: "Stand-up", start: { dateTime: at(0, 23) }, end: { dateTime: at(0, 23, 30) } }] };
    for (const card of [await render(Mini, events, { language: "fr" }), await render(CalendarAgendaCard, events, { language: "fr" })]) {
      const html = card.shadowRoot.innerHTML;
      assert.match(cssRule(html, ".header"), /container-type: inline-size/);
      // The title block starts from 0 and takes what the pill leaves: the pill is cut only when it has to be.
      assert.match(cssRule(html, ".titles"), /flex: 1 1 0;/);
      assert.match(cssRule(html, ".titles"), /min-width: \d+(\.\d+)?ch/);
      const st = cssRule(html, ".st");
      for (const re of [/flex: 0 1 auto/, /min-width: 0/, /overflow: hidden/]) assert.match(st, re);
      assert.doesNotMatch(st, /max-width/);
      assert.doesNotMatch(st, /flex-shrink: 0/);
      assert.match(cssRule(html, ".st .stt"), /text-overflow: ellipsis/);
      // The counter text sits in its own ellipsized span; the whole text stays in the pill's tooltip.
      assert.match(html, /<span class="st" title="1 événement aujourd&#39;hui"><span class="dot"><\/span><span class="stt">1 événement aujourd&#39;hui<\/span><\/span>/);
      // Under the threshold only the dot is shown; the text is visually hidden but still read out.
      const narrow = html.match(/@container \(max-width: 200px\) \{([\s\S]*?)\}\s*\}/)?.[1] || "";
      assert.match(narrow, /\.st \.stt \{[^}]*clip-path: inset\(50%\)/);
      assert.match(narrow, /\.st \.dot \{[^}]*display: block/);
      // A little wider, the logo gives way so the counter keeps its whole text; the title, first then, keeps its place.
      assert.match(html, /@container \(max-width: 240px\) \{ \.logo \{ display: none; \} \}/);
      assert.doesNotMatch(narrow, /\.titles[^{]*\{[^}]*margin-left: -/);
    }
    const card = await render(Mini, events);
    assert.match(cssRule(card.shadowRoot.innerHTML, ".zoom"), /flex: none/);
    // The mini card keeps the full card's 40px logo: no mini-only size.
    assert.doesNotMatch(card.shadowRoot.innerHTML, /\.mini \.logo \{/);
    assert.match(cssRule(card.shadowRoot.innerHTML, ".logo"), /width: 40px; height: 40px;/);
  } finally {
    mock.timers.reset();
  }
});

test("narrow mini card: an all-day line and the next-event line keep the event name, their date gives way", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const html = (await render(Mini, {})).shadowRoot.innerHTML;
  for (const row of [".mallday", ".mnext"]) {
    assert.match(cssRule(html, `${row} b`), /min-width: 40px/, row);
    const last = cssRule(html, `${row} span:last-child`);
    for (const re of [/min-width: 0/, /overflow: hidden/, /text-overflow: ellipsis/]) assert.match(last, re, row);
    assert.doesNotMatch(last, /flex-shrink: 0/, row);
  }
});

test("the time line of an event ends with an ellipsis when it is cut, on the card and the mini card", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) }, location: "12 High Street" }] };
  for (const card of [await render(CalendarAgendaCard, events), await render(Mini, events)]) {
    const html = card.shadowRoot.innerHTML;
    assert.match(cssRule(html, ".emeta .when"), /min-width: 0/);
    assert.match(cssRule(html, ".emeta .when"), /text-overflow: ellipsis/);
    assert.match(html, /<div class="emeta">(<span class="when">[^<]+<\/span><span class="sep">·<\/span>)?<span class="when">11:00 – 12:00<\/span>/);
    // No bare text left in the flex row: a text node there cannot shrink nor end with an ellipsis.
    const meta = html.match(/<div class="emeta">([\s\S]*?)<\/div>/)[1];
    assert.doesNotMatch(meta.replace(/<span[^>]*>[\s\S]*?<\/span>/g, "").replace(/<\/span>/g, ""), /\S/);
  }
  // The mini card puts the day in front of the time, in its own span.
  assert.match((await render(Mini, events)).shadowRoot.innerHTML, /<div class="emeta"><span class="when">Tomorrow<\/span>/);
});

test("counters use the singular for 1 in every language, and Serbian's for 21", async () => {
  const card = await render(CalendarAgendaCard, {});
  const sub = (language, n) => {
    card._config = { ...card._config, language };
    return card._todaySub([{ events: new Array(n).fill({}) }]);
  };
  const expect = {
    en: ["1 event today", "2 events today", "5 events today", "21 events today", "22 events today"],
    fr: ["1 événement aujourd'hui", "2 événements aujourd'hui", "5 événements aujourd'hui", "21 événements aujourd'hui", "22 événements aujourd'hui"],
    sr: ["1 догађај данас", "2 догађаја данас", "5 догађаја данас", "21 догађај данас", "22 догађаја данас"],
    "sr-Latn": ["1 događaj danas", "2 događaja danas", "5 događaja danas", "21 događaj danas", "22 događaja danas"],
    pl: ["1 wydarzenie dzisiaj", "Wydarzenia dzisiaj: 2", "Wydarzenia dzisiaj: 5", "Wydarzenia dzisiaj: 21", "Wydarzenia dzisiaj: 22"],
    ru: ["Сегодня: 1", "Сегодня: 2", "Сегодня: 5", "Сегодня: 21", "Сегодня: 22"],
    cs: ["1 událost dnes", "Události dnes: 2", "Události dnes: 5", "Události dnes: 21", "Události dnes: 22"],
  };
  for (const [language, texts] of Object.entries(expect)) {
    assert.deepEqual([1, 2, 5, 21, 22].map((n) => sub(language, n)), texts, language);
  }
  for (const language of Object.keys(CcI18n)) assert.match(sub(language, 1), /(^|\s)1(\s|$)/, language);
});

test("the 'more events' button uses the singular for 1, and Serbian's for 21", async () => {
  const many = (n) => ({
    "calendar.home": Array.from({ length: n + 1 }, (_, i) => ({ summary: `E${i}`, start: { dateTime: at(1, 8, i) }, end: { dateTime: at(1, 9) } })),
  });
  const label = async (language, n) => (await render(CalendarAgendaCard, many(n), { language, max_events: 1 })).shadowRoot.innerHTML
    .match(/data-action="more"[^>]*><ha-icon[^>]*><\/ha-icon>([^<]+)</)[1];
  assert.equal(await label("sr", 1), "још 1 догађај");
  assert.equal(await label("sr", 21), "још 21 догађај");
  assert.equal(await label("sr", 22), "још 22 догађаја");
  assert.equal(await label("sr-Latn", 21), "još 21 događaj");
  assert.equal(await label("en", 1), "1 more event");
  assert.equal(await label("en", 21), "21 more events");
  assert.equal(await label("it", 1), "Ancora 1 evento");
});

test("Serbian Cyrillic abbreviates the hour as ч", async () => {
  const now = new Date();
  const e = { allDay: false, start: new Date(+now + 125 * 60000), end: new Date(+now + 185 * 60000) };
  const card = await render(CalendarAgendaCard, {}, { language: "sr" });
  assert.equal(card._countdown(e, now), "за 2 ч 05");
  assert.equal(card._countdown({ ...e, start: new Date(+now + 120 * 60000) }, now), "за 2 ч");
});

test("the full card asks for 8 columns at least, the folded mini card keeps 6", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  assert.deepEqual({ ...(await render(CalendarAgendaCard, {})).getGridOptions() }, { columns: 12, min_columns: 8 });
  const mini = await render(Mini, {});
  assert.deepEqual({ ...mini.getGridOptions() }, { columns: 6, min_columns: 6 });
  mini._onClick({ composedPath: () => [{ dataset: { action: "zoom" } }], detail: 1 });
  assert.deepEqual({ ...mini.getGridOptions() }, { columns: 12, min_columns: 8 });
});

test("restoring the focus after a re-render does not scroll the page", async () => {
  const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] };
  const card = await render(CalendarAgendaCard, events);
  const calls = [];
  card.shadowRoot.activeElement = { dataset: { ev: "0" } };
  card.shadowRoot.querySelector = (sel) => (sel === '[data-ev="0"]' ? { focus: (o) => calls.push(o) } : null);
  card._sig = null;
  card.hass = { ...card._hass };
  assert.equal(calls.length, 1);
  assert.deepEqual(plain(calls[0]), { preventScroll: true });
  // The mini card's fold button, unfolded from the keyboard (click detail 0), gets its focus back the same way.
  const mini = await render(customElements.get("calendar-agenda-mini-card"), events);
  const zoomCalls = [];
  mini.shadowRoot.querySelector = (sel) => (sel === ".zoom" ? { focus: (o) => zoomCalls.push(o) } : null);
  mini._onClick({ composedPath: () => [{ dataset: { action: "zoom" } }], detail: 0 });
  assert.deepEqual(plain(zoomCalls), [{ preventScroll: true }]);
});

test("no size containment on the card itself, so it keeps its width in a container sized by its content", async () => {
  for (const Card of [CalendarAgendaCard, customElements.get("calendar-agenda-mini-card")]) {
    const html = (await render(Card, {})).shadowRoot.innerHTML;
    assert.doesNotMatch(cssRule(html, "ha-card"), /container/);
    assert.doesNotMatch(cssRule(html, ":host"), /container/);
    // The narrow query only targets what is inside the header.
    const narrow = html.match(/@container \(max-width: 200px\) \{([\s\S]*?)\}\s*\}/)?.[1] || "";
    for (const sel of narrow.match(/(^|\})\s*([^{}]+)\{/g).map((x) => x.replace(/[{}]/g, "").trim())) {
      assert.doesNotMatch(sel, /(^|,\s*)\.header\s*($|,)/, sel);
    }
  }
});

test("the card gives way in a shared grid (1fr 1fr) and keeps its content width in an inline-block", async () => {
  // A single minmax(0, 1fr) column on the host: under a min-content constraint (a 1fr column, a flex item)
  // the card can shrink to nothing instead of pushing out of the grid; under max-content (inline-block,
  // an auto column) it takes its content's width. No px min-width or intrinsic size on the host.
  for (const Card of [CalendarAgendaCard, customElements.get("calendar-agenda-mini-card")]) {
    const host = cssRule((await render(Card, {})).shadowRoot.innerHTML, ":host");
    assert.match(host, /display: grid;/);
    assert.match(host, /grid-template-columns: minmax\(0, 1fr\)/);
    assert.doesNotMatch(host, /min-width: \d+px|contain-intrinsic|container/);
  }
});

test("a narrow event row: the time wins over the location, the countdown drops under the event", async () => {
  // At 09:40, so the 23:00 event is still ahead whatever the hour the tests run at.
  mock.timers.enable({ apis: ["Date"], now: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 40) });
  try {
    const Mini = customElements.get("calendar-agenda-mini-card");
    const events = { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(0, 23) }, end: { dateTime: at(0, 23, 30) }, location: "12 High Street" }] };
    for (const card of [await render(CalendarAgendaCard, events), await render(Mini, events)]) {
      const html = card.shadowRoot.innerHTML;
      const shrink = (sel) => Number(cssRule(html, sel).match(/flex: \d+ (\d+) /)?.[1]);
      assert.ok(shrink(".loc") >= 100 * shrink(".emeta .when"), "the location shrinks long before the time");
      assert.match(html, /<span class="loc"><ha-icon[^>]*><\/ha-icon><span class="lt">12 High Street<\/span><\/span>/);
      assert.match(cssRule(html, ".loc .lt"), /text-overflow: ellipsis/);
      // A time line too long for the row (an all-day range) wraps instead of being cut.
      assert.match(cssRule(html, ".emeta .when"), /white-space: normal/);
      // The countdown keeps its whole text and wraps instead of squeezing the event.
      assert.match(html, /<span class="cd">/);
      assert.match(cssRule(html, ".ev"), /flex-wrap: wrap/);
      assert.match(cssRule(html, ".emain"), /min-width: min\(100%, \d+px\)/);
      assert.match(cssRule(html, ".cd"), /flex-shrink: 0/);
      // The color bar is out of the flow, so it spans the wrapped line too.
      assert.match(cssRule(html, ".ev .cbar"), /position: absolute/);
      assert.match(cssRule(html, ".ev"), /position: relative/);
    }
    // On a full card squeezed into a narrow column, the events go under the date.
    const html = (await render(CalendarAgendaCard, events)).shadowRoot.innerHTML;
    assert.match(cssRule(html, ".day"), /flex-wrap: wrap/);
    assert.match(cssRule(html, ".events"), /min-width: min\(100%, \d+px\)/);
  } finally {
    mock.timers.reset();
  }
});

test("new event: + button for calendars that accept events, form at the top, create_event with the right data", async () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home", "calendar.work"] });
  const hass = mockHass({});
  // Only "home" accepts new events (CREATE_EVENT = 1).
  hass.states["calendar.home"].attributes.supported_features = 7;
  const services = [];
  hass.callService = async (...args) => {
    services.push(args);
  };
  card.hass = hass;
  await new Promise((r) => setTimeout(r, 0));
  let html = card.shadowRoot.innerHTML;
  assert.match(html, /class="addb" data-action="add"/);
  card._onClick({ composedPath: () => [{ dataset: { action: "add" } }] });
  html = card.shadowRoot.innerHTML;
  assert.match(html, /class="pop form"/);
  assert.match(html, /New event/);
  // A single writable calendar: no calendar picker.
  assert.doesNotMatch(html, /data-f="cal"/);
  // No title: refused with a message, nothing sent.
  await card._saveForm();
  assert.match(card.shadowRoot.innerHTML, /Give the event a title/);
  assert.equal(services.length, 0);
  card._form.summary = "Dentist";
  card._form.date = "2026-11-20";
  card._form.start = "14:00";
  card._form.end = "15:00";
  card._form.location = "12 High Street";
  await card._saveForm();
  assert.deepEqual(plain(services[0]), [
    "calendar",
    "create_event",
    {
      summary: "Dentist",
      location: "12 High Street",
      start_date_time: `${new Date(2026, 10, 20, 14).toISOString().slice(0, 19)}+00:00`,
      end_date_time: `${new Date(2026, 10, 20, 15).toISOString().slice(0, 19)}+00:00`,
    },
    { entity_id: "calendar.home" },
  ]);
  assert.equal(card._adding, false);
  assert.doesNotMatch(card.shadowRoot.innerHTML, /class="pop form"/);

  // All day: start and end dates, the end the day after.
  card._openForm();
  Object.assign(card._form, { summary: "Holiday", date: "2026-12-31", all_day: true });
  await card._saveForm();
  assert.deepEqual(plain(services[1][2]), { summary: "Holiday", start_date: "2026-12-31", end_date: "2027-01-01" });
});

test("new event: default times stay valid late in the evening", async () => {
  assert.deepEqual(plain(ccFormTimes(new Date(2026, 10, 7, 9, 10))), { date: "2026-11-07", start: "10:00", end: "11:00" });
  // 22:30: the end stays on the same day instead of 00:00, which the form refused as before the start.
  assert.deepEqual(plain(ccFormTimes(new Date(2026, 10, 7, 22, 30))), { date: "2026-11-07", start: "23:00", end: "23:59" });
  assert.deepEqual(plain(ccFormTimes(new Date(2026, 10, 7, 23, 30))), { date: "2026-11-08", start: "00:00", end: "01:00" });

  // Opened at 22:30 and saved as is: the event is created, no "end before start".
  mock.timers.enable({ apis: ["Date"], now: new Date(2026, 10, 7, 22, 30) });
  try {
    const card = new CalendarAgendaCard();
    card.setConfig({ entity: "calendar.home" });
    const hass = mockHass({});
    hass.states["calendar.home"].attributes.supported_features = 1;
    const services = [];
    hass.callService = async (...args) => {
      services.push(args);
    };
    card.hass = hass;
    card._openForm();
    card._form.summary = "Late call";
    await card._saveForm();
    assert.equal(card._form, null);
    assert.equal(services.length, 1);
    assert.deepEqual(plain(services[0][2]), {
      summary: "Late call",
      start_date_time: `${new Date(2026, 10, 7, 23).toISOString().slice(0, 19)}+00:00`,
      end_date_time: `${new Date(2026, 10, 7, 23, 59).toISOString().slice(0, 19)}+00:00`,
    });
  } finally {
    mock.timers.reset();
  }
});

test("new event: times entered in the browser's time zone are sent as UTC, whatever the server's zone", async () => {
  const tz = process.env.TZ;
  // Browser in Paris, Home Assistant server in New York.
  process.env.TZ = "Europe/Paris";
  try {
    assert.equal(ccUtc("2026-11-20", "14:00"), "2026-11-20T13:00:00+00:00");
    assert.equal(ccUtc("2026-07-14", "14:00"), "2026-07-14T12:00:00+00:00");
    // Daylight saving change in Paris (29 March 2026, 02:00 -> 03:00): each end gets its own offset,
    // and both are sent in UTC, so Home Assistant sees one zone. New York changed on 8 March.
    assert.equal(ccUtc("2026-03-29", "01:30"), "2026-03-29T00:30:00+00:00");
    assert.equal(ccUtc("2026-03-29", "04:00"), "2026-03-29T02:00:00+00:00");

    const card = new CalendarAgendaCard();
    card.setConfig({ entity: "calendar.home" });
    const hass = mockHass({});
    hass.config = { time_zone: "America/New_York" };
    hass.states["calendar.home"].attributes.supported_features = 1;
    const services = [];
    hass.callService = async (...args) => {
      services.push(args);
    };
    card.hass = hass;
    card._openForm();
    Object.assign(card._form, { summary: "Night", date: "2026-03-29", start: "01:30", end: "04:00" });
    await card._saveForm();
    assert.deepEqual(plain(services[0][2]), {
      summary: "Night",
      start_date_time: "2026-03-29T00:30:00+00:00",
      end_date_time: "2026-03-29T02:00:00+00:00",
    });
  } finally {
    if (tz === undefined) delete process.env.TZ;
    else process.env.TZ = tz;
  }
});

test("new event: no + button without a writable calendar, nor with add_button: false", async () => {
  assert.doesNotMatch((await render(CalendarAgendaCard, {})).shadowRoot.innerHTML, /data-action="add"/);
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"], add_button: false });
  const hass = mockHass({});
  hass.states["calendar.home"].attributes.supported_features = 1;
  card.hass = hass;
  await new Promise((r) => setTimeout(r, 0));
  assert.doesNotMatch(card.shadowRoot.innerHTML, /data-action="add"/);
});

// A card whose "home" calendar has the given features, with callWS recorded (or failing with `fail`).
async function editable(events, features = 7, config = {}, fail = null) {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"], ...config });
  const hass = mockHass({ "calendar.home": events });
  hass.states["calendar.home"].attributes.supported_features = features;
  hass.ws = [];
  hass.callWS = async (msg) => {
    hass.ws.push(msg);
    if (fail) throw new Error(fail);
  };
  card.hass = hass;
  await new Promise((r) => setTimeout(r, 0));
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  return card;
}
const click = (card, action) => card._onClick({ composedPath: () => [{ dataset: { action } }] });
const flush = () => new Promise((r) => setTimeout(r, 0));
const utc = (days, h, m = 0) => `${at(days, h, m).slice(0, 19)}+00:00`;

test("edit and delete: buttons in the details for a calendar that allows it, hidden otherwise", async () => {
  const ev = [{ uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }];
  let html = (await editable(ev)).shadowRoot.innerHTML;
  assert.match(html, /data-action="edit" title="Edit event"/);
  assert.match(html, /data-action="delete" title="Delete event"/);
  // DELETE_EVENT only: no edit button.
  html = (await editable(ev, 2)).shadowRoot.innerHTML;
  assert.doesNotMatch(html, /data-action="edit"/);
  assert.match(html, /data-action="delete"/);
  // UPDATE_EVENT only: no delete button.
  html = (await editable(ev, 5)).shadowRoot.innerHTML;
  assert.match(html, /data-action="edit"/);
  assert.doesNotMatch(html, /data-action="delete"/);
  // Read-only calendar, an event without uid, or edit_buttons: false.
  for (const card of [await editable(ev, 1), await editable([{ ...ev[0], uid: undefined }]), await editable(ev, 7, { edit_buttons: false })]) {
    html = card.shadowRoot.innerHTML;
    assert.match(html, /class="pop"/);
    assert.doesNotMatch(html, /data-action="(edit|delete)"/);
  }
});

test("delete: confirmation in the popup, then calendar/event/delete and a refetch", async () => {
  const card = await editable([{ uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }]);
  const hass = card._hass;
  click(card, "delete");
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /class="pop"[\s\S]*Delete this event\?/);
  assert.match(html, /data-action="delete-one"[^>]*>.*Delete</);
  assert.doesNotMatch(html, /delete-future/);
  // Cancel keeps the details open, without the confirmation.
  click(card, "cancel-delete");
  assert.doesNotMatch(card.shadowRoot.innerHTML, /Delete this event\?/);
  assert.match(card.shadowRoot.innerHTML, /class="pop"/);
  click(card, "delete");
  const fetches = hass.calls.length;
  click(card, "delete-one");
  await flush();
  assert.deepEqual(plain(hass.ws), [{ type: "calendar/event/delete", entity_id: "calendar.home", uid: "a1" }]);
  assert.equal(card._detail, null);
  assert.ok(hass.calls.length > fetches, "the agenda is fetched again");
});

test("delete: a recurring event offers this event or this and the following ones", async () => {
  const ev = [{ uid: "r1", recurrence_id: "20261108T090000", rrule: "FREQ=WEEKLY", summary: "Yoga", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } }];
  let card = await editable(ev);
  click(card, "delete");
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /data-action="delete-one"[^>]*>.*This event</);
  assert.match(html, /data-action="delete-future"[^>]*>.*This and following events</);
  click(card, "delete-future");
  await flush();
  assert.deepEqual(plain(card._hass.ws), [
    { type: "calendar/event/delete", entity_id: "calendar.home", uid: "r1", recurrence_id: "20261108T090000", recurrence_range: "THISANDFUTURE" },
  ]);
  card = await editable(ev);
  click(card, "delete");
  click(card, "delete-one");
  await flush();
  assert.deepEqual(plain(card._hass.ws), [{ type: "calendar/event/delete", entity_id: "calendar.home", uid: "r1", recurrence_id: "20261108T090000" }]);
});

test("delete: an error is shown in the popup", async () => {
  const card = await editable([{ uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }], 7, {}, "Read-only");
  click(card, "delete");
  click(card, "delete-one");
  await flush();
  assert.match(card.shadowRoot.innerHTML, /class="pop"[\s\S]*Could not delete the event: Read-only/);
  assert.notEqual(card._detail, null);
});

test("edit: the form is pre-filled and saved with calendar/event/update, times in UTC", async () => {
  const card = await editable([{
    uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12, 30) }, location: "High Street", description: "Bring the card",
  }]);
  const fetches = card._hass.calls.length;
  click(card, "edit");
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /class="pop form" role="dialog" aria-modal="true" aria-label="Edit event"/);
  assert.match(html, /data-f="summary" value="Dentist"/);
  assert.match(html, new RegExp(`data-f="date" value="${day(1)}"`));
  assert.match(html, new RegExp(`data-f="end_date" value="${day(1)}"`));
  assert.match(html, /data-f="start" value="11:00"/);
  assert.match(html, /data-f="end" value="12:30"/);
  assert.match(html, /data-f="location" value="High Street"/);
  assert.match(html, /<textarea data-f="description"[^>]*>Bring the card<\/textarea>/);
  assert.match(html, /data-action="save-add"[^>]*>.*Save</);
  card._form.summary = "Dentist (moved)";
  card._form.start = "15:00";
  card._form.end = "16:00";
  await card._saveForm();
  assert.deepEqual(plain(card._hass.ws), [{
    type: "calendar/event/update", entity_id: "calendar.home", uid: "a1",
    event: { summary: "Dentist (moved)", dtstart: utc(1, 15), dtend: utc(1, 16), location: "High Street", description: "Bring the card" },
  }]);
  assert.equal(card._adding, false);
  assert.ok(card._hass.calls.length > fetches, "the agenda is fetched again");
});

test("edit: a multi-day all-day event keeps its dates, the end sent as the day after", async () => {
  const card = await editable([{ uid: "h1", summary: "Holidays", start: { date: day(1) }, end: { date: day(4) } }]);
  click(card, "edit");
  assert.match(card.shadowRoot.innerHTML, new RegExp(`data-f="end_date" value="${day(3)}"`));
  assert.doesNotMatch(card.shadowRoot.innerHTML, /type="time"/);
  await card._saveForm();
  assert.deepEqual(plain(card._hass.ws[0].event), { summary: "Holidays", dtstart: day(1), dtend: day(4) });
});

test("edit: a recurring event asks this event or this and the following ones", async () => {
  const ev = [{ uid: "r1", recurrence_id: "20261108T090000", rrule: "FREQ=WEEKLY", summary: "Yoga", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } }];
  let card = await editable(ev);
  click(card, "edit");
  await card._saveForm();
  assert.equal(card._hass.ws.length, 0);
  let html = card.shadowRoot.innerHTML;
  assert.match(html, /Apply the changes to/);
  assert.match(html, /data-action="save-one"/);
  assert.match(html, /data-action="save-future"/);
  click(card, "save-future");
  await flush();
  // This and the following ones: the recurrence rule goes with the change.
  assert.deepEqual(plain(card._hass.ws), [{
    type: "calendar/event/update", entity_id: "calendar.home", uid: "r1", recurrence_id: "20261108T090000", recurrence_range: "THISANDFUTURE",
    event: { summary: "Yoga", dtstart: utc(1, 9), dtend: utc(1, 10), rrule: "FREQ=WEEKLY" },
  }]);
  // This event only: no recurrence rule, no range.
  card = await editable(ev);
  click(card, "edit");
  await card._saveForm();
  click(card, "save-one");
  await flush();
  assert.deepEqual(plain(card._hass.ws), [{
    type: "calendar/event/update", entity_id: "calendar.home", uid: "r1", recurrence_id: "20261108T090000",
    event: { summary: "Yoga", dtstart: utc(1, 9), dtend: utc(1, 10) },
  }]);
  // Back to the form, and an error from Home Assistant shown in it.
  card = await editable(ev, 7, {}, "Bad rule");
  click(card, "edit");
  await card._saveForm();
  click(card, "back-edit");
  html = card.shadowRoot.innerHTML;
  assert.doesNotMatch(html, /Apply the changes to/);
  assert.match(html, /data-action="save-add"/);
  await card._saveForm("");
  assert.match(card.shadowRoot.innerHTML, /class="pop form"[\s\S]*Could not save the event: Bad rule/);
  assert.notEqual(card._form, null);
});

test("new event: an end date for overnight and multi-day events, the end after the start across dates", async () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entity: "calendar.home" });
  const hass = mockHass({});
  hass.states["calendar.home"].attributes.supported_features = 1;
  const services = [];
  hass.callService = async (...args) => {
    services.push(args);
  };
  card.hass = hass;
  click(card, "add");
  // The end date defaults to the start date, and follows it.
  assert.equal(card._form.span, 0);
  assert.match(card.shadowRoot.innerHTML, new RegExp(`data-f="end_date" value="${card._form.date}"`));
  Object.assign(card._form, { summary: "Night shift", date: "2026-11-20", start: "22:00", end: "06:00" });
  // The same day, 06:00 is before 22:00.
  await card._saveForm();
  assert.match(card.shadowRoot.innerHTML, /The end must be after the start/);
  assert.equal(services.length, 0);
  // An end date before the start date is refused, all day too.
  card._onField({ target: { dataset: { f: "end_date" }, value: "2026-11-19" } });
  assert.equal(card._form.span, -1);
  card._form.all_day = true;
  await card._saveForm();
  assert.match(card.shadowRoot.innerHTML, /The end must be after the start/);
  card._form.all_day = false;
  // The next day: 22:00 to 06:00 overnight.
  card._onField({ target: { dataset: { f: "end_date" }, value: "2026-11-21" } });
  await card._saveForm();
  assert.deepEqual(plain(services[0][2]), {
    summary: "Night shift",
    start_date_time: `${new Date(2026, 10, 20, 22).toISOString().slice(0, 19)}+00:00`,
    end_date_time: `${new Date(2026, 10, 21, 6).toISOString().slice(0, 19)}+00:00`,
  });
  // All day over three days: the end date is the last day, sent as the day after.
  card._openForm();
  Object.assign(card._form, { summary: "Trip", date: "2026-12-30", all_day: true });
  card._onField({ target: { dataset: { f: "end_date" }, value: "2027-01-01" } });
  await card._saveForm();
  assert.deepEqual(plain(services[1][2]), { summary: "Trip", start_date: "2026-12-30", end_date: "2027-01-02" });
});

test("editor offers the edit and delete buttons option on the full card", () => {
  const ed = new CalendarAgendaCardEditor();
  ed.setConfig({ type: "custom:calendar-agenda-card" });
  const names = JSON.stringify(ed._schema());
  assert.match(names, /"edit_buttons"/);
  ed.setConfig({ type: "custom:calendar-agenda-mini-card" });
  assert.doesNotMatch(JSON.stringify(ed._schema()), /"edit_buttons"/);
});

test("distinct events with the same title and times in two calendars are both listed, each changed in its own calendar", async () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home", "calendar.work"] });
  const ev = { summary: "Meeting", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } };
  const hass = mockHass({
    "calendar.home": [{ ...ev, uid: "h1" }, { summary: "Lunch", start: { dateTime: at(1, 12) }, end: { dateTime: at(1, 13) } }],
    "calendar.work": [{ ...ev, uid: "w1" }, { summary: "Lunch", start: { dateTime: at(1, 12) }, end: { dateTime: at(1, 13) } }],
  });
  hass.states["calendar.home"].attributes.supported_features = 7;
  hass.states["calendar.work"].attributes.supported_features = 7;
  hass.ws = [];
  hass.callWS = async (msg) => { hass.ws.push(msg); };
  card.hass = hass;
  await new Promise((r) => setTimeout(r, 0));
  const html = card.shadowRoot.innerHTML;
  assert.equal(html.match(/class="etitle">Meeting</g).length, 2);
  // Without a uid, same title and times: still two events.
  assert.equal(html.match(/class="etitle">Lunch</g).length, 2);
  // The second Meeting row is the work one: its details and delete go to calendar.work.
  const rows = card._flat.map((x) => [x.e.summary, card._cals[x.e.cal].entity]);
  const i = rows.findIndex(([s, c]) => s === "Meeting" && c === "calendar.work");
  card._onClick({ composedPath: () => [{ dataset: { ev: String(i) } }] });
  assert.match(card.shadowRoot.innerHTML, /class="pdot"[^>]*><\/span><span>Work</);
  card._onClick({ composedPath: () => [{ dataset: { action: "delete" } }] });
  await card._deleteEvent("");
  assert.deepEqual(plain(hass.ws), [{ type: "calendar/event/delete", entity_id: "calendar.work", uid: "w1" }]);
});

test("dialogs: aria-modal, the focus moves to the popup's close button and back to the event row", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  });
  const focused = [];
  card.shadowRoot.querySelector = (sel) => (sel.startsWith(".pop.") ? null : { focus: () => focused.push(sel) });
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  assert.match(card.shadowRoot.innerHTML, /class="pop" role="dialog" aria-modal="true"/);
  assert.equal(focused.at(-1), '.pop [data-action="close"]');
  card._onKey({ key: "Escape" });
  assert.equal(focused.at(-1), '[data-ev="0"]');
  // The new event form: aria-modal, focus on the title, back to the + button on close.
  card._onClick({ composedPath: () => [{ dataset: { action: "add" } }] });
  assert.match(card.shadowRoot.innerHTML, /class="pop form" role="dialog" aria-modal="true"/);
  assert.equal(focused.at(-1), '[data-f="summary"]');
  card._onKey({ key: "Escape" });
  assert.equal(focused.at(-1), ".addb");
});

test("edit form: closing it puts the focus back on the edited event's row", async () => {
  const card = await editable([{ uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }]);
  const focused = [];
  card.shadowRoot.querySelector = (sel) => (sel.startsWith(".pop.") ? null : { focus: () => focused.push(sel) });
  click(card, "edit");
  click(card, "cancel-add");
  assert.equal(focused.at(-1), '[data-ev="0"]');
});

test("new event: a description, sent with create_event", async () => {
  const card = await editable([]);
  const services = [];
  card._hass.callService = async (...args) => { services.push(args); };
  click(card, "add");
  assert.match(card.shadowRoot.innerHTML, /<label class="ff ff-description"><span>Description<\/span><textarea data-f="description"/);
  Object.assign(card._form, { summary: "Dentist", date: "2026-11-20", all_day: true });
  card._onField({ target: { dataset: { f: "description" }, value: "  Bring the card  " } });
  await card._saveForm();
  assert.deepEqual(plain(services[0][2]), { summary: "Dentist", description: "Bring the card", start_date: "2026-11-20", end_date: "2026-11-21" });
});

test("delete: closing the details drops the confirmation, reopening the event shows its details", async () => {
  const ev = [{ uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }];
  const reopen = (card) => card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  // Closed with the close button, Escape, a click outside, or another event: no stale confirmation.
  for (const close of [(c) => click(c, "close"), (c) => c._onKey({ key: "Escape" }), (c) => c._onOutside({ composedPath: () => [] })]) {
    const card = await editable(ev, 7, {}, "Read-only");
    click(card, "delete");
    click(card, "delete-one");
    await flush();
    assert.match(card.shadowRoot.innerHTML, /Could not delete the event/);
    close(card);
    assert.equal(card._detail, null);
    reopen(card);
    const html = card.shadowRoot.innerHTML;
    assert.match(html, /class="pop"/);
    assert.doesNotMatch(html, /Delete this event\?|Could not delete/);
    assert.equal(card._popBusy, false);
  }
});

test("new event: an empty date or time is refused with a translated message", async () => {
  for (const [lang, msg] of [["en", "Enter the date and times"], ["fr", "Indiquez la date et les heures"]]) {
    const card = await editable([], 7, { language: lang });
    const services = [];
    card._hass.callService = async (...args) => { services.push(args); };
    click(card, "add");
    for (const blank of [{ date: "" }, { start: "" }, { end: "" }, { start: "1" }]) {
      Object.assign(card._form, { summary: "Dentist", date: "2026-11-20", start: "10:00", end: "11:00", all_day: false }, blank);
      await card._saveForm();
      assert.equal(card._form.error, msg);
      assert.match(card.shadowRoot.innerHTML, new RegExp(`class="ferr" role="alert">${msg}<`));
    }
    // All day: only the date is needed.
    Object.assign(card._form, { date: "", start: "", end: "", all_day: true });
    await card._saveForm();
    assert.equal(card._form.error, msg);
    card._form.date = "2026-11-20";
    await card._saveForm();
    assert.equal(services.length, 1);
  }
});

test("mini card: the next-event line opens its details, by click or keyboard", async () => {
  const Mini = customElements.get("calendar-agenda-mini-card");
  const card = await render(Mini, {
    "calendar.home": [
      { summary: "First", start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: "Second", start: { dateTime: at(2, 9) }, end: { dateTime: at(2, 10) } },
    ],
  });
  const m = card.shadowRoot.innerHTML.match(/<div class="mnext"[^>]*data-ev="(\d+)" role="button" tabindex="0">/);
  assert.ok(m, "the next-event line is a focusable button");
  card._onKey({ key: "Enter", preventDefault() {}, target: { dataset: { ev: m[1] } } });
  assert.match(card.shadowRoot.innerHTML, /class="pop"[^>]*aria-label="Second"/);
  card._onKey({ key: "Escape" });
  card._onClick({ composedPath: () => [{ dataset: { ev: m[1] } }] });
  assert.match(card.shadowRoot.innerHTML, /class="pop"[^>]*aria-label="Second"/);
});

test("server time zone setting: events shown and entered in the Home Assistant server's zone", async () => {
  const tz = process.env.TZ;
  // Browser in Paris, server in New York (UTC-5 in November).
  process.env.TZ = "Europe/Paris";
  mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-20T08:00:00Z") });
  try {
    const card = new CalendarAgendaCard();
    card.setConfig({ entity: "calendar.home" });
    const hass = mockHass({
      // 22:30 in Paris on the 20th is 16:30 in New York, on the same day.
      "calendar.home": [{ summary: "Call", start: { dateTime: "2026-11-20T21:30:00Z" }, end: { dateTime: "2026-11-20T22:00:00Z" } }],
    });
    hass.locale = { time_format: "24", time_zone: "server" };
    hass.config = { time_zone: "America/New_York" };
    hass.states["calendar.home"].attributes.supported_features = 1;
    const services = [];
    hass.callService = async (...args) => { services.push(args); };
    card.hass = hass;
    await flush();
    // The agenda starts at midnight in New York (05:00 UTC), not in Paris.
    assert.match(hass.calls[0][1], /start=2026-11-20T05%3A00%3A00.000Z&end=2026-11-27T05%3A00%3A00.000Z/);
    assert.match(card.shadowRoot.innerHTML, /16:30 – 17:00/);
    // New event: default times from the server's clock (03:00 there), sent from the server's zone.
    card._openForm();
    assert.equal(card._form.start, "04:00");
    Object.assign(card._form, { summary: "Night", date: "2026-11-21", start: "09:00", end: "10:00" });
    await card._saveForm();
    assert.deepEqual(plain(services[0][2]), { summary: "Night", start_date_time: "2026-11-21T14:00:00+00:00", end_date_time: "2026-11-21T15:00:00+00:00" });

    // "Local" (the default) keeps the browser's zone.
    hass.locale = { time_format: "24", time_zone: "local" };
    card.hass = { ...hass };
    await flush();
    assert.match(card.shadowRoot.innerHTML, /22:30 – 23:00/);
  } finally {
    mock.timers.reset();
    if (tz === undefined) delete process.env.TZ;
    else process.env.TZ = tz;
  }
});

test("server time zone: wall-clock times convert to UTC across daylight saving changes", () => {
  // New York: 8 March 2026 02:00 -> 03:00, 1 November 2026 02:00 -> 01:00.
  assert.equal(ccUtc("2026-03-08", "01:30", "America/New_York"), "2026-03-08T06:30:00+00:00");
  assert.equal(ccUtc("2026-03-08", "03:30", "America/New_York"), "2026-03-08T07:30:00+00:00");
  // 02:30 does not exist there: an hour later.
  assert.equal(ccUtc("2026-03-08", "02:30", "America/New_York"), "2026-03-08T07:30:00+00:00");
  // 01:30 comes twice: the first one.
  assert.equal(ccUtc("2026-11-01", "01:30", "America/New_York"), "2026-11-01T05:30:00+00:00");
  assert.equal(ccUtc("2026-11-01", "00:30", "America/New_York"), "2026-11-01T04:30:00+00:00");
  assert.equal(ccUtc("2026-11-01", "03:00", "America/New_York"), "2026-11-01T08:00:00+00:00");
  assert.equal(ccUtc("2026-07-14", "14:00", "Asia/Kolkata"), "2026-07-14T08:30:00+00:00");
});

test("delete: closing the popup while a delete is pending neither allows a second delete nor touches another popup", async () => {
  const ev = [
    { uid: "a1", summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } },
    { uid: "b2", summary: "Gym", start: { dateTime: at(1, 13) }, end: { dateTime: at(1, 14) } },
  ];
  for (const fails of [false, true]) {
    const card = await editable(ev);
    const hass = card._hass;
    let answer;
    hass.callWS = (msg) => {
      hass.ws.push(msg);
      return new Promise((res, rej) => { answer = fails ? () => rej(new Error("Read-only")) : res; });
    };
    click(card, "delete");
    click(card, "delete-one");
    // Closed and reopened while pending: still busy, a second delete sends nothing.
    click(card, "close");
    card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
    assert.equal(card._popBusy, true);
    click(card, "delete");
    click(card, "delete-one");
    assert.equal(hass.ws.length, 1);
    // Another event's popup is open when the answer comes: it stays open, without the error.
    card._onClick({ composedPath: () => [{ dataset: { ev: "1" } }] });
    assert.equal(card._popBusy, false);
    const other = card._detail;
    answer();
    await flush();
    assert.equal(card._detail, other);
    assert.equal(card._popErr, "");
    assert.doesNotMatch(card.shadowRoot.innerHTML, /Could not delete/);
  }
});

test("week view: 7 columns from today, every event as a tile that opens its details, max_events ignored", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [
      { summary: "Dentist", start: { dateTime: at(1, 11, 30) }, end: { dateTime: at(1, 12) } },
      { summary: "Holidays", start: { date: day(3) }, end: { date: day(5) } },
    ],
    "calendar.work": [
      { summary: "Review", start: { dateTime: at(2, 14) }, end: { dateTime: at(2, 15) } },
      { summary: "Late", start: { dateTime: at(9, 14) }, end: { dateTime: at(9, 15) } },
    ],
  }, { view: "week", days_to_show: 14, max_events: 1 });
  // The window is the 7 days, whatever days_to_show says.
  const end = new Date(decodeURIComponent(card._hass.calls[0][1].match(/end=([^&]+)/)[1]));
  assert.equal(Math.round((end - today) / 86400000), 7);
  const html = card.shadowRoot.innerHTML;
  assert.equal(html.match(/class="wcol/g).length, 7);
  assert.match(html, /class="wcol today"/);
  assert.match(html, /<span class="wt">11:30<\/span><span class="ws">Dentist</);
  assert.match(html, /class="wev allday"[^>]*><span class="wt">All day<\/span><span class="ws">Holidays</);
  assert.match(html, /Review/);
  assert.doesNotMatch(html, /Late/);
  assert.doesNotMatch(html, /data-action="more"/);
  // A click on a tile opens its details, as in the list.
  assert.match(html, /data-ev="0"[^>]*><span class="wt">11:30/);
  card._toggleDetail(0);
  assert.match(card.shadowRoot.innerHTML, /<ha-card class="popped"/);
  assert.match(card.shadowRoot.innerHTML, /11:30 – 12:00/);
});

test("week view: the editor offers it on the full card only; the mini card keeps its list", async () => {
  const ed = new CalendarAgendaCardEditor();
  ed._config = { type: "custom:calendar-agenda-card" };
  ed._hass = mockHass({});
  const view = ed._schema().find((f) => f.name === "view");
  assert.deepEqual(plain(view.selector.select.options.map((o) => o.value)), ["agenda", "week"]);
  ed._config = { type: "custom:calendar-agenda-mini-card" };
  assert.equal(ed._schema().find((f) => f.name === "view"), undefined);
  const Mini = customElements.get("calendar-agenda-mini-card");
  const mini = await render(Mini, { "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }] }, { view: "week" });
  assert.doesNotMatch(mini.shadowRoot.innerHTML, /class="week"/);
});

test("week view: arrows and swipes move a week at a time, Today comes back", async () => {
  const card = await render(CalendarAgendaCard, {
    "calendar.home": [{ summary: "Dentist", start: { dateTime: at(1, 11) }, end: { dateTime: at(1, 12) } }],
  }, { view: "week" });
  const startOf = (call) => new Date(decodeURIComponent(call[1].match(/start=([^&]+)/)[1]));
  const days = (d) => Math.round((d - today) / 86400000);
  assert.match(card.shadowRoot.innerHTML, /class="wnav"/);
  assert.doesNotMatch(card.shadowRoot.innerHTML, /data-action="week-today"/);
  const click = (action) => card._onClick({ composedPath: () => [{ dataset: { action } }] });
  click("week-next");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(days(startOf(card._hass.calls.at(-1))), 7);
  assert.match(card.shadowRoot.innerHTML, /data-action="week-today"/);
  click("week-prev");
  click("week-prev");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(days(startOf(card._hass.calls.at(-1))), -7);
  click("week-today");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(days(startOf(card._hass.calls.at(-1))), 0);
  assert.doesNotMatch(card.shadowRoot.innerHTML, /data-action="week-today"/);
  // A swipe left over the days: the next week; the click after it doesn't open an event.
  card._swipe = { x: 300, y: 100 };
  card._onSwipe({ clientX: 180, clientY: 110 });
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(days(startOf(card._hass.calls.at(-1))), 7);
  card._onClick({ composedPath: () => [{ dataset: { ev: "0" } }] });
  assert.equal(card._detail, null);
  // A mostly vertical move (scrolling) is not a swipe.
  card._swipe = { x: 300, y: 100 };
  card._onSwipe({ clientX: 230, clientY: 260 });
  assert.equal(card._weekOff, 1);
});
