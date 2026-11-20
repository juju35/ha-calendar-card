import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { CalendarAgendaCard, ccWatchOutside } = loadCard("calendar-card.js", ["CalendarAgendaCard", "ccWatchOutside"]);

const hass = {
  language: "en",
  locale: { time_format: "24" },
  states: { "calendar.home": { state: "off", attributes: { friendly_name: "Home" }, last_changed: "1" } },
  callApi: async () => [],
};

test("a tap elsewhere (press and release outside, as on iOS) folds the card back; a press inside does not", () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"] });
  card.hass = hass;
  const w = ccWatchOutside(card, (ev) => card._onOutside(ev));
  const out = { composedPath: () => [] };
  const inside = { composedPath: () => [card] };
  card._expanded = true;
  w.tap(inside);
  assert.equal(card._expanded, true);
  w.tap(out);
  assert.equal(card._expanded, false);
});

test("leaving the page closes the details popup and the detail view, the new event form stays", () => {
  const card = new CalendarAgendaCard();
  card.setConfig({ entities: ["calendar.home"] });
  card.hass = hass;
  card._detail = "x";
  card._expanded = true;
  card._zoomed = true;
  card._adding = true;
  card.disconnectedCallback();
  assert.equal(card._detail, null);
  assert.equal(card._expanded, false);
  assert.equal(card._zoomed, false);
  assert.equal(card._adding, true);
});
