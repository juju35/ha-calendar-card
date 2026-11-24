// ── Calendars and events ─────────────────────────────────────────────────────
export var CC_COLORS = ['#039be5', '#e67c73', '#33b679', '#f6bf26', '#8e24aa', '#f4511e', '#3f51b5', '#0b8043', '#d81b60', '#616161'];
// Least horizontal move (px) read as a swipe over the week.
export var CC_SWIPE = 50;
export var CC_REFRESH = 5 * 60000;
export var CC_DEFAULTS = {
  view: 'agenda', days_to_show: 7, max_events: 5, show_header: true, show_title: true, show_location: true, show_end_time: true,
  show_countdown: true, show_empty_days: false, show_past_events: false, add_button: true, edit_buttons: true,
  illustration: true, illustration_theme: 'auto',
};

// Calendar features (CalendarEntityFeature): calendar.create_event, calendar/event/delete and
// calendar/event/update.
export var CC_CREATE = 1;
export var CC_DELETE = 2;
export var CC_UPDATE = 4;
// recurrence_range of a change to an instance of a recurring event and the ones after it.
export var CC_FUTURE = 'THISANDFUTURE';
// "2026-11-07" in local time, for a date input and the create_event action.
export function ccIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// A form's date ("2026-11-20") and time ("14:00") as the inputs give them; empty when cleared.
export function ccDateOk(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !Number.isNaN(ccLocalDate(v).getTime()); }

export function ccTimeOk(v) { return /^([01]\d|2[0-3]):[0-5]\d/.test(v || ''); }

export function ccHm(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// New event form defaults: the next round hour, for an hour. The end date defaults to the start's, so
// the end stays on that day (23:59 at most): opened at 22:30, 23:00 to 23:59, not 23:00 to 00:00.
export function ccFormTimes(now) {
  var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
  var end = new Date(Math.min(start.getTime() + 3600000, new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59).getTime()));
  return { date: ccIso(start), start: ccHm(start), end: ccHm(end) };
}

// Days from one form date to another ("2026-11-20" to "2026-11-22": 2).
export function ccDaysBetween(from, to) {
  return Math.round((ccLocalDate(to) - ccLocalDate(from)) / 86400000);
}

// A form date and time ("2026-11-20", "14:00"), in the zone the agenda shows the events in (the
// browser's, or the server's `tz` with the profile's server time zone setting), as an absolute UTC time
// for create_event. A naive time would be read in the Home Assistant server's time zone; UTC for both
// ends also keeps them in one zone across a daylight saving change, as Home Assistant requires.
export function ccUtc(date, hm, tz) {
  var p = `${date}-${hm}`.split(/[-:]/).map(Number);
  var d = tz ? ccFromZone(p[0], p[1] - 1, p[2], p[3], p[4], tz) : new Date(p[0], p[1] - 1, p[2], p[3], p[4]);
  return `${d.toISOString().slice(0, 19)}+00:00`;
}

// Time zone of the profile's "server" setting (hass.locale.time_zone === 'server'): the agenda then shows
// and enters times in the Home Assistant server's zone. The card keeps working on browser-local Date
// objects: an instant is turned into a Date whose local fields are its wall-clock time in that zone
// (ccInZone), and back (ccFromZone). Null, so nothing is shifted, when the setting is "local", the zone
// is unknown, or it is the browser's own.
export var ccZoneFmts = {};
export function ccZoneFmt(tz) {
  if (!Object.hasOwn(ccZoneFmts, tz)) {
    try {
      ccZoneFmts[tz] = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      });
    } catch {
      ccZoneFmts[tz] = null;
    }
  }
  return ccZoneFmts[tz];
}

export function ccServerZone(hass) {
  var tz = hass?.locale?.time_zone === 'server' ? hass?.config?.time_zone : null;
  if (!tz || !ccZoneFmt(tz)) return null;
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === tz) return null;
  } catch { /* unknown browser zone: shift */ }
  return tz;
}

export function ccInZone(d, tz) {
  if (!tz) return d;
  var p = {};
  ccZoneFmt(tz).formatToParts(d).forEach((x) => { p[x.type] = Number(x.value); });
  return new Date(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second, d.getMilliseconds());
}

// The instant of a wall-clock time in `tz` (month from 0). A time skipped by a daylight saving change
// lands an hour later, one repeated by it on its first occurrence.
export function ccFromZone(y, mo, day, h, mi, tz) {
  var wall = Date.UTC(y, mo, day, h, mi);
  var offset = (t) => {
    var w = ccInZone(new Date(t), tz);
    return Date.UTC(w.getFullYear(), w.getMonth(), w.getDate(), w.getHours(), w.getMinutes(), w.getSeconds()) - Math.floor(t / 1000) * 1000;
  };
  var t = wall - offset(wall);
  var t2 = wall - offset(t);
  return new Date(offset(t2) === wall - t2 ? t2 : t);
}

// A shifted Date (see ccInZone) back to its instant.
export function ccOutZone(d, tz) {
  return tz ? ccFromZone(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), tz) : d;
}

// A YAML scalar where a list is expected (`entities: calendar.home`, `exclude: Private`) is a one-item list.
export function ccList(v) {
  if (Array.isArray(v)) return v;
  return v == null || v === '' ? [] : [v];
}

// The configured calendars: `entities` (a list, or a single one), else the single `entity`.
export function ccCalList(config) {
  return config.entities ? ccList(config.entities) : ccList(config.entity);
}

// A calendar color is written into the card's <style> and style attributes: anything that is not a
// CSS color (a typo, or markup such as `red}</style><img …>`) falls back to the palette color.
export function ccColor(v, fallback) {
  if (typeof v !== 'string' || !v.trim() || /[<>{};"'\\]/.test(v)) return fallback;
  if (typeof CSS !== 'undefined' && CSS.supports && !CSS.supports('color', v)) return fallback;
  return v.trim();
}

// [r, g, b] of an opaque color, or null when the card cannot tell (var(), transparency…).
export var ccRgbCache = new Map();
export function ccRgb(color) {
  var key = String(color);
  if (ccRgbCache.has(key)) return ccRgbCache.get(key);
  var s = key.trim(), rgb = null, m;
  if (!/^(#|rgba?\()/i.test(s)) {
    // Named, hsl()… colors: the browser's canvas normalizes them to #rrggbb / rgba(); var() stays unknown.
    try {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#010203';
      ctx.fillStyle = s;
      if (ctx.fillStyle !== '#010203') s = ctx.fillStyle;
    } catch (_e) { /* no canvas: unknown color */ }
  }
  if ((m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i))) {
    var h = m[1].length < 6 ? m[1].replace(/./g, '$&$&') : m[1];
    if (h.length === 6 || /ff$/i.test(h)) rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else if ((m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)$/i))) {
    if (m[4] == null || Number(m[4]) >= (m[5] ? 100 : 1)) rgb = [m[1], m[2], m[3]].map(Number);
  }
  ccRgbCache.set(key, rgb);
  return rgb;
}

// Text on a calendar color (live countdown, today's date, logo): white when it reaches the WCAG AA
// 4.5:1, black otherwise (always ≥ 4.58:1 then). Same in light and dark themes, as the background is
// the calendar color itself. An unreadable color keeps the theme's text color for colored backgrounds.
export function ccOnColor(color) {
  var rgb = ccRgb(color);
  if (!rgb) return 'var(--text-primary-color, #fff)';
  var l = rgb.map((v) => {
    var c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  var lum = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  return 1.05 / (lum + 0.05) >= 4.5 ? '#ffffff' : '#000000';
}

// Workday badge: the `binary_sensor` of `workday_entity`, else the first one of the Workday integration;
// `workday_entity: false` turns it off.
export function ccWorkday(config, hass) {
  var v = config.workday_entity;
  if (v === false || v === 'none') return null;
  if (typeof v === 'string' && v) return hass?.states?.[v] ? v : null;
  var e = Object.values(hass?.entities || {}).find((x) => x?.platform === 'workday' && String(x.entity_id).indexOf('binary_sensor.') === 0 && hass.states?.[x.entity_id]);
  return e ? e.entity_id : null;
}

// `todo_entities`: to-do lists (Bring!, Local To-do…) as entity ids or objects { entity, name }.
export function ccTodoLists(config, hass) {
  return ccList(config.todo_entities).map((item) => {
    var t = typeof item === 'string' ? { entity: item } : Object.assign({}, item);
    t.name = t.name || hass?.states?.[t.entity]?.attributes?.friendly_name || t.entity;
    return t;
  }).filter((t) => t.entity && String(t.entity).indexOf('todo.') === 0);
}

// A to-do item's due date ("2026-11-20" or a date and time) as a local Date, or null.
export function ccDue(v) {
  if (!v) return null;
  var d = /^\d{4}-\d{2}-\d{2}$/.test(v) ? ccLocalDate(v) : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// `entities` accepts entity ids or objects { entity, color, name }; colors default to a palette.
export function ccCalendars(config, hass) {
  return ccCalList(config).map((item, i) => {
    var c = typeof item === 'string' ? { entity: item } : Object.assign({}, item);
    var st = hass?.states?.[c.entity];
    c.color = ccColor(c.color, CC_COLORS[i % CC_COLORS.length]);
    c.name = c.name || st?.attributes?.friendly_name || c.entity;
    return c;
  }).filter((c) => c.entity);
}

export function ccLocalDate(s) {
  var p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

export function ccDayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

export function ccAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

// a day's key, the same local "YYYY-MM-DD" as ccIso
export function ccKey(d) { return ccIso(d); }

// A start / end from the calendar API: { dateTime } for a timed event, { date } for an all-day one.
export function ccTime(v) {
  if (!v) return null;
  if (typeof v === 'object') {
    if (v.dateTime) return { d: new Date(v.dateTime), allDay: false };
    if (v.date) return { d: ccLocalDate(v.date), allDay: true };
    return null;
  }
  var s = String(v);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? { d: ccLocalDate(s), allDay: true } : { d: new Date(s), allDay: false };
}

export function ccParse(raw, cal) {
  var s = ccTime(raw?.start);
  if (!s || Number.isNaN(s.d.getTime())) return null;
  var e = ccTime(raw.end);
  var end = e && !Number.isNaN(e.d.getTime()) ? e.d : (s.allDay ? ccAddDays(s.d, 1) : s.d);
  if (end < s.d) end = s.d;
  return {
    summary: String(raw.summary || raw.message || ''),
    start: s.d, end: end, allDay: s.allDay,
    location: raw.location || '', description: raw.description || '',
    uid: raw.uid || '', recurrence_id: raw.recurrence_id || '', rrule: raw.rrule || '', cal: cal,
  };
}

// The events of calendar `cal` from the calendar API, timed ones in the server's zone `tz` (all-day ones are dates,
// in no zone).
export function ccParseAll(list, cal, tz) {
  return (Array.isArray(list) ? list : []).map((raw) => ccParse(raw, cal)).filter(Boolean).map((e) => {
    if (tz && !e.allDay) Object.assign(e, { start: ccInZone(e.start, tz), end: ccInZone(e.end, tz) });
    return e;
  });
}

// The same event in several calendars (a shared invitation, same uid) is listed once, from the first
// calendar. Events without a uid, or with different uids, are all kept even when their title and times
// match: they are distinct events (each can be changed or deleted in its own calendar).
export function ccDedupe(events) {
  var seen = new Set();
  return events.filter((e) => {
    if (!e.uid) return true;
    var k = `${e.uid}|${e.recurrence_id}|${+e.start}|${+e.end}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Stable identity of an event across fetches and re-renders (row indexes shift as events end or change).
export function ccEvKey(e) {
  return `${e.cal}|${e.uid}|${e.summary}|${+e.start}|${+e.end}`;
}

export function ccSort(a, b) {
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  return (a.start - b.start) || (a.end - b.end) || a.summary.localeCompare(b.summary);
}

// Days from `from`, each with the events it overlaps. A multi-day event is listed once, on the first
// day shown (its start day, or today when it started earlier), with its full date range.
export function ccByDay(events, from, days, now, showPast) {
  var out = [], placed = new Set();
  for (var i = 0; i < days; i++) {
    var ds = ccAddDays(from, i), de = ccAddDays(from, i + 1);
    var list = events.filter((e) => {
      if (placed.has(e)) return false;
      var overlaps = e.start < de && (e.end > ds || (+e.end === +e.start && e.start >= ds));
      if (!overlaps) return false;
      // Timed events that are over are hidden unless show_past_events.
      if (!showPast && !e.allDay && (e.end > e.start ? e.end <= now : e.start < now)) return false;
      placed.add(e);
      return true;
    }).sort(ccSort);
    out.push({ date: ds, events: list });
  }
  return out;
}

export function ccMultiDay(e) {
  var last = e.allDay ? ccAddDays(e.end, -1) : new Date(e.end - 1);
  return +e.end > +e.start && ccKey(e.start) !== ccKey(last);
}

export function ccExcluded(e, exclude) {
  var list = ccList(exclude);
  if (!list.length) return false;
  var s = e.summary.toLowerCase();
  return list.some((x) => x && s.indexOf(String(x).toLowerCase()) >= 0);
}
