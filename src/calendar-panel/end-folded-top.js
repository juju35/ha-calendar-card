// ── End of the folded top bar ──
import { CC_MONTH_MAX, CC_PANEL_HIDDEN, CC_PANEL_VIEWS, ccRule } from "./sidebar-panel.js";
import { calendarPanelFold } from "./core.js";

export class CalendarPanel extends CalendarAgendaCard {
  constructor() {
    super();
    this._view = 'month';
    this._hidden = new Set();
    try {
      var saved = JSON.parse(window.localStorage.getItem(CC_PANEL_HIDDEN) || '[]');
      if (Array.isArray(saved)) this._hidden = new Set(saved.map(String));
    } catch (_e) {
      /* private mode: every calendar shows */
    }
  }

  // Home Assistant gives a panel its `panel` (with the YAML `config`), `route`, `narrow` and `hass`.
  set panel(panel) {
    this._panel = panel;
    if (this._viewSet == null && CC_PANEL_VIEWS.indexOf(panel?.config?.default_view) >= 0) this._view = panel.config.default_view;
    this._applyConfig();
  }

  get panel() { return this._panel; }

  set route(route) {
    this._route = route;
    var view = String(route?.path || '').split('/')[1];
    if (CC_PANEL_VIEWS.indexOf(view) >= 0 && view !== this._view) {
      this._view = view;
      this._viewSet = true;
      this._update();
    }
  }

  get route() { return this._route; }

  set narrow(narrow) {
    this._narrow = !!narrow;
    this._syncMenu();
  }

  get narrow() { return this._narrow; }

  set hass(hass) {
    this._hass = hass;
    if (!this._applyConfig()) this._update();
  }

  get hass() { return this._hass; }

  // The panel's options, with `entities` defaulting to every calendar (but the school holidays one), by name like
  // Home Assistant's panel. setConfig again only when that changes. True when it did (it rendered).
  _applyConfig() {
    var c = Object.assign({}, this._panel?.config || {});
    delete c.default_view;
    if (!c.entities && !c.entity) {
      if (!this._hass) return false;
      var st = this._hass.states || {};
      c.entities = Object.keys(st).filter((id) => id.indexOf('calendar.') === 0 && id !== c.school_holidays_calendar)
        .sort((a, b) => String(st[a].attributes?.friendly_name || a).localeCompare(String(st[b].attributes?.friendly_name || b)));
    }
    var sig = JSON.stringify(c);
    if (sig === this._applied) return false;
    this._applied = sig;
    this.setConfig(c);
    return true;
  }

  _update() {
    super._update();
    this._syncMenu();
  }

  // The sidebar button (narrow screens) needs hass and narrow as properties.
  _syncMenu() {
    var btn = this.shadowRoot?.querySelector('ha-menu-button');
    if (!btn) return;
    btn.hass = this._hass;
    btn.narrow = this._narrow;
  }

  // ── The range shown ──
  _anchorDay() { return this._anchor || ccDayStart(this._now()); }

  // First day of the week: the profile's setting, else the language's (Intl week info), else Monday.
  _weekStart() {
    var fw = this._hass?.locale?.first_weekday;
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (days.indexOf(fw) >= 0) return days.indexOf(fw);
    try {
      var loc = new Intl.Locale(this._fmtLang());
      var info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
      if (info?.firstDay) return info.firstDay % 7;
    } catch (_e) { /* no week info: Monday */ }
    return 1;
  }

  _startOfWeek(d) { return ccAddDays(d, -((d.getDay() - this._weekStart() + 7) % 7)); }

  _range() {
    var a = this._anchorDay();
    if (this._view === 'day') return { from: a, days: 1 };
    if (this._view === 'month') {
      var from = this._startOfWeek(new Date(a.getFullYear(), a.getMonth(), 1));
      var last = new Date(a.getFullYear(), a.getMonth() + 1, 0);
      return { from: from, days: ccDaysBetween(ccIso(from), ccIso(this._startOfWeek(last))) + 7 };
    }
    return { from: this._startOfWeek(a), days: 7 };
  }

  _from() { return this._range().from; }

  _days() { return this._range().days; }

  _week() { return false; }

  _offKey() { return `${this._view}|${ccKey(this._range().from)}|${this._range().days}`; }

  _viewKey() { return `${this._offKey()}|${[...this._hidden].join(',')}`; }

  _inRange(day) {
    var r = this._range();
    return day >= r.from && day < ccAddDays(r.from, r.days);
  }

  _move(step) {
    var a = this._anchorDay();
    if (this._view === 'month') this._anchor = new Date(a.getFullYear(), a.getMonth() + step, 1);
    else this._anchor = ccAddDays(a, step * (this._view === 'day' ? 1 : 7));
    this._detail = null;
  }

  _setView(view, day) {
    if (CC_PANEL_VIEWS.indexOf(view) < 0) return;
    this._view = view;
    this._viewSet = true;
    if (day) this._anchor = day;
    this._detail = null;
    var prefix = this._route?.prefix;
    if (prefix && globalThis.history?.replaceState) {
      try {
        history.replaceState(history.state, '', `${prefix}/${view}`);
      } catch (_e) { /* no history (embedded page): the view still changes */ }
    }
  }

  // ── Events ──
  _shownCal(i) {
    var cal = this._cals?.[i];
    return !!cal && !this._hidden.has(cal.entity);
  }

  _shown(events) {
    return events.filter((e) => this._shownCal(e.cal) && !ccExcluded(e, this._config.exclude));
  }

  // Each day of the range with every event that covers it (a multi-day event on each of its days), in order.
  _buckets() {
    var r = this._range();
    var events = this._shown(this._events);
    var out = [];
    for (var i = 0; i < r.days; i++) {
      var ds = ccAddDays(r.from, i), de = ccAddDays(r.from, i + 1);
      out.push({ date: ds, events: events.filter((e) => e.start < de && (e.end > ds || (+e.end === +e.start && e.start >= ds))).sort(ccSort) });
    }
    return out;
  }

  // Today's events for the header, from the range when it holds today, else fetched on their own.
  _todayEvents(now) {
    var today = ccDayStart(now);
    var list = this._inRange(today) ? this._events : this._todayList || [];
    var end = ccAddDays(today, 1);
    return this._shown(list).filter((e) => e.start < end && e.end > today);
  }

  async _fetchToday(cals, now) {
    var tz = this._tz();
    var today = ccDayStart(now);
    var key = JSON.stringify([cals.map((c) => c.entity), ccKey(today), tz, cals.map((c) => this._hass.states[c.entity]?.last_changed || '')]);
    if (key === this._todayKey && Date.now() - (this._todayAt || 0) < CC_REFRESH) return;
    this._todayKey = key;
    this._todayAt = Date.now();
    var seq = (this._todaySeq = (this._todaySeq || 0) + 1);
    var q = `?start=${encodeURIComponent(ccOutZone(today, tz).toISOString())}&end=${encodeURIComponent(ccOutZone(ccAddDays(today, 1), tz).toISOString())}`;
    var res = await Promise.allSettled(cals.map((c) => this._hass.callApi('GET', `calendars/${c.entity}${q}`)));
    if (seq !== this._todaySeq) return;
    this._todayList = res.flatMap((r, i) => (r.status === 'fulfilled' ? ccParseAll(r.value, i, tz) : []));
    this._sig = null;
    this._update();
  }

  _status(now) {
    if (this._failed.length) return 'error';
    var events = this._todayEvents(now);
    if (events.some((e) => !e.allDay && e.start <= now && e.end > now)) return 'now';
    return events.some((e) => e.allDay || e.start > now) ? 'upcoming' : 'free';
  }

  _todayCount(now) {
    var n = this._todayEvents(now).filter((e) => e.allDay || e.end > now).length;
    return n ? ccCount(this._lang(), 'event_today', 'events_today', n) : this._t('none_today');
  }

  // ── Forms: the new event's day, and a repeat rule ──
  _openForm(e, day) {
    super._openForm(e);
    var f = this._form;
    var rule = ccRule(e?.rrule);
    f.freq = rule.freq;
    f.until = rule.until;
    day = day || (!e && this._view === 'day' ? this._anchorDay() : null);
    if (!e && day && ccKey(day) !== ccKey(this._now())) Object.assign(f, { date: ccIso(day), start: '09:00', end: '10:00' });
  }

  _onField(ev) {
    super._onField(ev);
    if (ev.target?.dataset?.f === 'freq' && this._form) this._redrawForm();
  }

  // The form's repeat rule: '' (none), the rule kept as it is (custom), or FREQ with its UNTIL (a date for an all-day
  // event, the end of that day in UTC otherwise).
  _rrule() {
    var f = this._form;
    if (!f.freq) return '';
    if (f.freq === 'custom') return f.edit?.rrule || '';
    if (!ccDateOk(f.until)) return `FREQ=${f.freq}`;
    var until = f.all_day ? f.until.replace(/-/g, '') : `${ccUtc(f.until, '23:59', this._tz()).slice(0, 19).replace(/[-:]/g, '')}Z`;
    return `FREQ=${f.freq};UNTIL=${until}`;
  }

  _formHtml() {
    var html = super._formHtml();
    var f = this._form;
    var opts = [['', 'rep_none'], ['DAILY', 'rep_daily'], ['WEEKLY', 'rep_weekly'], ['MONTHLY', 'rep_monthly'], ['YEARLY', 'rep_yearly']]
      .concat(f.freq === 'custom' ? [['custom', 'rep_custom']] : [])
      .map(([v, k]) => `<option value="${v}"${f.freq === v ? ' selected' : ''}>${ccEsc(this._t(k))}</option>`).join('');
    var until = f.freq && f.freq !== 'custom'
      ? `<label class="ff ff-until"><span>${ccEsc(this._t('rep_until'))}</span><input type="date" data-f="until" value="${ccEsc(f.until)}"></label>` : '';
    var field = `<div class="frow"><label class="ff ff-repeat"><span>${ccEsc(this._t('repeat'))}</span><select data-f="freq">${opts}</select></label>${until}</div>`;
    return html.replace('<label class="ff ff-location">', `${field}<label class="ff ff-location">`);
  }

  async _saveForm(range) {
    var f = this._form;
    // An end of repeat before the first day.
    if (f && !f.busy && f.freq && f.freq !== 'custom' && ccDateOk(f.until) && ccDateOk(f.date) && f.until < f.date) {
      f.error = this._t('ev_bad_end');
      return this._redrawForm();
    }
    return super._saveForm(range);
  }

  _createEvent(cal) {
    var rule = this._rrule();
    if (!rule) return super._createEvent(cal);
    var d = this._eventData();
    var event = { summary: d.summary, dtstart: d.start_date || d.start_date_time, dtend: d.end_date || d.end_date_time, rrule: rule };
    if (d.location) event.location = d.location;
    if (d.description) event.description = d.description;
    return this._hass.callWS({ type: 'calendar/event/create', entity_id: cal.entity, event: event });
  }

  // The series (or this event and the following ones) takes the form's repeat rule; one instance alone cannot.
  _updateMsg(entity, range) {
    var msg = super._updateMsg(entity, range);
    if (!this._form.edit.recurrence_id || range === CC_FUTURE) {
      var rule = this._rrule();
      if (rule) msg.event.rrule = rule;
      else delete msg.event.rrule;
    }
    return msg;
  }

  // ── Drawing ──
  _render(cals, now) {
    var folded = Boolean(this.hasAttribute?.('pf-folded'));
    this._fold?.detach();
    this._fold = null;
    this._drawPage(cals, now);
    this._attachFold(folded);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._fold?.detach();
    this._fold = null;
  }

  /** The top bar folds on scroll into one bar with the views as icon pills (see calendarPanelFold). */
  _attachFold(folded = false) {
    this._fold?.detach();
    this._fold = calendarPanelFold(this, {
      top: '.banner',
      tabs: '.tabbar',
      tab: '.tab',
      key: (b) => b.dataset.view,
      icons: { month: 'mdi:calendar-month', week: 'mdi:calendar-week', day: 'mdi:calendar-today', list: 'mdi:format-list-bulleted' },
      badge: '.cnt',
      name: '.banner .name',
      icon: '.banner .logo',
      status: '.banner .st',
      acts: '.banner .hbtns > *',
      side: '.tabbar .nav',
      accent: '#5b6cf0',
      css: '.pf-end .nav { display:flex; align-items:center; gap:4px; max-width:none; } .pf-end .nav .prange { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px; }' +
        '@container (max-width: 600px) { .pf-end .nav .prange, .pf-end .nav .wtoday { display:none; } }',
      folded,
      menu: () => ({ hass: this._hass, narrow: this._narrow, show: true }),
    });
  }

  _drawPage(cals, now) {
    var accent = cals[0]?.color || CC_COLORS[0];
    var styles = this._styles(accent).replace('</style>', `${CC_PANEL_STYLE}</style>`);
    if (!cals.length) {
      this.shadowRoot.innerHTML = `${styles}<div class="panel" lang="${ccEsc(this._fmtLang())}">${this._panelHeader(now)}` +
        `<div class="page"><div class="box empty"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon>${this._t('no_calendar')}</div></div></div>`;
      return;
    }
    if (!this._inRange(ccDayStart(now))) this._fetchToday(cals, now);
    var days = this._buckets();
    this._flat = [];
    var firsts = days.map((d) => {
      var at = this._flat.length;
      d.events.forEach((e) => {
        this._flat.push({ e: e, day: d.date });
      });
      return at;
    });
    if (this._detail != null && this._evIndex(this._detail) < 0) this._detail = null;
    var body = { month: this._monthHtml, week: this._weekHtml, day: this._dayViewHtml, list: this._listHtml }[this._view].call(this, days, firsts, now);
    var pop = this._popupHtml();
    this.shadowRoot.innerHTML = `${styles}<div class="panel" lang="${ccEsc(this._fmtLang())}">${this._panelHeader(now)}${this._tabBar(days)}` +
      `<div class="page">${this._calChips()}${this._errorHtml()}<div class="weekwrap view-${this._view}">${body}</div></div>` +
      (pop ? `<div class="backdrop">${pop}</div>` : '') + '</div>';
  }

  // The cards' illustrated header across the page: the menu button, the calendar icon in the status colour, the
  // title with today's counter and the badges, the buttons, then the desk and today's tear-off calendar.
  _panelHeader(now) {
    var html = this._bannerHtml(now, this._todayCount(now));
    var label = (k) => ccEsc(this._t(k));
    var btns = `<button class="hbtn" data-action="refresh" title="${label('refresh')}" aria-label="${label('refresh')}"><ha-icon icon="mdi:refresh"></ha-icon></button>` +
      (this._config.add_button !== false && this._writable().length
        ? `<button class="hbtn addb" data-action="add" title="${label('add_event')}" aria-label="${label('add_event')}"><ha-icon icon="mdi:plus"></ha-icon></button>` : '');
    return html.replace('<div class="logo"', '<ha-menu-button></ha-menu-button><div class="logo"')
      .replace(/<div class="hbtns">[\s\S]*<\/div><\/div>$/, `<div class="hbtns">${btns}</div></div>`);
  }

  // Month, Week, Day and List, the active one underlined; Today and the arrows with the range at their right.
  _tabBar(days) {
    var tabs = CC_PANEL_VIEWS.map((v) => {
      var on = v === this._view;
      return `<button class="tab" role="tab" data-action="view" data-view="${v}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${ccEsc(this._t(`view_${v}`))}</button>`;
    }).join('');
    var btn = (action, label, icon) => `<button class="wbtn" data-action="${action}" title="${ccEsc(this._t(label))}" aria-label="${ccEsc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon></button>`;
    var today = this._inRange(ccDayStart(this._now()));
    return `<div class="tabbar"><div class="tabs" role="tablist" aria-label="${ccEsc(this._t('ed_view'))}">${tabs}</div>` +
      `<div class="nav"><button class="wtoday" data-action="nav-today"${today ? ' disabled' : ''}>${ccEsc(this._t('today'))}</button>` +
      `${btn('nav-prev', 'prev_period', 'mdi:chevron-left')}${btn('nav-next', 'next_period', 'mdi:chevron-right')}` +
      `<span class="prange" aria-live="polite">${ccEsc(this._rangeLabel(days))}</span></div></div>`;
  }

  _cap(s) { return s.charAt(0).toLocaleUpperCase(this._fmtLang()) + s.slice(1); }

  _rangeLabel(days) {
    var a = this._anchorDay();
    if (this._view === 'month') return this._cap(this._dateFmt(new Date(a.getFullYear(), a.getMonth(), 1), { month: 'long', year: 'numeric' }));
    if (this._view === 'day') return this._cap(this._dateFmt(a, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    var first = days[0].date, last = days[days.length - 1].date;
    var fmt = new Intl.DateTimeFormat(this._fmtLang(), { day: 'numeric', month: 'short', year: 'numeric' });
    return typeof fmt.formatRange === 'function' ? fmt.formatRange(first, last) : `${fmt.format(first)} – ${fmt.format(last)}`;
  }

  // One toggle per calendar (its colour, its name), like the list of Home Assistant's panel. Only with 2+.
  _calChips() {
    if ((this._cals || []).length < 2) return '';
    return `<div class="cals" role="group" aria-label="${ccEsc(this._t('ed_entities'))}">${this._cals.map((c) => {
      var on = !this._hidden.has(c.entity);
      return `<button class="calb" data-action="cal" data-entity="${ccEsc(c.entity)}" aria-pressed="${on}" style="--c:${ccEsc(c.color)}"><span class="sw"></span>${ccEsc(c.name)}</button>`;
    }).join('')}</div>`;
  }

  _evAttrs(e, idx, now, cls) {
    var cal = this._cals[e.cal];
    var past = !e.allDay && e.end <= now;
    return `class="${cls}${past ? ' past' : ''}" style="--c:${ccEsc(cal.color)};--c-on:${ccEsc(ccOnColor(cal.color))}" data-ev="${idx}" role="button" tabindex="0" title="${ccEsc(`${this._when(e)} · ${e.summary}`)}"`;
  }

  _monthHtml(days, firsts, now) {
    var month = this._anchorDay().getMonth();
    var today = ccKey(now);
    var heads = days.slice(0, 7).map((d) => `<div class="mwd">${ccEsc(this._wdShort(d.date))}</div>`).join('');
    var cells = days.map((d, di) => {
      var key = ccKey(d.date);
      var evs = d.events.slice(0, d.events.length > CC_MONTH_MAX ? CC_MONTH_MAX - 1 : CC_MONTH_MAX).map((e, i) => {
        var bar = e.allDay || ccMultiDay(e);
        var time = bar ? '' : `<span class="mt">${ccEsc(this._timeFmt(e.start))}</span>`;
        return `<div ${this._evAttrs(e, firsts[di] + i, now, bar ? 'mev bar' : 'mev')}>${bar ? '' : '<span class="md"></span>'}${time}<span class="ms">${ccEsc(e.summary)}</span></div>`;
      }).join('');
      var rest = d.events.length - (d.events.length > CC_MONTH_MAX ? CC_MONTH_MAX - 1 : CC_MONTH_MAX);
      var more = rest > 0 ? `<button class="mmore" data-action="goto-day" data-day="${key}">+${rest}</button>` : '';
      var dots = d.events.slice(0, 4).map((e) => `<span class="mdot" style="--c:${ccEsc(this._cals[e.cal].color)}"></span>`).join('');
      var hol = this._holidayOn(d.date);
      var label = this._dateFmt(d.date, { weekday: 'long', day: 'numeric', month: 'long' });
      return `<div class="mcell${d.date.getMonth() !== month ? ' out' : ''}${key === today ? ' today' : ''}${hol ? ' hol' : ''}" data-action="cell" data-day="${key}"${hol ? ` title="${ccEsc(hol.summary || this._t('school_holidays'))}"` : ''}>` +
        `<button class="mday" data-action="goto-day" data-day="${key}" aria-label="${ccEsc(label)}">${d.date.getDate()}</button>` +
        `<div class="mevs">${evs}${more}</div><div class="mdots">${dots}</div></div>`;
    }).join('');
    return `<div class="box month"><div class="mhead">${heads}</div><div class="mgrid">${cells}</div></div>`;
  }

  _weekHtml(days, firsts, now) {
    return `<div class="box pweek"><div class="week">${days.map((d, i) => this._weekColHtml(d, d.events, now, firsts[i])).join('')}</div></div>`;
  }

  _dayViewHtml(days, firsts, now) {
    return `<div class="box plist">${this._dayHtml(days[0], days[0].events, now, firsts[0], false)}</div>`;
  }

  _listHtml(days, firsts, now) {
    var rows = days.map((d, i) => (d.events.length ? this._dayHtml(d, d.events, now, firsts[i], false) : '')).join('');
    return `<div class="box plist">${rows || `<div class="none big">${this._t('no_events')}</div>`}</div>`;
  }

  _onSwipe(ev) {
    var start = this._swipe;
    this._swipe = null;
    if (!start || this._detail != null || this._adding) return;
    var dx = ev.clientX - start.x, dy = ev.clientY - start.y;
    if (Math.abs(dx) < CC_SWIPE || Math.abs(dx) < 2 * Math.abs(dy)) return;
    this._move(dx < 0 ? 1 : -1);
    this._swiped = Date.now();
    this._update();
  }

  _onClick(ev) {
    var path = ev.composedPath();
    var hit = path.find((n) => n.dataset && (n.dataset.action || n.dataset.ev != null));
    var d = hit?.dataset;
    if (this._adding || !d) return super._onClick(ev);
    if (this._swiped && Date.now() - this._swiped < 400) {
      this._swiped = 0;
      return;
    }
    if (d.ev != null && !d.action) {
      this._toggleDetail(d.ev);
      return;
    }
    // A click under the popup (on the page behind it) closes it.
    if (this._detail != null && !path.some((n) => n.classList?.contains('pop'))) {
      this._detail = null;
      this._update();
      return;
    }
    var day = d.day ? ccLocalDate(d.day) : null;
    switch (d.action) {
      case 'view': this._setView(d.view); break;
      case 'nav-prev': this._move(-1); break;
      case 'nav-next': this._move(1); break;
      case 'nav-today': this._anchor = null; this._detail = null; break;
      case 'goto-day': this._setView('day', day); break;
      case 'refresh': this._todayKey = null; this._refetch(); return;
      case 'cell': {
        // A day of the month: a new event on it (wide page, a calendar that accepts one), else its day view.
        var wide = (this.shadowRoot.querySelector('.weekwrap')?.clientWidth || 0) >= 600;
        if (wide && this._config.add_button !== false && this._writable().length) this._openForm(null, day);
        else this._setView('day', day);
        break;
      }
      case 'cal': {
        var id = d.entity;
        if (this._hidden.has(id)) this._hidden.delete(id);
        else this._hidden.add(id);
        try {
          window.localStorage.setItem(CC_PANEL_HIDDEN, JSON.stringify([...this._hidden]));
        } catch (_e) { /* private mode: until the page is reloaded */ }
        break;
      }
      default: return super._onClick(ev);
    }
    this._update();
    if (d.action === 'view' && ev.detail === 0) this.shadowRoot.querySelector('.tab[aria-selected="true"]')?.focus({ preventScroll: true });
  }

  _onKey(ev) {
    // Tabs: arrows, Home and End move between them (WAI-ARIA tabs pattern).
    if (!this._adding && this._detail == null && ev.target?.classList?.contains('tab')) {
      var i = CC_PANEL_VIEWS.indexOf(this._view);
      var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CC_PANEL_VIEWS.length - 1 }[ev.key];
      if (next !== undefined) {
        ev.preventDefault();
        this._setView(CC_PANEL_VIEWS[(next + CC_PANEL_VIEWS.length) % CC_PANEL_VIEWS.length]);
        this._update();
        this.shadowRoot.querySelector('.tab[aria-selected="true"]')?.focus({ preventScroll: true });
        return;
      }
    }
    super._onKey(ev);
  }
}

export var CC_PANEL_STYLE =
  ':host { display: block; height: auto; min-height: 100vh; background: var(--primary-background-color); color: var(--primary-text-color); }' +
  '.panel { position: relative; min-height: 100vh; }' +
  // The cards' banner across the page: no card corners, a larger title and icon, the menu button at its left.
  '.banner { margin: 0; border-radius: 0; padding: 0 16px 10px 4px; gap: 12px; }' +
  '.banner > .titles { margin-right: 240px; }' +
  '.banner .logo { width: 44px; height: 44px; } .banner .logo ha-icon { --mdc-icon-size: 26px; }' +
  '.banner .name { font-size: 20px; }' +
  'ha-menu-button { flex: none; color: inherit; position: relative; z-index: 1; }' +
  // The buttons at the left of the desk scene, centred on the banner (above its desk strip).
  '.hbtns { top: calc((100% - 10px) / 2 - 16px); right: 162px; gap: 6px; }' +
  '.hbtns .hbtn { all: unset; box-sizing: border-box; display: grid; place-items: center; cursor: pointer; width: 32px; height: 32px; border-radius: 50%;' +
  ' color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); --mdc-icon-size: 18px; }' +
  '.hbtns .hbtn ha-icon { --mdc-icon-size: 18px; display: flex; }' +
  '.hbtns .hbtn:hover { background: rgba(255,255,255,.75); }' +
  '.night .hbtns .hbtn { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }' +
  '.night .hbtns .hbtn:hover { background: rgba(255,255,255,.22); }' +
  '.hbtns .hbtn:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }' +
  // A phone: the buttons go back to the banner's top-right corner, as on the cards.
  '@container cc-head (max-width: 560px) { .hbtns { top: 5px; right: 5px; gap: 4px; } .hbtns .hbtn { width: 28px; height: 28px; } .banner > .titles { margin-right: 146px; } }' +
  '@container cc-head (max-width: 300px) { .banner > .titles { margin-right: 70px; } }' +
  // Text tabs under the banner, the active one underlined; Today, the arrows and the range at their right.
  '.tabbar { display: flex; align-items: center; flex-wrap: wrap; gap: 0 12px; padding: 0 12px; position: sticky; top: 0; z-index: 3;' +
  ' background: var(--primary-background-color); border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.12)); }' +
  '.tabs { display: flex; gap: 4px; min-width: 0; overflow-x: auto; scrollbar-width: none; }' +
  '.tab { all: unset; cursor: pointer; padding: 12px 10px 10px; font-size: 14px; font-weight: 500; white-space: nowrap; color: var(--secondary-text-color); border-bottom: 2px solid transparent; }' +
  '.tab[aria-selected="true"] { color: var(--primary-text-color); border-bottom-color: var(--cc-accent); }' +
  '.tab:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: -2px; }' +
  '.nav { display: flex; align-items: center; gap: 4px; margin-left: auto; min-width: 0; padding: 6px 0; }' +
  '.prange { font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; margin-left: 4px; }' +
  '.wtoday[disabled] { opacity: .5; cursor: default; }' +
  '.page { max-width: 1400px; margin: 0 auto; padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; }' +
  '.box { background: var(--ha-card-background, var(--card-background-color, #fff)); border-radius: var(--ha-card-border-radius, 12px);' +
  ' border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0)); overflow: hidden; }' +
  '.box.empty { padding: 16px; }' +
  // Calendar toggles: a colour swatch (hollow when hidden) and the name.
  '.cals { display: flex; flex-wrap: wrap; gap: 8px; }' +
  '.calb { all: unset; cursor: pointer; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 12px 0 10px; border-radius: 18px; font-size: 13px;' +
  ' color: var(--primary-text-color); background: var(--card-background-color, #fff); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); }' +
  '.calb .sw { width: 12px; height: 12px; border-radius: 4px; background: var(--c); flex: none; }' +
  '.calb[aria-pressed="false"] { color: var(--secondary-text-color); border-color: var(--divider-color, #e0e0e0); }' +
  '.calb[aria-pressed="false"] .sw { background: transparent; box-shadow: inset 0 0 0 2px var(--c); }' +
  '.calb:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
  // Month: the weekdays, then the weeks; days of the other months dimmed, today's number on the accent.
  '.mhead, .mgrid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }' +
  '.mwd { padding: 8px 6px 6px; font-size: 11px; font-weight: 500; text-transform: uppercase; color: var(--secondary-text-color); text-align: center; border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.12)); }' +
  '.mgrid { grid-auto-rows: minmax(112px, auto); }' +
  '.mcell { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 4px; cursor: pointer;' +
  ' border-right: 1px solid var(--divider-color, rgba(0,0,0,.12)); border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.12)); }' +
  '.mcell:nth-child(7n) { border-right: none; } .mcell:nth-last-child(-n+7) { border-bottom: none; }' +
  '.mcell:hover { background: color-mix(in srgb, var(--primary-text-color) 3%, transparent); }' +
  '.mcell.out { background: color-mix(in srgb, var(--primary-text-color) 3%, transparent); }' +
  '.mcell.out .mday { color: var(--secondary-text-color); opacity: .7; }' +
  '.mcell.hol { box-shadow: inset 0 -2px 0 var(--cc-hol); }' +
  '.mday { all: unset; cursor: pointer; align-self: center; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; font-size: 13px; font-weight: 500; color: var(--primary-text-color); }' +
  '.mday:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }' +
  '.mday:focus-visible { outline: 2px solid var(--cc-accent); }' +
  '.mcell.today .mday { background: var(--cc-accent); color: var(--cc-accent-on); }' +
  '.mevs { display: flex; flex-direction: column; gap: 2px; min-width: 0; }' +
  '.mev { display: flex; align-items: center; gap: 4px; min-width: 0; padding: 1px 6px; border-radius: 6px; font-size: 12px; line-height: 18px; white-space: nowrap; overflow: hidden; color: var(--primary-text-color); }' +
  '.mev:hover { background: color-mix(in srgb, var(--c) 14%, transparent); }' +
  '.mev.bar { background: var(--c); color: var(--c-on); } .mev.bar:hover { filter: brightness(1.06); }' +
  '.mev.past { opacity: .55; }' +
  '.mev:focus-visible { outline: 2px solid var(--cc-accent); outline-offset: 1px; }' +
  '.mev .md { width: 7px; height: 7px; border-radius: 50%; background: var(--c); flex: none; }' +
  '.mev .mt { flex: none; font-variant-numeric: tabular-nums; color: var(--secondary-text-color); }' +
  '.mev .ms { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }' +
  '.mmore { all: unset; cursor: pointer; align-self: flex-start; padding: 0 6px; border-radius: 6px; font-size: 12px; font-weight: 500; line-height: 18px; color: var(--secondary-text-color); }' +
  '.mmore:hover { color: var(--primary-text-color); background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }' +
  '.mmore:focus-visible { outline: 2px solid var(--cc-accent); }' +
  '.mdots { display: none; justify-content: center; gap: 3px; }' +
  '.mdot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); }' +
  // A narrow page: a dot per event in each day, the day view a tap away.
  '@container (max-width: 599px) { .mgrid { grid-auto-rows: minmax(56px, auto); } .mevs { display: none; } .mdots { display: flex; } .mcell { align-items: center; } }' +
  // Week: the cards' 7 columns, tall, separated by a line.
  '.pweek .week { gap: 0; }' +
  '.pweek .wcol { min-height: 60vh; padding: 8px 6px; border-radius: 0; }' +
  '.pweek .wcol + .wcol { border-left: 1px solid var(--divider-color, rgba(0,0,0,.12)); }' +
  '.pweek .wev { font-size: 13px; padding: 4px 8px; }' +
  '@container (max-width: 719px) { .pweek .wcol { min-height: 0; padding: 8px 12px; } .pweek .wcol + .wcol { border-left: none; border-top: 1px solid var(--divider-color, rgba(0,0,0,.12)); } }' +
  // Day and List: the cards' day rows.
  '.plist { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }' +
  // Popups at the top of the page, over a dimmed page.
  '.backdrop { position: fixed; inset: 0; z-index: 5; display: flex; justify-content: center; align-items: flex-start; padding: 72px 16px 16px; box-sizing: border-box; background: rgba(0,0,0,.32); }' +
  '.backdrop .pop { position: relative; top: auto; left: auto; right: auto; width: min(520px, 100%); max-height: 100%; }' +
  '.form .frow > .ff { min-width: 140px; }' +
  '@media (max-width: 600px) { .page { padding: 8px; gap: 8px; } .backdrop { padding: 56px 8px 8px; } }';

if (!customElements.get('calendar-agenda-panel')) customElements.define('calendar-agenda-panel', CalendarPanel);
