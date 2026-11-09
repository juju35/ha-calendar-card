# Changelog

## 1.7.0 - 2026-11-09

### Performance
- **Translations load on demand**: the bundle keeps English only (133 KB → 82 KB) and each other language is its own `calendar-card.i18n.<lang>.js` file next to it, fetched the first time a card needs it. Home Assistant loads every dashboard resource on every dashboard, so each page used to download and parse all 22 languages to use one. Until a language file has arrived (a few milliseconds), texts fall back to English, and the cards redraw once it is there.

### Maintenance
- Build: `scripts/i18n-split.mjs` splits the built bundle and rebuilds every table from the split files to check them (the build fails on any difference); `src/` keeps every language as before.
- Release: every file of `dist/` is attached. Manual installation copies the translation files too.

## 1.6.0 - 2026-11-08

### Features
- Mini card: the "Next" line opens the event's details, by click or with the keyboard (Enter or Space), like the other lines.
- Times follow the server time zone when the Home Assistant user profile is set to use it: the days, the event times and the event form use the server's zone instead of the browser's.

### Fixes
- Reopening an event after closing its details no longer shows the old delete confirmation or its error.
- A delete still pending when its popup is closed cannot be sent twice, and its outcome no longer closes or shows an error in another event's popup.
- Event form: an empty date or time is refused with a message, instead of an "Invalid time value" error from the browser.

## 1.5.0 - 2026-11-07

### Features
- Event form: a **Description** field, sent when the event is created or saved.
- Keyboard: the details popup and the event form are modal dialogs; the focus moves into them when they open and back to the event row (or the **+** button) when they close.

### Fixes
- Events with the same title and times in different calendars are no longer merged into one: only the same event (same uid) shared by several calendars is listed once, and edit or delete acts on the right calendar.

## 1.4.0 - 2026-11-07

### Features
- Event details: **Edit** and **Delete** buttons for an event of a calendar that allows it. Edit opens the event form pre-filled and saves through `calendar/event/update`; delete asks for a confirmation in the popup and uses `calendar/event/delete`. A recurring event can be changed or deleted for this event only, or for this one and the following ones. `edit_buttons: false` hides them (also in the visual editor).
- Event form: an end date, for overnight and multi-day events; it follows the start date and must not end before the start.

## 1.3.1 - 2026-11-07

### Fixes
- New event form: opened between 22:00 and 22:59, the default end is 23:59 instead of 00:00, which the form refused as before the start.
- New event form: start and end times are sent with their time zone (in UTC), so the event lands at the time entered even when the Home Assistant server is in another time zone than the browser.

## 1.3.0 - 2026-11-07

### Features
- Full card: a **+** button in the header opens a **New event** form (title, calendar, date, all day or start and end time, location) that adds the event through `calendar.create_event`. Shown when a calendar accepts new events; `add_button: false` hides it (also in the visual editor).

## 1.2.11 - 2026-11-04

### Documentation
- README: images and links use absolute URLs, so the screenshots, icons, badges and links display in HACS (relative paths broke there).
- README: screenshots get a display size, so cards no longer show oversized in HACS and on GitHub.

## 1.2.10 - 2026-11-04

### Features
- Added Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek translations (`ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv`, `el`), also offered in the editor's language list. Dates and weekdays follow these languages through `Intl`.

### Fixes
- The abbreviated month under each day stays a word in languages where `Intl` gives a number for it (Bulgarian).
- Upper-cased weekdays follow the card language (Greek drops its accents).

## 1.2.9 - 2026-11-02

### Fixes
- Mini card: the header icon keeps its full size (40 px) in the compact view, like the full card.

## 1.2.8 - 2026-11-01

### Fixes
- On a narrow card (a mini card at 6 columns of a section), the title stays visible and the fold button no longer slides out of the card: the "N events today" badge shows only its colored dot on the narrowest cards (the full text stays in its tooltip and is still read by screen readers).
- The "N events today" badge keeps its whole text at normal widths: the title gives way first, and on a phone-sized card the header's calendar logo makes room for it.
- In the mini card, the all-day lines and the "Next" line keep the event name visible on a narrow card; the date after it is shortened instead.
- On a narrow card, an event's countdown moves under the event instead of squeezing its title and time, the time keeps its place before the location (which ends with an ellipsis), and a long all-day range wraps instead of being cut.
- The full agenda card now asks for at least 8 columns in the sections view; an unfolded mini card left at 6 columns puts its events under their date instead of cutting them.
- The card no longer collapses to a sliver inside a container sized by its content (a layout-card, a button-card or a grid with an `auto` column), and still shrinks to its share of a grid of cards side by side instead of overflowing it.
- Restoring the keyboard focus after an update no longer scrolls the page to the card.
- Serbian: 21, 31… events now use the singular ("21 догађај"), and the Cyrillic countdown abbreviates hours as "ч".
- Italian: the "1 more event" button reads "Ancora 1 evento".

## 1.2.7 - 2026-11-01

### Features
- Added Italian, Dutch, European Portuguese and Polish translations (`it`, `nl`, `pt`, `pl`), also offered in the editor's language list. Brazilian Portuguese (`pt-BR`) uses the European Portuguese strings.

## 1.2.6 - 2026-11-01

### Features
- Serbian translations in Cyrillic (`sr`) and Latin (`sr-Latn`) script, also offered in the editor's language list. Serbian translations by @cpmarexel2f (#12).

### Fixes
- A Home Assistant set to a language variant that has its own translation (`sr-Latn`) now uses it instead of the base language; other regional tags (`fr-FR`, `de-CH`) still use their base language, and unknown ones fall back to English.

## 1.2.5

### Fixes
- Text on a calendar's color is readable again: the live countdown badge, today's date and the logo's weekday switch to black text on light calendar colors (green, light blue, yellow, salmon, orange…), where white text was hard to read.
- The "N events today" badge and today's weekday are drawn in a darker (light theme) or lighter (dark theme) shade of the calendar color, so they stay readable in both themes.
- A mini card set to `show_header: false` keeps its fold button once unfolded, so it can be folded back without clicking elsewhere on the page.
- The close button of the event details popup shows a focus ring when reached with the keyboard.
- A calendar `color` that is not a valid CSS color is ignored (the palette color is used instead) and can no longer inject markup into the card.

## 1.2.4

### Fixes
- A single calendar or exclude text written as plain text instead of a list (`entities: calendar.home`, `exclude: Private`) now works like a one-item list, instead of leaving an empty card.

## 1.2.3

### Fixes
- A brief network drop (Wi-Fi change on the mobile app, Home Assistant restarting) during the periodic refresh no longer empties the agenda: a calendar that cannot be reached keeps its events, with the "Calendar not loaded" warning, and the card tries again a minute later instead of five.
- When no calendar could be loaded, the card shows only the error, no longer also "No upcoming events".

## 1.2.2

### Fixes
- An event details popup opened from the keyboard while another one was scrolled now starts at the top instead of inheriting the previous popup's scroll position.

## 1.2.1

### Fixes
- The event details popup no longer switches to another event when an earlier event ends or the calendars refresh; it closes if its event is gone, and keyboard focus stays on the right event.
- The open details popup keeps its scroll position: it was still reset about once a minute and on each refresh.
- A language or time format change in the Home Assistant profile is applied at once instead of at the next minute.
- German and Spanish countdowns read "in 2 Std. 5 Min." / "en 2 h 5 min" (no leading zero on the minutes).
- Visual editor: a YAML config with a single `entity:` is shown in the calendar list and no longer replaced by an empty list ("No calendar found").
- An invalid `language` tag no longer slows down every date and time format.

## 1.2.0

### Changes
- German and Spanish translations (card and visual editor), with `de` and `es` in the editor language selector.

## 1.1.0

### Changes
- Full card: the count of today's events is now a status badge at the right of the header, like the mini card and the other ha-* cards, instead of a subtitle under the title.
- Dates and times follow the full Home Assistant locale (en-GB 26/10 vs en-US 10/26), not just the language.
- Lighter updates: the card no longer re-renders on unrelated Home Assistant state changes, and the open details popup keeps its scroll position (no more minute refresh underneath it); keyboard focus stays on the same event after a refresh.
- README: animated GIFs of the details popup, the **more** section and the mini card unfolding; screenshot captions fixed.

### Fixes
- Enter and Space on a focused event now close its details when they are open, like a click.
- No more duplicate calendar API calls while a first fetch is still pending.
- With `show_empty_days`, empty days after the `max_events` cut no longer vanish when no event is hidden.
- Changing the calendar list no longer briefly shows the previous events with the wrong calendar color and name.

## 1.0.3
### Changes
- The agenda starts 8px under the header (it was 10px), like the other ha-* cards.
- Code: the unused `day` parameter of the event renderer is gone (Biome warning).

## 1.0.2

### Fixes
- Mini card: all-day events under way today (school holidays, a public holiday…) were never shown as soon as there were timed events. They now get a compact line each on top (up to three), with the day they end, before the next timed event.

## 1.0.1

### Changes
- A multi-day event is listed once, on its first day shown (its start day, or today when it started earlier), with its date range, instead of on every day it covers.

## 1.0.0

### Changes
- First release: `calendar-agenda-card`, an agenda of one or more Home Assistant calendars grouped by day, each calendar in its own color, with countdowns, the event under way and its progress, locations, a folded **more** section and event details in a popup.
- `calendar-agenda-mini-card`: the next event and the one after; its detail button unfolds the full agenda and a click elsewhere folds it back.
- Visual editor, English and French.
