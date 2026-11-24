// ── Sidebar panel (optional) ─────────────────────────────────────────────────
// A full-page calendar for the sidebar, with the views of Home Assistant's own calendar panel: Month, Week, Day and
// List, the Today button and the arrows, a toggle per calendar, and the event details, new event, edit and delete
// dialogs (with a repeat rule). Declared in YAML with `panel_custom`, loading this same file (see the README): the
// cards never need it. It draws its own page (no Lovelace card inside): the cards' illustrated header across the
// top, text tabs under it, and reuses the cards' helpers, forms and day rows. The view is in the address
// (`/calendar-agenda/week`), the hidden calendars are remembered in the browser.
export var CC_PANEL_VIEWS = ['month', 'week', 'day', 'list'];
export var CC_PANEL_HIDDEN = 'calendar-panel-hidden';
export var CC_FREQS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
// Most events a month cell lists before its "+N" (the others are on the day view).
export var CC_MONTH_MAX = 3;

// A repeat rule the form can show: FREQ alone, with UNTIL, or INTERVAL=1. Anything else (every 2 weeks, BYDAY…)
// is "custom" and kept as it is.
export function ccRule(rrule) {
  if (!rrule) return { freq: '', until: '' };
  var parts = {};
  String(rrule).replace(/^RRULE:/i, '').split(';').forEach((p) => {
    var kv = p.split('=');
    if (kv[0]) parts[kv[0].toUpperCase()] = kv[1] || '';
  });
  var keys = Object.keys(parts).filter((k) => !(k === 'INTERVAL' && parts[k] === '1'));
  var simple = CC_FREQS.indexOf(parts.FREQ) >= 0 && keys.every((k) => k === 'FREQ' || k === 'UNTIL');
  if (!simple) return { freq: 'custom', until: '' };
  var m = /^(\d{4})(\d{2})(\d{2})/.exec(parts.UNTIL || '');
  return { freq: parts.FREQ, until: m ? `${m[1]}-${m[2]}-${m[3]}` : '' };
}
