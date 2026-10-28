var CALENDAR_CARD_VERSION = '__VERSION__';

// ── i18n ──────────────────────────────────────────────────────────────────────
var CcI18n = {
  fr: {
    agenda: 'Agenda',
    today: 'Aujourd\'hui',
    tomorrow: 'Demain',
    all_day: 'Toute la journée',
    now: 'En cours',
    in_min: 'dans {n} min',
    in_h: 'dans {h} h {m}',
    in_hours: 'dans {h} h',
    no_events: 'Aucun événement',
    no_upcoming: 'Aucun événement à venir',
    events_today: '{n} événements aujourd\'hui',
    event_today: '1 événement aujourd\'hui',
    none_today: 'Rien aujourd\'hui',
    next: 'Ensuite',
    until: 'jusqu\'au {d}',
    more: '{n} événements de plus',
    more_one: '1 événement de plus',
    less: 'Réduire',
    close: 'Fermer',
    load_failed: 'Calendrier non chargé : {list}',
    no_calendar: 'Aucun calendrier trouvé',
    zoom_in: 'Afficher la carte complète',
    zoom_out: 'Revenir à la vue compacte',
    ed_entities: 'Calendriers',
    ed_entities_helper: 'Couleurs et libellés par calendrier : en YAML (voir le README)',
    ed_title: 'Titre',
    ed_title_helper: 'Laisser vide pour « Agenda »',
    ed_days_to_show: 'Jours affichés',
    ed_max_events: 'Événements avant « de plus »',
    ed_max_events_helper: '0 pour tout afficher',
    ed_show_header: 'En-tête',
    ed_show_location: 'Lieu',
    ed_show_end_time: 'Heure de fin',
    ed_show_countdown: 'Compte à rebours',
    ed_show_empty_days: 'Jours sans événement',
    ed_show_past_events: 'Événements terminés du jour',
    ed_zoom: 'Bouton détail',
    ed_zoom_helper: 'Bouton en haut à droite qui passe la mini-carte en carte complète et inversement',
    ed_language: 'Langue',
    ed_language_helper: 'Laisser vide pour suivre la langue de Home Assistant',
  },
  en: {
    agenda: 'Agenda',
    today: 'Today',
    tomorrow: 'Tomorrow',
    all_day: 'All day',
    now: 'Now',
    in_min: 'in {n} min',
    in_h: 'in {h} h {m}',
    in_hours: 'in {h} h',
    no_events: 'No events',
    no_upcoming: 'No upcoming events',
    events_today: '{n} events today',
    event_today: '1 event today',
    none_today: 'Nothing today',
    next: 'Next',
    until: 'until {d}',
    more: '{n} more events',
    more_one: '1 more event',
    less: 'Show less',
    close: 'Close',
    load_failed: 'Calendar not loaded: {list}',
    no_calendar: 'No calendar found',
    zoom_in: 'Show the full card',
    zoom_out: 'Back to the compact view',
    ed_entities: 'Calendars',
    ed_entities_helper: 'Colors and labels per calendar: in YAML (see the README)',
    ed_title: 'Title',
    ed_title_helper: 'Leave empty for "Agenda"',
    ed_days_to_show: 'Days shown',
    ed_max_events: 'Events before "more"',
    ed_max_events_helper: '0 to show everything',
    ed_show_header: 'Header',
    ed_show_location: 'Location',
    ed_show_end_time: 'End time',
    ed_show_countdown: 'Countdown',
    ed_show_empty_days: 'Days without events',
    ed_show_past_events: 'Today\'s finished events',
    ed_zoom: 'Detail button',
    ed_zoom_helper: 'Button at the top right that switches the mini card to the full card and back',
    ed_language: 'Language',
    ed_language_helper: 'Leave empty to follow the Home Assistant language',
  },
};

function ccT(lang, key) {
  var strings = CcI18n[lang] || CcI18n.en;
  return strings[key] || CcI18n.en[key] || key;
}

function ccEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Calendars and events ─────────────────────────────────────────────────────
var CC_COLORS = ['#039be5', '#e67c73', '#33b679', '#f6bf26', '#8e24aa', '#f4511e', '#3f51b5', '#0b8043', '#d81b60', '#616161'];
var CC_REFRESH = 5 * 60000;
var CC_DEFAULTS = {
  days_to_show: 7, max_events: 5, show_header: true, show_location: true, show_end_time: true,
  show_countdown: true, show_empty_days: false, show_past_events: false,
};

// `entities` accepts entity ids or objects { entity, color, name }; colors default to a palette.
function ccCalendars(config, hass) {
  var list = config.entities || (config.entity ? [config.entity] : []);
  return list.map((item, i) => {
    var c = typeof item === 'string' ? { entity: item } : Object.assign({}, item);
    var st = hass?.states?.[c.entity];
    c.color = c.color || CC_COLORS[i % CC_COLORS.length];
    c.name = c.name || st?.attributes?.friendly_name || c.entity;
    return c;
  }).filter((c) => c.entity);
}

function ccLocalDate(s) {
  var p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function ccDayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

function ccAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

function ccKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// A start / end from the calendar API: { dateTime } for a timed event, { date } for an all-day one.
function ccTime(v) {
  if (!v) return null;
  if (typeof v === 'object') {
    if (v.dateTime) return { d: new Date(v.dateTime), allDay: false };
    if (v.date) return { d: ccLocalDate(v.date), allDay: true };
    return null;
  }
  var s = String(v);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? { d: ccLocalDate(s), allDay: true } : { d: new Date(s), allDay: false };
}

function ccParse(raw, cal) {
  var s = ccTime(raw?.start);
  if (!s || Number.isNaN(s.d.getTime())) return null;
  var e = ccTime(raw.end);
  var end = e && !Number.isNaN(e.d.getTime()) ? e.d : (s.allDay ? ccAddDays(s.d, 1) : s.d);
  if (end < s.d) end = s.d;
  return {
    summary: String(raw.summary || raw.message || ''),
    start: s.d, end: end, allDay: s.allDay,
    location: raw.location || '', description: raw.description || '',
    uid: raw.uid || '', cal: cal,
  };
}

// The same event in several calendars (a shared invitation) is listed once.
function ccDedupe(events) {
  var seen = new Set();
  return events.filter((e) => {
    var k = `${e.summary}|${+e.start}|${+e.end}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function ccSort(a, b) {
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  return (a.start - b.start) || (a.end - b.end) || a.summary.localeCompare(b.summary);
}

// Days from `from`, each with the events it overlaps. A multi-day event is listed once, on the first
// day shown (its start day, or today when it started earlier), with its full date range.
function ccByDay(events, from, days, now, showPast) {
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

function ccMultiDay(e) {
  var last = e.allDay ? ccAddDays(e.end, -1) : new Date(e.end - 1);
  return +e.end > +e.start && ccKey(e.start) !== ccKey(last);
}

function ccExcluded(e, exclude) {
  if (!exclude?.length) return false;
  var s = e.summary.toLowerCase();
  return exclude.some((x) => x && s.indexOf(String(x).toLowerCase()) >= 0);
}

// ── Header logo: a tear-off calendar page with today's date ─────────────────
var ccLogo = (wd, day) => '<svg class="logo" viewBox="0 0 40 40" role="img" aria-hidden="true">' +
  '<rect x="2" y="3" width="36" height="35" rx="8" fill="var(--card-background-color, #fff)" stroke="var(--divider-color, rgba(0,0,0,.12))"/>' +
  '<path d="M10 3h20a8 8 0 0 1 8 8v3H2v-3a8 8 0 0 1 8-8Z" fill="var(--cc-accent)"/>' +
  `<text x="20" y="11.6" text-anchor="middle" font-size="7.2" font-weight="700" fill="#fff" letter-spacing=".4">${ccEsc(wd)}</text>` +
  `<text x="20" y="32" text-anchor="middle" font-size="17" font-weight="500" fill="var(--primary-text-color, #212121)">${ccEsc(day)}</text></svg>`;

var ccInDialog = (ev) => ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].indexOf(n.localName) >= 0);

// ── Card ─────────────────────────────────────────────────────────────────────
class CalendarAgendaCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('calendar-agenda-card-editor');
  }

  static getStubConfig(hass) {
    var ids = Object.keys(hass?.states || {}).filter((id) => id.indexOf('calendar.') === 0);
    return { entities: ids.slice(0, 3) };
  }

  constructor() {
    super();
    this._events = [];
    this._failed = [];
    this._fetchedAt = 0;
    this._fetchSeq = 0;
    // Popup, "more" section and mini card fold back on a click anywhere else on the page.
    this._onOutside = (ev) => {
      if (ev.composedPath().includes(this) || ccInDialog(ev)) return;
      if (this._detail != null || this._expanded || this._zoomed) {
        this._detail = null;
        this._expanded = false;
        this._zoomed = false;
        this._update();
      }
    };
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    var prev = this._config;
    this._config = Object.assign({}, CC_DEFAULTS, config);
    // A new calendar list invalidates the stored events, whose `cal` indexes the old one.
    var ccIds = (c) => JSON.stringify((c.entities || (c.entity ? [c.entity] : [])).map((x) => (typeof x === 'string' ? x : x?.entity)));
    if (prev && ccIds(prev) !== ccIds(this._config)) {
      this._events = [];
      this._loaded = false;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (ev) => this._onClick(ev));
      this.shadowRoot.addEventListener('keydown', (ev) => this._onKey(ev));
    }
    this._sig = null;
    this._fetchKey = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    // Every minute: countdowns move on, finished events go, and the events are fetched again every 5 min.
    // The tick is skipped while the details popup is open: re-rendering would reset its scroll position.
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (this._detail != null) return; this._sig = null; this._update(); }, 60000);
    document.addEventListener('click', this._onOutside, true);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    document.removeEventListener('click', this._onOutside, true);
  }

  getCardSize() {
    var n = this._shown || 3;
    return 1 + Math.ceil(n * 0.8);
  }

  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  _lang() {
    var l = (this._config?.language) || (this._hass?.language) || document.documentElement.lang || 'en';
    l = l.split('-')[0];
    return CcI18n[l] ? l : 'en';
  }

  _t(k) { return ccT(this._lang(), k); }

  // Full locale tag for date/time formatting (en-GB vs en-US…); the truncated _lang() is only for CcI18n.
  _fmtLang() {
    var l = (this._config?.language) || (this._hass?.locale?.language) || (this._hass?.language) || document.documentElement.lang || 'en';
    if (l !== this._fmtOk) {
      try { new Intl.DateTimeFormat(l); this._fmtOk = l; } catch { l = this._lang(); }
    }
    return l;
  }

  _days() { return Math.max(1, Math.min(62, Number(this._config.days_to_show) || CC_DEFAULTS.days_to_show)); }

  _timeFmt(d) {
    var o = { hour: '2-digit', minute: '2-digit' };
    var tf = this._hass?.locale?.time_format;
    if (tf === '12') o.hour12 = true;
    else if (tf === '24') o.hour12 = false;
    return d.toLocaleTimeString(this._fmtLang(), o);
  }

  _dateFmt(d, opts) { return d.toLocaleDateString(this._fmtLang(), opts); }


  // "in 25 min", "in 2 h 05", "Now": for today's events only.
  _countdown(e, now) {
    if (e.allDay) return '';
    if (e.start <= now && e.end > now) return this._t('now');
    var mins = Math.round((e.start - now) / 60000);
    if (mins < 0 || mins >= 24 * 60) return '';
    if (mins < 60) return this._t('in_min').replace('{n}', Math.max(1, mins));
    var h = Math.floor(mins / 60), m = mins % 60;
    return m ? this._t('in_h').replace('{h}', h).replace('{m}', String(m).padStart(2, '0')) : this._t('in_hours').replace('{h}', h);
  }

  // Time line of an event: a multi-day one shows its whole range, since it is listed only once.
  _when(e) {
    if (e.allDay) {
      var days = Math.round((ccDayStart(e.end) - ccDayStart(e.start)) / 86400000);
      if (days <= 1) return this._t('all_day');
      return `${this._t('all_day')} · ${this._dateFmt(e.start, { day: 'numeric', month: 'short' })} – ${this._dateFmt(ccAddDays(e.end, -1), { day: 'numeric', month: 'short' })}`;
    }
    var hasEnd = +e.end !== +e.start;
    if (hasEnd && ccKey(e.start) !== ccKey(new Date(e.end - 1))) {
      var o = { weekday: 'short', day: 'numeric', month: 'short' };
      return `${this._dateFmt(e.start, o)} ${this._timeFmt(e.start)} – ${this._dateFmt(e.end, o)} ${this._timeFmt(e.end)}`;
    }
    var from = this._timeFmt(e.start);
    return this._config.show_end_time && hasEnd ? `${from} – ${this._timeFmt(e.end)}` : from;
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    var cals = ccCalendars(this._config, this._hass);
    this._cals = cals;
    var now = new Date();
    // Cheap pre-check: a hass update that touches neither the calendar entities, the minute nor the
    // card state cannot change the fetch key or the render — skip the two JSON.stringify below.
    // `_sig = null` (set by setConfig, the minute timer and a resolved fetch) forces a full pass.
    var tick = `${cals.map((c) => this._hass.states[c.entity]?.last_updated || '').join('|')}|${Math.floor(Date.now() / 60000)}|${this._detail}|${this._expanded}|${this._zoomed}`;
    if (this._sig != null && tick === this._tick) return;
    this._tick = tick;
    // Fetch again when the calendars, the range or the day change, when a calendar entity changes
    // (an event starts or ends) and every 5 minutes.
    var key = JSON.stringify([cals.map((c) => c.entity), this._days(), ccKey(now),
      cals.map((c) => this._hass.states[c.entity]?.last_changed || '')]);
    if (cals.length && (key !== this._fetchKey || Date.now() - this._fetchedAt > CC_REFRESH)) {
      this._fetchKey = key;
      this._fetch(cals);
    }
    var sig = JSON.stringify([this._lang(), this._fmtLang(), this._fetchedAt, this._detail, this._expanded, this._zoomed,
      Math.floor(Date.now() / 60000), cals.map((c) => [c.entity, c.color, c.name]), this._hass.locale?.time_format]);
    if (sig === this._sig) return;
    this._sig = sig;
    // Re-rendering replaces the whole shadow DOM: put the keyboard focus back on the same event row.
    var focused = this.shadowRoot.activeElement?.dataset?.ev;
    this._render(cals, now);
    if (focused != null) this.shadowRoot.querySelector(`[data-ev="${focused}"]`)?.focus();
  }

  async _fetch(cals) {
    var seq = ++this._fetchSeq;
    var from = ccDayStart(new Date());
    var to = ccAddDays(from, this._days());
    var q = `?start=${encodeURIComponent(from.toISOString())}&end=${encodeURIComponent(to.toISOString())}`;
    // Set before the await, so a `set hass` while the request is pending does not refetch.
    this._fetchedAt = Date.now();
    var res = await Promise.allSettled(cals.map((c) => this._hass.callApi('GET', `calendars/${c.entity}${q}`)));
    if (seq !== this._fetchSeq) return;
    var events = [], failed = [];
    res.forEach((r, i) => {
      if (r.status !== 'fulfilled') { failed.push(cals[i].name); return; }
      (Array.isArray(r.value) ? r.value : []).forEach((raw) => {
        var e = ccParse(raw, i);
        if (e) events.push(e);
      });
    });
    this._events = ccDedupe(events.sort(ccSort));
    this._failed = failed;
    this._loaded = true;
    this._fetchedAt = Date.now();
    this._sig = null;
    this._update();
  }

  _visibleDays(now) {
    var c = this._config;
    var events = this._events.filter((e) => !ccExcluded(e, c.exclude) && this._cals[e.cal]);
    return ccByDay(events, ccDayStart(now), this._days(), now, c.show_past_events);
  }

  _eventHtml(e, now, idx, isToday) {
    var c = this._config, cal = this._cals[e.cal];
    var meta = [ccEsc(this._when(e))];
    if (c.show_location && e.location) meta.push(`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${ccEsc(e.location)}</span>`);
    var ongoing = !e.allDay && e.start <= now && e.end > now;
    var cd = c.show_countdown && isToday ? this._countdown(e, now) : '';
    var prog = '';
    if (ongoing && e.end > e.start) {
      var pct = Math.round(((now - e.start) / (e.end - e.start)) * 100);
      prog = `<div class="eprog"><div class="efill" style="width:${pct}%"></div></div>`;
    }
    return `<div class="ev${ongoing ? ' ongoing' : ''}${e.end <= now && !e.allDay ? ' past' : ''}" style="--c:${ccEsc(cal.color)}" data-ev="${idx}" role="button" tabindex="0">` +
      '<span class="cbar"></span>' +
      `<div class="emain"><div class="etitle">${ccEsc(e.summary)}</div><div class="emeta">${meta.join('<span class="sep">·</span>')}</div>${prog}</div>` +
      (cd ? `<span class="cd${ongoing ? ' live' : ''}">${ccEsc(cd)}</span>` : '') +
    '</div>';
  }

  _dayHtml(day, events, now, firstIdx, cont) {
    var isToday = ccKey(day.date) === ccKey(now);
    var isTomorrow = ccKey(day.date) === ccKey(ccAddDays(now, 1));
    var wd = this._dateFmt(day.date, { weekday: 'short' }).replace('.', '');
    var label = isToday ? this._t('today') : (isTomorrow ? this._t('tomorrow') : '');
    var date = cont ? '<div class="date"></div>'
      : `<div class="date${isToday ? ' today' : ''}"><span class="wd">${ccEsc(wd)}</span><span class="dn">${day.date.getDate()}</span>` +
        `<span class="mo">${ccEsc(this._dateFmt(day.date, { month: 'short' }).replace('.', ''))}</span></div>`;
    var body = events.length
      ? events.map((e, i) => this._eventHtml(e, now, firstIdx + i, isToday)).join('')
      : `<div class="none">${this._t('no_events')}</div>`;
    return `<div class="day${cont ? ' cont' : ''}">${date}<div class="events">${label && !cont ? `<div class="dlabel">${ccEsc(label)}</div>` : ''}${body}</div></div>`;
  }

  // Shared by the full and mini cards: the "N events today" counter is a status badge at the right
  // of the header, like the other ha-* cards.
  _headerHtml(now, sub) {
    var wd = this._dateFmt(now, { weekday: 'short' }).replace('.', '').toUpperCase();
    return '<div class="header">' + ccLogo(wd, now.getDate()) +
      `<div class="titles"><div class="name">${ccEsc(this._config.title || this._t('agenda'))}</div></div>` +
      `<span class="st">${ccEsc(sub)}</span>${this._zoomButton()}</div>`;
  }

  _todaySub(days) {
    var n = days.length ? days[0].events.length : 0;
    if (!n) return this._t('none_today');
    return n === 1 ? this._t('event_today') : this._t('events_today').replace('{n}', n);
  }

  _errorHtml() {
    return this._failed.length
      ? `<div class="error" role="alert"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${ccEsc(this._t('load_failed').replace('{list}', this._failed.join(', ')))}</span></div>`
      : '';
  }

  // Overridden by the mini card.
  _compact() { return false; }

  _zoomButton() { return ''; }

  _render(cals, now) {
    var c = this._config;
    var accent = cals[0]?.color || CC_COLORS[0];
    if (!cals.length) {
      this.shadowRoot.innerHTML = `${this._styles(accent)}<ha-card><div class="empty"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon>${this._t('no_calendar')}</div></ha-card>`;
      return;
    }
    var days = this._visibleDays(now);
    // Flat list of shown events, so a click finds its event back.
    this._flat = [];
    days.forEach((d) => { d.events.forEach((e) => { this._flat.push({ e: e, day: d.date }); }); });

    if (this._compact()) {
      this.shadowRoot.innerHTML = this._styles(accent) + this._miniHtml(days, now);
      return;
    }

    var max = Math.max(0, Number(c.max_events) || 0);
    var shown = [], more = [], count = 0, idx = 0;
    days.forEach((d) => {
      if (!d.events.length) {
        // An empty day counts as shown only before the cut.
        if (c.show_empty_days) (!max || count < max ? shown : more).push(this._dayHtml(d, [], now, idx, false));
        return;
      }
      if (!max || count + d.events.length <= max) {
        shown.push(this._dayHtml(d, d.events, now, idx, false));
      } else if (count < max) {
        var head = d.events.slice(0, max - count);
        shown.push(this._dayHtml(d, head, now, idx, false));
        more.push(this._dayHtml(d, d.events.slice(head.length), now, idx + head.length, true));
      } else {
        more.push(this._dayHtml(d, d.events, now, idx, false));
      }
      count += d.events.length;
      idx += d.events.length;
    });
    var moreCount = max ? Math.max(0, this._flat.length - max) : 0;
    // No event hidden: `more` only holds trailing empty days — keep them visible.
    if (!moreCount && more.length) { shown = shown.concat(more); more = []; }
    this._shown = Math.min(this._flat.length, max || this._flat.length) + (this._expanded ? moreCount : 0);

    var list = shown.join('') || (this._loaded ? `<div class="none big">${this._t('no_upcoming')}</div>` : '');
    var moreHtml = '';
    if (moreCount) {
      var open = !!this._expanded;
      var label = open ? this._t('less') : (moreCount === 1 ? this._t('more_one') : this._t('more').replace('{n}', moreCount));
      moreHtml = `<div class="more-body${open ? ' open' : ''}">${open ? more.join('') : ''}</div>` +
        `<button class="more" data-action="more" aria-expanded="${open}"><ha-icon icon="${open ? 'mdi:chevron-down' : 'mdi:chevron-right'}"></ha-icon>${ccEsc(label)}</button>`;
    }

    this.shadowRoot.innerHTML = this._styles(accent) + `<ha-card class="${this._detail != null ? 'popped' : ''}">` +
      (c.show_header ? this._headerHtml(now, this._todaySub(days)) : '') +
      `<div class="list">${list}</div>${moreHtml}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }

  // Event details, at the top of the card.
  _popupHtml() {
    var item = this._detail != null && this._flat[this._detail];
    if (!item) return '';
    var e = item.e, cal = this._cals[e.cal];
    var date = this._dateFmt(e.start, { weekday: 'long', day: 'numeric', month: 'long' });
    var when;
    if (e.allDay) {
      when = this._when(e).indexOf('·') > 0 ? this._when(e) : `${date} · ${this._t('all_day')}`;
    } else if (ccKey(e.start) === ccKey(e.end) || +e.end === +ccAddDays(ccDayStart(e.start), 1)) {
      when = `${date} · ${this._timeFmt(e.start)}${+e.end !== +e.start ? ` – ${this._timeFmt(e.end)}` : ''}`;
    } else {
      var o = { weekday: 'short', day: 'numeric', month: 'short' };
      when = `${this._dateFmt(e.start, o)} ${this._timeFmt(e.start)} – ${this._dateFmt(e.end, o)} ${this._timeFmt(e.end)}`;
    }
    var rows = [`<div class="prow"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${ccEsc(when)}</span></div>`];
    if (e.location) rows.push(`<div class="prow"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${ccEsc(e.location)}</span></div>`);
    rows.push(`<div class="prow"><span class="pdot" style="background:${ccEsc(cal.color)}"></span><span>${ccEsc(cal.name)}</span></div>`);
    if (e.description) rows.push(`<div class="pdesc">${ccEsc(String(e.description).slice(0, 1200))}</div>`);
    return `<div class="pop" role="dialog" aria-label="${ccEsc(e.summary)}" style="--c:${ccEsc(cal.color)}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${ccEsc(e.summary)}</div>` +
      `<button class="pclose" data-action="close" title="${ccEsc(this._t('close'))}" aria-label="${ccEsc(this._t('close'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>` +
      rows.join('') + '</div>';
  }

  _onClick(ev) {
    var path = ev.composedPath();
    var btn = path.find((n) => n.dataset?.action);
    if (btn) {
      switch (btn.dataset.action) {
        case 'more': this._expanded = !this._expanded; break;
        case 'close': this._detail = null; break;
        case 'zoom': this._zoomed = !this._zoomed; this._detail = null; break;
      }
      this._update();
      if (btn.dataset.action === 'zoom' && ev.detail === 0) this.shadowRoot.querySelector('.zoom')?.focus();
      return;
    }
    var row = path.find((n) => n.dataset?.ev != null);
    if (row) {
      var i = Number(row.dataset.ev);
      this._detail = this._detail === i ? null : i;
      this._update();
      return;
    }
    // A click on the card outside the popup closes it.
    if (this._detail != null && !path.some((n) => n.classList?.contains('pop'))) {
      this._detail = null;
      this._update();
    }
  }

  _onKey(ev) {
    if (ev.key === 'Escape' && this._detail != null) {
      this._detail = null;
      this._update();
      return;
    }
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target?.dataset?.ev != null) {
      ev.preventDefault();
      // Same toggle as a click: a second Enter/Space on the open event closes its details.
      var i = Number(ev.target.dataset.ev);
      this._detail = this._detail === i ? null : i;
      this._update();
    }
  }

  _styles(accent) {
    return '<style>' +
      `:host { display: block; height: 100%; --cc-accent: ${accent}; }` +
      'ha-card { position: relative; height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
      'ha-card.popped { min-height: 240px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // The body starts 8px under the header, like the other ha-* cards (the card's gap is 10px).
      '.header { display: flex; align-items: center; gap: 10px; margin-bottom: -2px; }' +
      '.logo { width: 40px; height: 40px; flex-shrink: 0; font-family: inherit; }' +
      '.titles { flex: 1; min-width: 0; }' +
      '.name { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.list, .more-body { display: flex; flex-direction: column; gap: 10px; }' +
      '.more-body:not(.open) { display: none; }' +
      '.day { display: flex; gap: 10px; }' +
      '.day + .day { border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 10px; }' +
      '.list .day.cont, .more-body .day.cont { border-top: none; padding-top: 0; }' +
      '.date { width: 40px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; line-height: 1.1; padding-top: 2px; }' +
      '.date .wd, .date .mo { font-size: 11px; font-weight: 500; text-transform: uppercase; color: var(--secondary-text-color); }' +
      '.date .dn { font-size: 20px; font-weight: 500; color: var(--primary-text-color); margin: 2px 0; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; }' +
      '.date.today .wd { color: var(--cc-accent); }' +
      '.date.today .dn { background: var(--cc-accent); color: #fff; }' +
      '.events { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }' +
      '.dlabel { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--secondary-text-color); margin: 2px 0 2px 2px; }' +
      '.none { font-size: 13px; color: var(--secondary-text-color); padding: 6px 2px; }' +
      '.none.big { display: flex; align-items: center; justify-content: center; padding: 18px 0; }' +
      '.ev { display: flex; align-items: center; gap: 10px; padding: 6px 8px 6px 6px; border-radius: 10px; cursor: pointer; min-width: 0;' +
        ' background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.ev:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.ev:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.ev.past { opacity: 0.55; }' +
      '.cbar { width: 4px; align-self: stretch; min-height: 28px; border-radius: 2px; background: var(--c); flex-shrink: 0; }' +
      '.emain { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }' +
      '.etitle { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.emeta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; white-space: nowrap; overflow: hidden; }' +
      '.emeta .sep { opacity: 0.6; }' +
      '.loc { display: inline-flex; align-items: center; gap: 2px; min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.loc ha-icon { --mdc-icon-size: 13px; flex-shrink: 0; }' +
      '.eprog { height: 3px; border-radius: 2px; margin-top: 3px; background: color-mix(in srgb, var(--c) 20%, transparent); overflow: hidden; }' +
      '.efill { height: 100%; background: var(--c); border-radius: 2px; }' +
      '.cd { flex-shrink: 0; font-size: 11px; font-weight: 500; padding: 1px 8px; border-radius: 12px; white-space: nowrap;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--secondary-text-color); }' +
      '.cd.live { background: var(--c); color: #fff; }' +
      'button { font: inherit; cursor: pointer; border: none; }' +
      '.more { align-self: flex-start; display: inline-flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 500; padding: 4px 8px 4px 2px;' +
        ' border-radius: 10px; background: none; color: var(--primary-color, #03a9f4); }' +
      '.more ha-icon { --mdc-icon-size: 18px; }' +
      '.error { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--error-color, #db4437); }' +
      '.error ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }' +
      '.pop { position: absolute; top: 8px; left: 8px; right: 8px; z-index: 2; display: flex; flex-direction: column; gap: 8px; padding: 12px;' +
        ' border-radius: 12px; background: var(--card-background-color, #fff); color: var(--primary-text-color);' +
        ' box-shadow: 0 6px 24px rgba(0,0,0,0.22), 0 0 0 1px var(--divider-color, rgba(0,0,0,0.12)); animation: cc-in 0.16s ease-out; max-height: calc(100% - 16px); overflow: auto; box-sizing: border-box; }' +
      '@keyframes cc-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }' +
      '@media (prefers-reduced-motion: reduce) { .pop { animation: none; } }' +
      '.phead { display: flex; align-items: flex-start; gap: 10px; }' +
      '.phead .cbar { min-height: 22px; }' +
      '.ptitle { flex: 1; font-size: 16px; font-weight: 500; line-height: 1.3; word-break: break-word; }' +
      '.pclose { all: unset; cursor: pointer; width: 28px; height: 28px; margin: -4px -4px 0 0; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.pclose:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); }' +
      '.pclose ha-icon { --mdc-icon-size: 18px; }' +
      '.prow { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--secondary-text-color); padding-left: 14px; }' +
      '.prow ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }' +
      '.pdot { width: 10px; height: 10px; margin: 0 3px; border-radius: 50%; flex-shrink: 0; }' +
      '.pdesc { font-size: 13px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; color: var(--primary-text-color); padding: 8px 0 0 14px;' +
        ' border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); }' +
      '.zoom { all: unset; flex-shrink: 0; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%;' +
        ' display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.zoom ha-icon { --mdc-icon-size: 16px; }' +
      '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
      '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      'ha-card.mini .logo { width: 32px; height: 32px; }' +
      '.st { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;' +
        ' white-space: nowrap; background: color-mix(in srgb, var(--cc-accent) 15%, transparent); color: var(--cc-accent); }' +
      '.mnext { font-size: 12px; color: var(--secondary-text-color); display: flex; gap: 6px; align-items: center; min-width: 0; white-space: nowrap; overflow: hidden; }' +
      '.mnext b { font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 4px 8px; border-radius: 10px; cursor: pointer; white-space: nowrap; overflow: hidden;' +
        ' font-size: 12px; color: var(--secondary-text-color); background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.mallday:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.mallday:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.mallday b { font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday span:last-child { margin-left: auto; flex-shrink: 0; }' +
      '.mallday .ndot, .mnext .ndot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--c); }' +
    '</style>';
  }
}

// ── Mini card ────────────────────────────────────────────────────────────────
// The next event (or the one under way) and the one after; the detail button unfolds the full card
// and a click anywhere else on the page folds it back, like the other mini cards.
class CalendarAgendaMiniCard extends CalendarAgendaCard {
  static get mini() { return true; }

  static getConfigElement() {
    var el = CalendarAgendaCard.getConfigElement();
    el.mini = true;
    return el;
  }

  getCardSize() { return this._zoomed ? super.getCardSize() : 2; }

  getGridOptions() { return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }; }

  _compact() { return !this._zoomed; }

  _zoomButton() {
    if (this._config.zoom === false) return '';
    var z = !!this._zoomed;
    var label = ccEsc(this._t(z ? 'zoom_out' : 'zoom_in'));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}"><ha-icon icon="${z ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}"></ha-icon></button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
  }

  _miniHtml(days, now) {
    // Upcoming: all-day, ongoing or future events.
    var upcoming = this._flat.filter((x) => x.e.allDay || x.e.end > now);
    // All-day events under way today (school holidays, a public holiday…) get a compact line each, on top.
    var current = upcoming.filter((x) => x.e.allDay && x.e.start <= now && x.e.end > now).slice(0, 3);
    var allDayHtml = current.map((x) => {
      var last = ccAddDays(x.e.end, -1);
      var until = ccKey(last) === ccKey(now) ? this._t('all_day')
        : this._t('until').replace('{d}', this._dateFmt(last, { weekday: 'short', day: 'numeric', month: 'short' }));
      return `<div class="mallday" style="--c:${ccEsc(this._cals[x.e.cal].color)}" data-ev="${this._flat.indexOf(x)}" role="button" tabindex="0">` +
        `<span class="ndot"></span><b>${ccEsc(x.e.summary)}</b><span>${ccEsc(until)}</span></div>`;
    }).join('');
    upcoming = upcoming.filter((x) => current.indexOf(x) < 0);
    // A timed event (under way or next) comes before the day's other all-day ones.
    var first = upcoming.find((x) => !x.e.allDay) || upcoming[0];
    var second = upcoming.find((x) => x !== first && !x.e.allDay) || upcoming.find((x) => x !== first);
    var body;
    if (!first) {
      body = allDayHtml || `<div class="none big">${this._loaded ? this._t('no_upcoming') : ''}</div>`;
    } else {
      var i = this._flat.indexOf(first);
      var isToday = ccKey(first.day) === ccKey(now);
      var html = this._eventHtml(first.e, now, i, isToday);
      if (!isToday && !ccMultiDay(first.e)) {
        // A later day: its date goes in front of the time (a multi-day event already shows its dates).
        var d = ccKey(first.day) === ccKey(ccAddDays(now, 1)) ? this._t('tomorrow') : this._dateFmt(first.day, { weekday: 'short', day: 'numeric', month: 'short' });
        html = html.replace('<div class="emeta">', `<div class="emeta">${ccEsc(d)}<span class="sep">·</span>`);
      }
      body = allDayHtml + html;
      if (second) {
        var cal = this._cals[second.e.cal];
        var when = ccKey(second.day) === ccKey(now) ? this._when(second.e)
          : `${this._dateFmt(second.day, { weekday: 'short' }).replace('.', '')} ${second.e.allDay ? '' : this._timeFmt(second.e.start)}`.trim();
        body += `<div class="mnext" style="--c:${ccEsc(cal.color)}"><span>${this._t('next')}</span><span class="ndot"></span><b>${ccEsc(second.e.summary)}</b><span>${ccEsc(when)}</span></div>`;
      }
    }
    return `<ha-card class="mini${this._detail != null ? ' popped' : ''}">` +
      this._headerHtml(now, this._todaySub(days)) +
      `<div class="list">${body}</div>${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }
}

// ── Visual editor (built on HA's ha-form) ────────────────────────────────────
var CC_EDITOR_DEFAULTS = Object.assign({ zoom: true }, CC_DEFAULTS);

class CalendarAgendaCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    var prevLang = this._hass?.language;
    this._hass = hass;
    if (this._form && prevLang === (hass?.language)) this._form.hass = hass;
    else this._render();
  }

  _lang() {
    var lang = ((this._config?.language) || (this._hass?.language) || 'en').split('-')[0];
    return CcI18n[lang] ? lang : 'en';
  }

  _schema() {
    var mini = this.mini || /-mini-card$/.test(this._config.type || '');
    return [
      { name: 'entities', selector: { entity: { domain: 'calendar', multiple: true } } },
      { name: 'title', selector: { text: {} } },
      {
        type: 'grid', name: '', schema: [
          { name: 'days_to_show', selector: { number: { min: 1, max: 62, mode: 'box' } } },
          { name: 'max_events', selector: { number: { min: 0, max: 100, mode: 'box' } } },
        ],
      },
      {
        type: 'grid', name: '', schema: [
          { name: 'show_header', selector: { boolean: {} } },
          { name: 'show_location', selector: { boolean: {} } },
          { name: 'show_end_time', selector: { boolean: {} } },
          { name: 'show_countdown', selector: { boolean: {} } },
          { name: 'show_empty_days', selector: { boolean: {} } },
          { name: 'show_past_events', selector: { boolean: {} } },
        ].concat(mini ? [{ name: 'zoom', selector: { boolean: {} } }] : []),
      },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }] } },
      },
    ];
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', (ev) => this._valueChanged(ev));
      this.appendChild(this._form);
    }
    var lang = this._lang();
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => ccT(lang, `ed_${s.name}`);
    this._form.computeHelper = (s) => {
      var key = `ed_${s.name}_helper`;
      var txt = ccT(lang, key);
      return txt === key ? undefined : txt;
    };
    var data = Object.assign({}, CC_EDITOR_DEFAULTS, this._config);
    // The form edits entity ids; colors and names set in YAML are kept aside.
    data.entities = (this._config.entities || []).map((e) => (typeof e === 'string' ? e : e.entity));
    this._form.data = data;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    var value = Object.assign({}, ev.detail.value);
    Object.keys(value).forEach((key) => {
      if (value[key] === '' || value[key] === null || value[key] === undefined) delete value[key];
    });
    Object.keys(CC_EDITOR_DEFAULTS).forEach((key) => {
      if (value[key] === CC_EDITOR_DEFAULTS[key]) delete value[key];
    });
    // Put back the YAML settings (color, name) of the calendars still listed.
    var prev = {};
    (this._config.entities || []).forEach((e) => { if (typeof e === 'object' && e) prev[e.entity] = e; });
    if (value.entities) value.entities = value.entities.map((id) => prev[id] || id);
    if (this._config.exclude) value.exclude = this._config.exclude;
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    var lang = this._lang();
    this._config = value;
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('calendar-agenda-card-editor')) {
  customElements.define('calendar-agenda-card-editor', CalendarAgendaCardEditor);
}

window.customCards = window.customCards || [];
[
  ['calendar-agenda-card', CalendarAgendaCard, 'Calendar Agenda Card', 'Agenda of one or more Home Assistant calendars, grouped by day'],
  ['calendar-agenda-mini-card', CalendarAgendaMiniCard, 'Calendar Agenda Mini Card', 'Next event and the one after, unfolds into the full agenda'],
].forEach(([type, cls, name, description]) => {
  if (customElements.get(type)) return;
  customElements.define(type, cls);
  window.customCards.push({ type, name, description, preview: true, documentationURL: 'https://github.com/juju35/ha-calendar-card' });
});

console.info(`%c CALENDAR-CARD %c v${CALENDAR_CARD_VERSION} `, 'color:#fff;background:#039be5;font-weight:700', 'color:#039be5;background:#fff');
