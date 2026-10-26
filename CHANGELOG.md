# Changelog

## Unreleased

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
