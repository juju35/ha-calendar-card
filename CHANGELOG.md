# Changelog

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
