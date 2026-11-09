# ha-calendar-card

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-calendar-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-calendar-card/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-calendar-card/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-calendar-card/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-calendar-card/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-calendar-card/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-calendar-card)](https://github.com/juju35/ha-calendar-card/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-calendar-card/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

Custom Lovelace agenda card for Home Assistant [calendars](https://www.home-assistant.io/integrations/calendar/) (Google Calendar, CalDAV, Local Calendar, Microsoft 365…): the events of one or more calendars, grouped by day, each calendar in its own color, plus a **mini card** with the next event that unfolds into the full agenda.

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-calendar-card&category=plugin)

| Agenda | Mini card |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda.png" alt="Agenda card" width="334"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini.png" alt="Mini card" width="400"> |

## Features

- Two cards: `calendar-agenda-card` and its mini version `calendar-agenda-mini-card` (next event and the one after; a detail button unfolds the full agenda)
- Several calendars merged in one list, each with its own color and name; an event shared by several calendars (same uid) is listed once, distinct events with the same title and times are all kept
- Days with today and tomorrow labelled, all-day events, time range and location; a multi-day event is listed once with its date range
- Countdown for today's events (*in 25 min*, *in 2 h 05*), **Now** badge and progress bar for the event under way; finished events go away
- Events past `max_events` fold into a **N more events** section (chevron right folded, down unfolded, folds back on a click elsewhere)
- Click an event for its details (date and time, location, calendar, description) in a popup at the top of the card; the keyboard focus moves into the popup or the form and back to the event when it closes
- **+** button in the header: a **New event** form (title, calendar, all day, start and end date and time, location, description) adds the event to a calendar that accepts new events (local calendar, CalDAV, Google…); the end date allows overnight and multi-day events
- **Edit** and **Delete** buttons in the event details, for a calendar that allows it: edit opens the same form pre-filled, delete asks for a confirmation in the popup; for a recurring event, the change applies to this event only or to this one and the following ones
- Hide events by title with `exclude`
- Refreshes when an event starts or ends and every 5 minutes
- Visual editor in the dashboard UI
- English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek, follows the Home Assistant language, 12 h / 24 h time format and time zone setting (the browser's or the server's)
- Light and dark theme compatible
- Single file, no dependencies, ready for the Marketplace

## Prerequisites

- Home Assistant 2024.8 or later with at least one `calendar.*` entity

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-calendar-card&category=plugin)

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-calendar-card` — Category: **Dashboard** (Lovelace)
3. Open **Calendar Card** and click **Install**
4. Clear your browser cache and refresh

The Marketplace registers the dashboard resource for you.

### Manual

1. Download `calendar-card.js` and the `calendar-card.i18n.*.js` translation files from the [latest release](https://github.com/juju35/ha-calendar-card/releases/latest)
2. Copy them all to `/config/www/` (without the translation files, the cards show in English)
3. Go to **Settings → Dashboards → Resources** → Add resource:
   - URL: `/local/calendar-card.js`
   - Type: **JavaScript Module**
4. Clear your browser cache and refresh

## Configuration

### Visual editor

Add the card from the dashboard (**Add card** → **Calendar Agenda Card** or **Calendar Agenda Mini Card**). The first calendars found are picked; change them with the **Calendars** field, then set the title, the number of days and the sections to show. Colors and names per calendar are set in YAML; the editor keeps them. Options left at their default are not written to the YAML.

### Minimal

```yaml
type: custom:calendar-agenda-card
entities:
  - calendar.home
  - calendar.work
```

### Mini card

```yaml
type: custom:calendar-agenda-mini-card
entities:
  - calendar.home
  - calendar.work
```

The mini card shows today's all-day events under way (school holidays, a public holiday…) on a compact line each, with the day they end, then the event under way or the next one (with its countdown), then the one after. A click (or Enter) on any of these lines opens the event's details. The detail button (top right) unfolds the full agenda; a click anywhere else on the page folds it back. It takes the same options as the full card, which apply once unfolded, plus `zoom`.

### Full options

```yaml
type: custom:calendar-agenda-card
title: Family
entities:
  - entity: calendar.home
    color: "#039be5"
    name: Home
  - entity: calendar.work
    color: "#33b679"
  - entity: calendar.public_holidays
    color: "#8e24aa"
    name: Holidays
days_to_show: 7
max_events: 5
show_header: true
show_location: true
show_end_time: true
show_countdown: true
show_empty_days: false
show_past_events: false
exclude:
  - Private
language: en
```

### Options reference

| Option | Required | Default | Description |
|---|---|---|---|
| `entities` | ✅ | — | Calendars: entity IDs, or objects `{ entity, color, name }` |
| `title` | ❌ | `Agenda` (translated) | Card title |
| `days_to_show` | ❌ | `7` | Number of days from today (1 to 62) |
| `max_events` | ❌ | `5` | Events shown before the folded **more** section (`0` shows everything) |
| `show_header` | ❌ | `true` | Header with today's date and the number of events today |
| `show_location` | ❌ | `true` | Show the event location |
| `show_end_time` | ❌ | `true` | Show the end time of timed events |
| `show_countdown` | ❌ | `true` | Countdown and **Now** badge for today's events |
| `show_empty_days` | ❌ | `false` | List days without events |
| `show_past_events` | ❌ | `false` | Keep today's finished events (greyed out) |
| `exclude` | ❌ | — | Hide events whose title contains one of these texts (case-insensitive) |
| `add_button` | ❌ | `true` | Full card only: **+** button in the header that opens the new event form (shown only when a calendar accepts new events) |
| `edit_buttons` | ❌ | `true` | Full card only: **Edit** and **Delete** buttons in the event details (shown only when the event's calendar allows changing or deleting events) |
| `zoom` | ❌ | `true` | Mini card only: detail button at the top right that unfolds the full agenda (a click elsewhere folds it back) |
| `language` | ❌ | Auto | Force language: `en`, `fr`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings) |

Calendar options:

| Key | Default | Description |
|---|---|---|
| `entity` | — | `calendar.*` entity |
| `color` | Palette | Any CSS color, used for the bar, background and dot of its events |
| `name` | Entity name | Shown in the event details |

## Screenshots

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda.png" alt="agenda" width="334"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-dark.png" alt="agenda dark" width="334"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini.png" alt="mini card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini-dark.png" alt="mini card dark" width="400"> |

| | Light | Dark |
|---|---|---|
| Folded events | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-more.png" alt="agenda with folded events" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-more-dark.png" alt="agenda with folded events dark" width="400"> |
| Event details | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-details.png" alt="event details" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-details-dark.png" alt="event details dark" width="400"> |
| New event | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-add.png" alt="new event form" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-add-dark.png" alt="new event form dark" width="400"> |
| Edit event | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-edit.png" alt="edit event form" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-edit-dark.png" alt="edit event form dark" width="400"> |
| Delete event | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-delete.png" alt="delete confirmation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-delete-dark.png" alt="delete confirmation dark" width="400"> |
| Mini card unfolded | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini-zoom.png" alt="mini card unfolded" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini-zoom-dark.png" alt="mini card unfolded dark" width="400"> |

### Animations

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-popup.gif" alt="event details popup" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-popup-dark.gif" alt="event details popup dark" width="400"> |

Clicking an event slides its details in at the top of the card; a second click (or the cross) closes them.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-more.gif" alt="folded events" width="323"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/agenda-more-dark.gif" alt="folded events dark" width="323"> |

The **more** button unfolds the events past `max_events`, and folds them back.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini-zoom.gif" alt="mini card unfolding" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-calendar-card/main/screenshots/mini-zoom-dark.gif" alt="mini card unfolding dark" width="400"> |

The mini card's detail button unfolds the full agenda in place, and folds it back.

## How it works

The card asks Home Assistant for the events of each calendar between today midnight and `days_to_show` days later (the `/api/calendars/<entity>` endpoint the built-in calendar uses). It fetches again when a calendar entity changes state (an event starts or ends), when the day changes and every 5 minutes; countdowns move on every minute. A calendar that fails to load is named under the list and the others are still shown.

Times follow the **Time zone** setting of the Home Assistant user profile: the browser's zone by default, or the server's zone (`hass.config.time_zone`) when the profile is set to use it. The days, the times and the event form all use that zone.

The **+** button appears when at least one calendar supports creating events. The form needs a title, a date and, unless all day, a start and an end time. It calls the `calendar.create_event` action (all-day events end the next day, as Home Assistant expects) and the agenda fetches again once it is saved; an error from the calendar is shown in the form.

The **Edit** and **Delete** buttons appear in the details of an event that has a uid, when its calendar supports updating or deleting events. They use the `calendar/event/update` and `calendar/event/delete` WebSocket commands, like the calendar panel of Home Assistant: times are sent in UTC, all-day events as dates ending the next day, the description edited in the form like the other fields. For a recurring event, the card asks whether the change applies to this event only or to this one and the following ones (`recurrence_range: THISANDFUTURE`, the recurrence rule kept). The agenda fetches again once the event is saved or deleted; an error is shown in the form or the popup.

A multi-day event is listed once, on the first day shown (its start day, or today when it started earlier), with its date range. Today's timed events that are over are hidden unless `show_past_events` is on.

## Development

```bash
npm install
npm run build        # stamps the version of package.json into dist/calendar-card.js
npm run check        # builds and checks the card (run in CI)
npm test             # unit tests
npm run screenshots  # renders the cards with mock calendars into screenshots/ (PNGs + GIFs, Playwright + ffmpeg)
```

`dist/` is not committed: `npm run build` creates it locally, CI builds it on every push, and the release workflow attaches the built file to the release, which is where the Marketplace installs it from.

### Releasing

1. Bump `version` in `package.json`
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-calendar-card/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow builds the card, creates the tag and the GitHub release with the changelog section as notes, and attaches `calendar-card.js`

## Translations

The card auto-detects the language from your Home Assistant settings. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (Portugal) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Regional variants use their base language (`pt-BR` uses European Portuguese `pt`); unknown languages fall back to English.

Contributions for additional languages are welcome!

## License

[MIT](https://github.com/juju35/ha-calendar-card/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
