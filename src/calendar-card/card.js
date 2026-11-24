// ── Card ─────────────────────────────────────────────────────────────────────
import { ccCount, ccEsc, ccFmtLang, ccLang, ccMorph, ccT, ccTextWidth } from "./i18n-helpers.js";
import { CC_COLORS, CC_CREATE, CC_DEFAULTS, CC_DELETE, CC_FUTURE, CC_REFRESH, CC_SWIPE, CC_UPDATE, ccAddDays, ccByDay, ccCalList, ccCalendars, ccDateOk, ccDayStart, ccDaysBetween, ccDedupe, ccDue, ccEvKey, ccExcluded, ccFormTimes, ccHm, ccInZone, ccIso, ccKey, ccLocalDate, ccOnColor, ccOutZone, ccParse, ccParseAll, ccServerZone, ccSort, ccTimeOk, ccTodoLists, ccUtc, ccWorkday } from "./calendars-events.js";
import { ccLogo } from "./header-logo.js";
import { CC_SCENE_STYLE, CC_STATUS_COLOR, ccInDialog, ccIsNight, ccSceneSvg, ccWatchOutside } from "./illustrated-header.js";

export var ccUid = 0;

export class CalendarAgendaCard extends HTMLElement {
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
    this._uid = ++ccUid;
    // Popup, "more" section and mini card fold back on a click anywhere else on the page.
    this._onOutside = (ev) => {
      if (ev.composedPath().includes(this) || ccInDialog(ev)) return;
      // The new event form stays open: a click elsewhere would lose what was typed.
      if (this._adding) return;
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
    var ccIds = (c) => JSON.stringify(ccCalList(c).map((x) => (typeof x === 'string' ? x : x?.entity)));
    if (prev && ccIds(prev) !== ccIds(this._config)) {
      this._events = [];
      this._loaded = false;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (ev) => this._onClick(ev));
      this.shadowRoot.addEventListener('keydown', (ev) => this._onKey(ev));
      // The form's fields are kept on the card as they are typed: a render puts them back.
      this.shadowRoot.addEventListener('input', (ev) => this._onField(ev));
      this.shadowRoot.addEventListener('change', (ev) => this._onField(ev));
      // Week view: a horizontal swipe over the days shows the previous or the next week.
      this.shadowRoot.addEventListener('pointerdown', (ev) => {
        this._swipe = ev.composedPath().some((n) => n.classList?.contains('weekwrap')) ? { x: ev.clientX, y: ev.clientY } : null;
      });
      this.shadowRoot.addEventListener('pointerup', (ev) => this._onSwipe(ev));
    }
    this._sig = null;
    this._fetchKey = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  // The open event's key (see _evKeyAt). Another event, or none, drops the delete confirmation and its
  // error: reopening the event shows its details, not the old confirmation. The popup stays busy only
  // for an event whose delete is still pending (`_deleting`), so it cannot be deleted twice.
  get _detail() { return this._detailKey; }

  set _detail(key) {
    if (key !== this._detailKey) {
      this._confirm = null;
      this._popErr = '';
      this._popBusy = key != null && key === this._deleting;
    }
    this._detailKey = key;
  }

  // The header's status pill goes right after the title, on its row, only while the title stays whole and the
  // pill's whole label fits beside it; otherwise it takes a line of its own under the subtitle (.below), the title
  // whole on its row (cut only when it does not fit alone). There, in the banner, the subtitle keeps one line; if the
  // text still does not fit above the ground strip, the pill keeps its dot alone (.dot-only, its label in its tooltip
  // and for screen readers). Measured after each render and on each new width, whatever the language: no fixed
  // width threshold.
  _fitPill() {
    if (!this.isConnected) return;
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(".tline");
      const pills = row ? [...row.children].filter((n) => n.matches(".st")) : [];
      if (!pills.length || !pills[0].getBoundingClientRect) continue;
      t.classList.remove("below", "dot-only");
      const name = row.querySelector(".name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const title = name && getComputedStyle(name).display !== "none" ? ccTextWidth(name) + gap : 0;
      const need = pills.reduce((w, p) => w + p.getBoundingClientRect().width + gap, title - gap);
      if (need > t.getBoundingClientRect().width - 0.5) {
        t.classList.add("below");
        const banner = t.closest(".banner");
        if (banner) {
          const b = banner.getBoundingClientRect();
          // Each element as it shows: its box cut by its ancestors that hide their overflow (a clamped line).
          const out = [...t.querySelectorAll("*")].some((n) => {
            let { top, bottom } = n.getBoundingClientRect();
            for (let p = n.parentElement; p && p !== t; p = p.parentElement) {
              if (getComputedStyle(p).overflowY === "visible") continue;
              top = Math.max(top, p.getBoundingClientRect().top);
              bottom = Math.min(bottom, p.getBoundingClientRect().bottom);
            }
            return bottom - top > 0.5 && (top < b.top - 0.5 || bottom > b.bottom - 10 + 0.5);
          });
          if (out) t.classList.add("dot-only");
        }
      }
      // A subtitle cut by its ellipsis keeps its whole text in its tooltip.
      const s = t.querySelector(".chips");
      if (s && (!s.hasAttribute("title") || s.dataset.fit)) {
        const cut = s.scrollWidth > s.clientWidth + 1;
        s.toggleAttribute("data-fit", cut);
        if (cut) s.title = s.textContent.trim();
        else s.removeAttribute("title");
      }
    }
  }

  connectedCallback() {
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // Every minute: countdowns move on, finished events go, and the events are fetched again every 5 min.
    // The tick is skipped while the details popup is open: re-rendering would reset its scroll position.
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (this._detail != null) return; this._sig = null; this._update(); }, 60000);
    (this._outsideWatch ??= ccWatchOutside(this, (ev) => this._onOutside(ev))).on();
    // Back on the page after leaving it: drawn again in its default state.
    this._sig = null;
    this._update();
  }

  disconnectedCallback() {
    this._resize?.disconnect();
    if (this._fitFrame) cancelAnimationFrame(this._fitFrame);
    this._fitWidth = null;
    clearInterval(this._timer);
    this._outsideWatch?.off();
    // Left (another dashboard view, a conditional card hidden): the details popup, the "more" section and the
    // mini card's detail view fold back, so that the card does not come back open. The new event form is kept
    // (what was typed would be lost).
    this._detail = null;
    this._expanded = false;
    this._zoomed = false;
  }

  getCardSize() {
    var n = this._shown || 3;
    return 1 + Math.ceil(n * 0.8);
  }

  // 8 columns at least: at 6 (about 160px in a section) an event under way lost its title and time to the
  // date column and the countdown badge. The mini card keeps 6.
  getGridOptions() { return { columns: 12, min_columns: 8 }; }

  _lang() {
    return ccLang((this._config?.language) || (this._hass?.language) || document.documentElement.lang);
  }

  _t(k) { return ccT(this._lang(), k); }

  // Full locale tag for date/time formatting (en-GB vs en-US…); the truncated _lang() is only for CcI18n.
  // The full tag is kept only when its base matches the card language, else the card language is used;
  // bare pt (Home Assistant's European Portuguese) becomes pt-PT, as Intl reads pt as Brazilian.
  _fmtLang() {
    return ccFmtLang(this._fmtTag(), this._lang());
  }

  _fmtTag() {
    var l = (this._config?.language) || (this._hass?.locale?.language) || (this._hass?.language) || document.documentElement.lang || 'en';
    if (l === this._fmtOk) return l;
    // An invalid tag is remembered too, so Intl is not asked (and does not throw) again on every format.
    if (l === this._fmtBad) return this._lang();
    try { new Intl.DateTimeFormat(l); this._fmtOk = l; } catch { this._fmtBad = l; l = this._lang(); }
    return l;
  }

  // Server time zone to show and enter times in, or null for the browser's (see ccServerZone).
  _tz() { return ccServerZone(this._hass); }

  // Now, as a Date in the zone the agenda is shown in.
  _now() { return ccInZone(new Date(), this._tz()); }

  _days() {
    if (this._week()) return 7;
    return Math.max(1, Math.min(62, Number(this._config.days_to_show) || CC_DEFAULTS.days_to_show));
  }

  // The range shown, in the fetch key (_offKey) and in the render keys (_viewKey): the week offset here; the panel
  // adds its view, its day and its hidden calendars.
  _offKey() { return this._weekOff || 0; }

  _viewKey() { return this._offKey(); }

  // `view: week`: the full card lays the 7 days from today side by side (the mini card keeps its list).
  _week() { return this._config.view === 'week' && !this._compact(); }

  // First day shown: today, or a whole number of weeks before / after it in the week view (the arrows, a swipe).
  _from(now) {
    var off = this._week() ? this._weekOff || 0 : 0;
    return ccAddDays(ccDayStart(now), 7 * off);
  }

  _timeFmt(d) {
    var o = { hour: '2-digit', minute: '2-digit' };
    var tf = this._hass?.locale?.time_format;
    if (tf === '12') o.hour12 = true;
    else if (tf === '24') o.hour12 = false;
    return d.toLocaleTimeString(this._fmtLang(), o);
  }

  _dateFmt(d, opts) { return d.toLocaleDateString(this._fmtLang(), opts); }

  // Abbreviated month under the day number. Intl gives a number for a lone short month in some
  // languages (Bulgarian "11"): the first three letters of the full name are used there (ное).
  _monthShort(d) {
    var m = this._dateFmt(d, { month: 'short' }).replace('.', '');
    return /^\d+$/.test(m) ? this._dateFmt(d, { month: 'long' }).slice(0, 3) : m;
  }

  // Abbreviated weekday (date column, header logo, next-event line). Some of the newer languages
  // get long ones from Intl (Latvian "Ceturtd") that overflow the 40px date column: there the whole week is
  // cut to its first three letters (Cet), so the days stay alike. The earlier languages keep Intl's form.
  // Checked once per locale.
  _wdShort(d) {
    var lang = this._fmtLang();
    if (this._wdCutLang !== lang) {
      this._wdCutLang = lang;
      this._wdCut = !/^(en|fr|de|es|sr|it|nl|pt|pl)(-|$)/i.test(lang) && [...Array(7)].some((_, i) => this._dateFmt(new Date(2026, 0, 5 + i), { weekday: 'short' }).replace('.', '').length > 5);
    }
    var w = this._dateFmt(d, { weekday: 'short' }).replace('.', '');
    return this._wdCut ? w.slice(0, 3) : w;
  }


  // "in 25 min", "in 2 h 05", "Now": for today's events only.
  _countdown(e, now) {
    if (e.allDay) return '';
    if (e.start <= now && e.end > now) return this._t('now');
    var mins = Math.round((e.start - now) / 60000);
    if (mins < 0 || mins >= 24 * 60) return '';
    if (mins < 60) return this._t('in_min').replace('{n}', Math.max(1, mins));
    var h = Math.floor(mins / 60), m = mins % 60;
    if (!m) return this._t('in_hours').replace('{h}', h);
    // Clock-style "in 2 h 05" (fr/en/pt/pl/ro, minutes last) pads the minutes; "in 2 Std. 5 Min." (de/es/it/nl…) does not.
    var tpl = this._t('in_h');
    return tpl.replace('{h}', h).replace('{m}', /\{m\}$/.test(tpl) ? String(m).padStart(2, '0') : m);
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
    // The new event form is open: nothing redraws under it (inputs, caret and focus stay as they are).
    if (this._adding && this._formShown) return;
    var cals = ccCalendars(this._config, this._hass);
    this._cals = cals;
    var tz = this._tz();
    var now = ccInZone(new Date(), tz);
    // Cheap pre-check: a hass update that touches neither the calendar entities, the minute, the
    // language / time format nor the card state cannot change the fetch key or the render — skip the
    // two JSON.stringify below. `_sig = null` (set by setConfig, the minute timer and a resolved fetch)
    // forces a full pass. While the details popup is open the minute is left out, so the next hass
    // update after a minute change does not re-render (and reset the popup's scroll) underneath it.
    var minute = this._detail != null ? '' : Math.floor(Date.now() / 60000);
    var loc = this._hass.locale || {};
    var workday = ccWorkday(this._config, this._hass);
    var todos = ccTodoLists(this._config, this._hass);
    var watched = cals.map((c) => c.entity).concat(todos.map((t) => t.entity), workday ? [workday] : []);
    var tick = `${watched.map((id) => this._hass.states[id]?.last_updated || '').join('|')}|${this._todoAt || 0}|${minute}|${this._detail}|${this._expanded}|${this._zoomed}|${!!this._adding}|${this._confirm}` +
      `|${this._hass.language}|${loc.language}|${loc.time_format}|${tz}|${this._viewKey()}|${!!this._hass.themes?.darkMode}`;
    if (this._sig != null && tick === this._tick) return;
    this._tick = tick;
    // Fetch again when the calendars, the range or the day change, when a calendar entity changes
    // (an event starts or ends) and every 5 minutes.
    var key = JSON.stringify([cals.map((c) => c.entity), this._config.school_holidays_calendar || '', this._days(), ccKey(now), tz, this._offKey(),
      cals.map((c) => this._hass.states[c.entity]?.last_changed || '')]);
    if (cals.length && (key !== this._fetchKey || Date.now() - this._fetchedAt > CC_REFRESH)) {
      this._fetchKey = key;
      this._fetch(cals);
    }
    // To-do lists: fetched again when one of them changes (its state is the count of open items).
    var todoKey = JSON.stringify(todos.map((t) => [t.entity, this._hass.states[t.entity]?.last_updated || '']));
    if (todos.length && (todoKey !== this._todoKey || Date.now() - (this._todoFetched || 0) > CC_REFRESH)) {
      this._todoKey = todoKey;
      this._fetchTodos(todos);
    } else if (!todos.length) this._todos = [];
    var sig = JSON.stringify([this._lang(), this._fmtLang(), this._fetchedAt, this._viewKey(), this._detail, this._expanded, this._zoomed, !!this._adding, this._form?.error, this._form?.busy, this._form?.confirm,
      this._confirm, this._popErr, this._popBusy,
      minute, cals.map((c) => [c.entity, c.color, c.name]), this._hass.locale?.time_format, tz,
      workday ? this._hass.states[workday]?.state : '', this._todoAt || 0, todos.map((t) => t.name),
      ccIsNight(this._hass, this._config)]);
    if (sig === this._sig) return;
    this._sig = sig;
    // A re-render patches the shadow DOM in place (ccMorph); should a node be replaced all the same, put the
    // keyboard focus back on the same event (found by its key, its row index may have moved) and keep the open popup's scroll position — only when
    // the popup still shows the same event (another event's popup, e.g. opened from the keyboard, starts
    // at the top).
    var focusedIdx = this.shadowRoot.activeElement?.dataset?.ev;
    var focused = focusedIdx != null ? this._evKeyAt(focusedIdx) : null;
    var popScroll = this.shadowRoot.querySelector('.pop')?.scrollTop;
    var popShown = this._popShown;
    var wasAdding = !!this._formWas;
    this._render(cals, now);
    this._fitPill();
    this._popShown = this._detail;
    this._formWas = !!this._adding;
    this._formShown = !!this._adding;
    // The form is taller than a short agenda: the card grows to hold it, so its buttons are never cut.
    var formPop = this._adding && this.shadowRoot.querySelector('.pop.form');
    if (formPop) formPop.parentNode.style.minHeight = `${formPop.scrollHeight + 16}px`;
    if (this._adding && this._focusForm) {
      this._focusForm = false;
      this.shadowRoot.querySelector('[data-f="summary"]')?.focus({ preventScroll: true });
    }
    if (popScroll && popShown != null && popShown === this._detail) {
      var pop = this.shadowRoot.querySelector('.pop'); if (pop) pop.scrollTop = popScroll;
    }
    var at = focused != null ? this._evIndex(focused) : -1;
    // preventScroll: a re-render from a hass update must not scroll the page to the card.
    if (at >= 0) this.shadowRoot.querySelector(`[data-ev="${at}"]`)?.focus({ preventScroll: true });
    this._moveFocus(popShown, wasAdding);
  }

  // Dialog focus: a details popup that opens (or shows another event) takes the focus on its close
  // button; when the popup or the form closes, the focus goes back to the event row it was opened from
  // (or to the + button for a new event), so a keyboard user does not lose their place.
  _moveFocus(popShown, wasAdding) {
    var q = (sel) => this.shadowRoot.querySelector(sel);
    var focus = (el) => el?.focus({ preventScroll: true });
    if (this._detail != null && popShown !== this._detail) {
      this._returnTo = this._detail;
      focus(q('.pop [data-action="close"]'));
      return;
    }
    if (this._adding) {
      // Opened from the details popup (Edit): back to that event's row on close.
      if (!wasAdding && popShown != null) this._returnTo = popShown;
      else if (!wasAdding) this._returnTo = null;
      return;
    }
    if (popShown == null && !wasAdding) return;
    var key = this._returnTo;
    this._returnTo = null;
    var at = key != null ? this._evIndex(key) : -1;
    focus(at >= 0 ? q(`[data-ev="${at}"]`) : wasAdding ? q('.addb') : null);
  }

  // `_detail` holds the open event's key (ccEvKey); rows carry their index in `_flat`.
  _evKeyAt(i) {
    var item = this._flat?.[Number(i)];
    return item ? ccEvKey(item.e) : null;
  }

  _evIndex(key) {
    return (this._flat || []).findIndex((x) => ccEvKey(x.e) === key);
  }

  _toggleDetail(i) {
    var key = this._evKeyAt(i);
    this._detail = key == null || this._detail === key ? null : key;
    this._update();
  }

  async _fetch(cals) {
    var seq = ++this._fetchSeq;
    var tz = this._tz();
    var from = this._from(ccInZone(new Date(), tz));
    var to = ccAddDays(from, this._days());
    var q = `?start=${encodeURIComponent(ccOutZone(from, tz).toISOString())}&end=${encodeURIComponent(ccOutZone(to, tz).toISOString())}`;
    // Set before the await, so a `set hass` while the request is pending does not refetch.
    this._fetchedAt = Date.now();
    // School holidays: the events of `school_holidays_calendar` mark the days they cover, without being listed.
    var hol = this._config.school_holidays_calendar;
    var holReq = hol ? this._hass.callApi('GET', `calendars/${hol}${q}`).catch(() => null) : Promise.resolve([]);
    var res = await Promise.allSettled(cals.map((c) => this._hass.callApi('GET', `calendars/${c.entity}${q}`)));
    var holRes = await holReq;
    if (seq !== this._fetchSeq) return;
    // A failed holiday request keeps the days already marked.
    if (holRes) this._holidays = (Array.isArray(holRes) ? holRes : []).map((raw) => ccParse(raw, -1)).filter(Boolean);
    var events = [], failed = [];
    res.forEach((r, i) => {
      // A calendar that fails (network blip, HA restarting) keeps its last events instead of
      // emptying the agenda. `_events` is cleared when the calendar list changes, so `cal` is valid.
      if (r.status !== 'fulfilled') {
        failed.push(cals[i].name);
        this._events.forEach((e) => { if (e.cal === i) events.push(e); });
        return;
      }
      events.push(...ccParseAll(r.value, i, tz));
    });
    this._events = ccDedupe(events.sort(ccSort));
    this._failed = failed;
    // "No upcoming events" needs at least one calendar that answered.
    if (failed.length < cals.length) this._loaded = true;
    // After a failure, try again a minute later rather than at the next 5-minute refresh.
    this._fetchedAt = failed.length ? Date.now() - CC_REFRESH + 60000 : Date.now();
    this._sig = null;
    this._update();
  }

  // The open items of the to-do lists (todo/item/list); a list that fails keeps its last items.
  async _fetchTodos(lists) {
    var seq = (this._todoSeq = (this._todoSeq || 0) + 1);
    this._todoFetched = Date.now();
    var res = await Promise.allSettled(lists.map((t) => this._hass.callWS({ type: 'todo/item/list', entity_id: t.entity })));
    if (seq !== this._todoSeq) return;
    var prev = this._todos || [];
    this._todos = lists.map((t, i) => {
      var ok = res[i].status === 'fulfilled';
      var items = ok ? (res[i].value?.items || []).filter((x) => x && x.status !== 'completed')
        : (prev.find((p) => p.entity === t.entity)?.items || []);
      return { entity: t.entity, name: t.name, items: items, failed: !ok };
    });
    this._todoAt = Date.now();
    this._sig = null;
    this._update();
  }

  // Check off a to-do item: shown done at once, the list is fetched again when its entity changes.
  _todoDone(li, uid) {
    var list = this._todos?.[li];
    var item = list?.items.find((x) => x.uid === uid);
    if (!item) return;
    list.items = list.items.filter((x) => x !== item);
    this._todoAt = Date.now();
    Promise.resolve(this._hass.callService('todo', 'update_item', { item: uid, status: 'completed' }, { entity_id: list.entity }))
      .catch(() => { this._todoKey = null; this._sig = null; this._update(); });
  }

  // The to-do lists under the agenda: each list's name and open items, a round check button before each item.
  _todoHtml(now) {
    if (!this._todos?.length) return '';
    var lists = this._todos.map((t, li) => {
      var items = t.items.map((x) => {
        var due = ccDue(x.due);
        var dueHtml = due ? `<span class="tdue${due < ccDayStart(now) ? ' late' : ''}">${ccEsc(this._dateFmt(due, { day: 'numeric', month: 'short' }))}</span>` : '';
        var label = `${this._t('todo_done')} · ${x.summary}`;
        return `<div class="titem"><button class="tcheck" data-action="todo-done" data-list="${li}" data-uid="${ccEsc(x.uid)}" title="${ccEsc(label)}" aria-label="${ccEsc(label)}">` +
          `<ha-icon icon="mdi:checkbox-blank-circle-outline"></ha-icon></button><span class="tsum">${ccEsc(x.summary)}</span>${dueHtml}</div>`;
      }).join('');
      return `<div class="tlist"><div class="thead"><ha-icon icon="mdi:format-list-checks"></ha-icon><span class="tname">${ccEsc(t.name)}</span>` +
        `${t.items.length ? `<span class="tcount">${t.items.length}</span>` : ''}</div>${items || `<div class="none">${this._t('todo_empty')}</div>`}</div>`;
    });
    return `<div class="todos">${lists.join('')}</div>`;
  }

  // The school holiday that covers a day, or null.
  _holidayOn(date) {
    var next = ccAddDays(date, 1);
    return (this._holidays || []).find((h) => h.start < next && h.end > date) || null;
  }

  // Under the title: the workday badge (working day / day off) and today's school holiday.
  _chipsHtml(now) {
    var chips = [];
    var wd = ccWorkday(this._config, this._hass);
    var st = wd ? this._hass.states[wd]?.state : '';
    if (st === 'on' || st === 'off') {
      var off = st === 'off';
      var wl = ccEsc(this._t(off ? 'day_off' : 'workday'));
      chips.push(`<span class="chip${off ? ' off' : ''}" title="${wl}"><ha-icon icon="${off ? 'mdi:beach' : 'mdi:briefcase-outline'}"></ha-icon><span class="ct">${wl}</span></span>`);
    }
    var hol = this._holidayOn(ccDayStart(now));
    if (hol) chips.push(`<span class="chip hol" title="${ccEsc(hol.summary)}"><ha-icon icon="mdi:school-outline"></ha-icon><span class="ct">${ccEsc(hol.summary || this._t('school_holidays'))}</span></span>`);
    return chips.length ? `<div class="chips">${chips.join('')}</div>` : '';
  }

  _visibleDays(now) {
    var c = this._config;
    var events = this._events.filter((e) => !ccExcluded(e, c.exclude) && this._cals[e.cal]);
    // A past week shows its events, whatever show_past_events says (it only trims today's agenda).
    return ccByDay(events, this._from(now), this._days(), now, c.show_past_events || (this._week() && (this._weekOff || 0) < 0));
  }

  _eventHtml(e, now, idx, isToday) {
    var c = this._config, cal = this._cals[e.cal];
    var meta = [`<span class="when">${ccEsc(this._when(e))}</span>`];
    if (c.show_location && e.location) meta.push(`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span class="lt">${ccEsc(e.location)}</span></span>`);
    var ongoing = !e.allDay && e.start <= now && e.end > now;
    var cd = c.show_countdown && isToday ? this._countdown(e, now) : '';
    var prog = '';
    if (ongoing && e.end > e.start) {
      var pct = Math.round(((now - e.start) / (e.end - e.start)) * 100);
      prog = `<div class="eprog"><div class="efill" style="width:${pct}%"></div></div>`;
    }
    return `<div class="ev${ongoing ? ' ongoing' : ''}${e.end <= now && !e.allDay ? ' past' : ''}" style="--c:${ccEsc(cal.color)};--c-on:${ccEsc(ccOnColor(cal.color))}" data-ev="${idx}" role="button" tabindex="0">` +
      '<span class="cbar"></span>' +
      `<div class="emain"><div class="etitle">${ccEsc(e.summary)}</div><div class="emeta">${meta.join('<span class="sep">·</span>')}</div>${prog}</div>` +
      (cd ? `<span class="cd${ongoing ? ' live' : ''}">${ccEsc(cd)}</span>` : '') +
    '</div>';
  }

  // One column of the week view: the day, then its events as short tiles (time and title, the calendar's color).
  _weekColHtml(day, events, now, firstIdx) {
    var isToday = ccKey(day.date) === ccKey(now);
    var evs = events.map((e, i) => {
      var cal = this._cals[e.cal];
      var ongoing = !e.allDay && e.start <= now && e.end > now;
      var when = e.allDay ? this._t('all_day') : (ccKey(e.start) === ccKey(day.date) ? this._timeFmt(e.start) : '…');
      return `<div class="wev${ongoing ? ' ongoing' : ''}${e.end <= now && !e.allDay ? ' past' : ''}${e.allDay ? ' allday' : ''}" style="--c:${ccEsc(cal.color)};--c-on:${ccEsc(ccOnColor(cal.color))}" data-ev="${firstIdx + i}" role="button" tabindex="0" title="${ccEsc(`${this._when(e)} · ${e.summary}`)}">` +
        `<span class="wt">${ccEsc(when)}</span><span class="ws">${ccEsc(e.summary)}</span></div>`;
    }).join('');
    var hol = this._holidayOn(day.date);
    return `<div class="wcol${isToday ? ' today' : ''}${hol ? ' hol' : ''}"><div class="whead"${hol ? ` title="${ccEsc(hol.summary || this._t('school_holidays'))}"` : ''}><span class="wd">${ccEsc(this._wdShort(day.date))}</span><span class="dn">${day.date.getDate()}</span></div>` +
      `<div class="wevs">${evs || '<div class="none">–</div>'}</div></div>`;
  }

  _dayHtml(day, events, now, firstIdx, cont) {
    var isToday = ccKey(day.date) === ccKey(now);
    var isTomorrow = ccKey(day.date) === ccKey(ccAddDays(now, 1));
    var wd = this._wdShort(day.date);
    var label = isToday ? this._t('today') : (isTomorrow ? this._t('tomorrow') : '');
    var date = cont ? '<div class="date"></div>'
      : `<div class="date${isToday ? ' today' : ''}"><span class="wd">${ccEsc(wd)}</span><span class="dn">${day.date.getDate()}</span>` +
        `<span class="mo">${ccEsc(this._monthShort(day.date))}</span></div>`;
    var body = events.length
      ? events.map((e, i) => this._eventHtml(e, now, firstIdx + i, isToday)).join('')
      : `<div class="none">${this._t('no_events')}</div>`;
    var hol = cont ? null : this._holidayOn(day.date);
    var holHtml = hol ? `<div class="dhol" title="${ccEsc(hol.summary)}"><ha-icon icon="mdi:school-outline"></ha-icon><span>${ccEsc(hol.summary || this._t('school_holidays'))}</span></div>` : '';
    return `<div class="day${cont ? ' cont' : ''}">${date}<div class="events">${label && !cont ? `<div class="dlabel">${ccEsc(label)}</div>` : ''}${holHtml}${body}</div></div>`;
  }

  // Shared by the full and mini cards: the "N events today" counter is a status badge at the right
  // of the header, like the other ha-* cards.
  _headerHtml(now, sub) {
    if (this._config.illustration !== false) return this._bannerHtml(now, sub);
    // Locale-aware upper case: Greek drops its accents (ΤΡΙ, not ΤΡΊ).
    var wd = this._wdShort(now).toLocaleUpperCase(this._fmtLang());
    return '<div class="header">' + ccLogo(wd, now.getDate()) +
      `<div class="titles"><div class="tline">${this._config.show_title !== false ? `<div class="name">${ccEsc(this._config.title || this._t('agenda'))}</div>` : ''}` +
      `<span class="st" title="${ccEsc(sub)}" aria-label="${ccEsc(sub)}"><span class="dot"></span><span class="stt">${ccEsc(sub)}</span></span></div>${this._chipsHtml(now)}</div>` +
      `${this._addButton()}${this._zoomButton()}</div>`;
  }

  // The illustrated header (default): the round calendar icon in the status colour, the title and the counter on
  // the wall at the left, today's tear-off calendar and the desk at the right, the buttons at the top right.
  _bannerHtml(now, sub) {
    var status = this._status(now);
    var lang = this._fmtLang();
    var month = this._monthShort(now).toLocaleUpperCase(lang);
    var wd = this._dateFmt(now, { weekday: 'long' });
    wd = wd.charAt(0).toLocaleUpperCase(lang) + wd.slice(1);
    var night = ccIsNight(this._hass, this._config);
    return `<div class="header banner ${status}${night ? ' night' : ''}" style="--cc-ic:${CC_STATUS_COLOR[status]}">` +
      ccSceneSvg(this._uid, status, month, now.getDate(), wd) +
      `<div class="logo" title="${ccEsc(sub)}"><ha-icon icon="mdi:calendar"></ha-icon></div>` +
      `<div class="titles"><div class="tline">${this._config.show_title !== false ? `<div class="name">${ccEsc(this._config.title || this._t('agenda'))}</div>` : ''}` +
      `<span class="st" title="${ccEsc(sub)}" aria-label="${ccEsc(sub)}"><span class="dot"></span><span class="stt">${ccEsc(sub)}</span></span></div>${this._chipsHtml(now)}</div>` +
      `<div class="hbtns">${this._addButton()}${this._zoomButton()}</div></div>`;
  }

  // Status of the day for the header: an event under way (now), another one still ahead today or an all-day
  // event today (upcoming), nothing more today (free), or a calendar that failed to load (error).
  _status(now) {
    if (this._failed.length) return 'error';
    var c = this._config;
    var events = this._events.filter((e) => !ccExcluded(e, c.exclude) && this._cals?.[e.cal]);
    if (events.some((e) => !e.allDay && e.start <= now && e.end > now)) return 'now';
    var end = ccAddDays(ccDayStart(now), 1);
    return events.some((e) => (e.allDay ? e.start < end && e.end > now : e.start > now && e.start < end)) ? 'upcoming' : 'free';
  }

  // Above the week: the arrows, its dates, and Today when another week is shown.
  _weekNavHtml(days) {
    if (!days.length) return '';
    var fmt = new Intl.DateTimeFormat(this._fmtLang(), { day: 'numeric', month: 'short' });
    var off = this._weekOff || 0;
    var btn = (action, label, icon) => `<button class="wbtn" data-action="${action}" title="${ccEsc(this._t(label))}" aria-label="${ccEsc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon></button>`;
    return `<div class="wnav">${btn('week-prev', 'prev_week', 'mdi:chevron-left')}` +
      `<span class="wrange" aria-live="polite">${ccEsc(fmt.format(days[0].date))} – ${ccEsc(fmt.format(days[days.length - 1].date))}</span>` +
      (off ? `<button class="wtoday" data-action="week-today">${ccEsc(this._t('today'))}</button>` : '') +
      `${btn('week-next', 'next_week', 'mdi:chevron-right')}</div>`;
  }

  _todaySub(days) {
    var n = days.length ? days[0].events.length : 0;
    if (!n) return this._t('none_today');
    return ccCount(this._lang(), 'event_today', 'events_today', n);
  }

  _errorHtml() {
    return this._failed.length
      ? `<div class="error" role="alert"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${ccEsc(this._t('load_failed').replace('{list}', this._failed.join(', ')))}</span></div>`
      : '';
  }

  // Overridden by the mini card.
  // Whether the calendar at index i in this._cals has a feature (CC_CREATE, CC_DELETE, CC_UPDATE).
  _supports(i, flag) {
    var c = this._cals?.[i];
    return !!c && (Number(this._hass?.states[c.entity]?.attributes?.supported_features) & flag) === flag;
  }

  // Calendars of the card that accept new events (Local Calendar, CalDAV, Google…), by index in this._cals.
  _writable() {
    return (this._cals || []).map((c, i) => ({ c, i })).filter(({ i }) => this._supports(i, CC_CREATE));
  }

  _addButton() {
    if (this._config.add_button === false || this._compact() || !this._writable().length) return '';
    var label = ccEsc(this._t('add_event'));
    return `<button class="addb" data-action="add" title="${label}" aria-label="${label}"><ha-icon icon="mdi:plus"></ha-icon></button>`;
  }

  // Edit / delete buttons of the details popup: full card, an event with a uid, a calendar that allows it.
  _canChange(e, flag) {
    return this._config.edit_buttons !== false && !this._compact() && !!e.uid && this._supports(e.cal, flag);
  }

  // The new event form, or the edit form of an event (pre-filled, saved with calendar/event/update).
  // `span` is the number of days from the start date to the end date: the end date follows the start's.
  _openForm(e) {
    var f = {
      summary: '', cal: this._writable()[0]?.i ?? 0, all_day: false, ...ccFormTimes(this._now()), span: 0, location: '', description: '', error: '', busy: false,
    };
    if (e) {
      // An all-day event's end is the day after its last day.
      var last = e.allDay ? ccAddDays(e.end, -1) : e.end;
      Object.assign(f, {
        summary: e.summary, cal: e.cal, all_day: e.allDay, date: ccIso(e.start), span: Math.max(0, ccDaysBetween(ccIso(e.start), ccIso(last))),
        location: e.location, description: e.description, edit: { uid: e.uid, recurrence_id: e.recurrence_id, rrule: e.rrule },
      });
      if (!e.allDay) Object.assign(f, { start: ccHm(e.start), end: ccHm(e.end) });
    }
    this._form = f;
    this._adding = true;
    this._detail = null;
    this._formShown = false;
    this._focusForm = true;
  }

  _closeForm() {
    this._adding = false;
    this._form = null;
    this._formShown = false;
  }

  _onField(ev) {
    var key = ev.target?.dataset?.f;
    if (!key || !this._form) return;
    var t = ev.target;
    if (key === 'end_date') {
      if (t.value && this._form.date) this._form.span = ccDaysBetween(this._form.date, t.value);
      return;
    }
    this._form[key] = t.type === 'checkbox' ? t.checked : key === 'cal' ? Number(t.value) : t.value;
    // All day hides the times: redraw the form (its values come from this._form).
    if (key === 'all_day') this._redrawForm();
  }

  _redrawForm() {
    this._formShown = false;
    this._sig = null;
    this._update();
  }

  // Read the calendars again: a new, changed or deleted event shows at once.
  _refetch() {
    this._fetchKey = null;
    this._sig = null;
    this._update();
  }

  _endDate() {
    var f = this._form;
    return f.date ? ccIso(ccAddDays(ccLocalDate(f.date), f.span)) : '';
  }

  // The action's data: start/end dates (the end the day after the end date, exclusive) or start/end
  // date-times.
  _eventData() {
    var f = this._form;
    var data = { summary: f.summary.trim() };
    if (f.location.trim()) data.location = f.location.trim();
    if (f.description.trim()) data.description = f.description.trim();
    if (f.all_day) {
      data.start_date = f.date;
      data.end_date = ccIso(ccAddDays(ccLocalDate(f.date), f.span + 1));
    } else {
      data.start_date_time = ccUtc(f.date, f.start, this._tz());
      data.end_date_time = ccUtc(this._endDate(), f.end, this._tz());
    }
    return data;
  }

  // calendar/event/update message of the edited event. A change to one instance of a recurring event
  // cannot carry the recurrence rule; a change to it and the following ones keeps it, like the Home
  // Assistant calendar panel.
  _updateMsg(entity, range) {
    var f = this._form, ed = f.edit, d = this._eventData();
    var event = { summary: d.summary, dtstart: d.start_date || d.start_date_time, dtend: d.end_date || d.end_date_time };
    if (d.location) event.location = d.location;
    if (d.description) event.description = d.description;
    if (ed.rrule && (range === CC_FUTURE || !ed.recurrence_id)) event.rrule = ed.rrule;
    var msg = { type: 'calendar/event/update', entity_id: entity, uid: ed.uid };
    if (ed.recurrence_id) {
      msg.recurrence_id = ed.recurrence_id;
      if (range) msg.recurrence_range = range;
    }
    msg.event = event;
    return msg;
  }

  // `range` answers "this event or this and the following ones?" for an instance of a recurring event
  // ('' or CC_FUTURE); the form asks it first.
  async _saveForm(range) {
    var f = this._form;
    if (!f || f.busy) return;
    if (!f.summary.trim()) f.error = this._t('ev_need_title');
    // A date or time field left empty (or half typed: the input's value is then '').
    else if (!ccDateOk(f.date) || (!f.all_day && !(ccTimeOk(f.start) && ccTimeOk(f.end)))) f.error = this._t('ev_bad_when');
    else if (!(f.span >= 0) || (!f.all_day && !f.span && f.end <= f.start)) f.error = this._t('ev_bad_end');
    else f.error = '';
    f.confirm = !f.error && !!f.edit?.recurrence_id && range == null;
    if (f.error || f.confirm) return this._redrawForm();
    var cal = this._cals[f.cal];
    f.busy = true;
    this._redrawForm();
    try {
      if (f.edit) await this._hass.callWS(this._updateMsg(cal.entity, range));
      else await this._createEvent(cal);
      this._closeForm();
      this._refetch();
    } catch (err) {
      f.busy = false;
      f.error = this._t(f.edit ? 'ev_save_failed' : 'ev_failed').replace('{e}', err?.message || String(err));
      this._redrawForm();
    }
  }

  // A new event: the calendar.create_event action (the panel sends a repeating one over the websocket).
  _createEvent(cal) {
    return this._hass.callService('calendar', 'create_event', this._eventData(), { entity_id: cal.entity });
  }

  // Buttons at the bottom of a form or a confirmation: Cancel, then the actions (no filled button).
  _btnsHtml(cancel, actions, busy) {
    return `<div class="fbtns"><button class="fbtn" data-action="${cancel}">${ccEsc(this._t('ev_cancel'))}</button>` +
      actions.map(([action, label, icon, cls]) => `<button class="fbtn ${cls}" data-action="${action}"${busy ? ' disabled' : ''}>` +
        `<ha-icon icon="${busy ? 'mdi:loading' : icon}"></ha-icon>${ccEsc(this._t(label))}</button>`).join('') + '</div>';
  }

  _formHtml() {
    var f = this._form;
    var cals = this._writable();
    var cal = this._cals[f.cal] || cals[0]?.c;
    var title = ccEsc(this._t(f.edit ? 'edit_event' : 'add_event'));
    var field = (key, label, input) => `<label class="ff ff-${key}"><span>${ccEsc(this._t(label))}</span>${input}</label>`;
    // Start and end: a date and, unless all day, a time.
    var when = (key, label, dateKey, date, timeKey, time) => {
      var l = ccEsc(this._t(label));
      return `<div class="ff ff-${key}" role="group" aria-label="${l}"><span>${l}</span><div class="fdt">` +
        `<input type="date" data-f="${dateKey}" value="${ccEsc(date)}" aria-label="${l}">` +
        (f.all_day ? '' : `<input type="time" data-f="${timeKey}" value="${ccEsc(time)}" aria-label="${l}">`) + '</div></div>';
    };
    var options = cals.map(({ c, i }) => `<option value="${i}"${i === f.cal ? ' selected' : ''}>${ccEsc(c.name)}</option>`).join('');
    var btns = f.confirm
      ? `<div class="fask">${ccEsc(this._t('ev_apply_to'))}</div>` +
        this._btnsHtml('back-edit', [['save-one', 'ev_this', 'mdi:check', 'primary'], ['save-future', 'ev_future', 'mdi:check-all', 'primary']], f.busy)
      : this._btnsHtml('cancel-add', [['save-add', f.edit ? 'ev_save' : 'ev_add', 'mdi:check', 'primary']], f.busy);
    return `<div class="pop form" role="dialog" aria-modal="true" aria-label="${title}" style="--c:${ccEsc(cal?.color || CC_COLORS[0])}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${title}</div>` +
      `<button class="pclose" data-action="cancel-add" title="${ccEsc(this._t('ev_cancel'))}" aria-label="${ccEsc(this._t('ev_cancel'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>` +
      field('summary', 'ev_title', `<input type="text" data-f="summary" value="${ccEsc(f.summary)}" maxlength="200" autocomplete="off">`) +
      // An edited event stays in its calendar.
      (cals.length > 1 && !f.edit ? field('cal', 'ev_calendar', `<select data-f="cal">${options}</select>`) : '') +
      `<label class="fcheck"><input type="checkbox" data-f="all_day"${f.all_day ? ' checked' : ''}><span>${ccEsc(this._t('all_day'))}</span></label>` +
      when('start', 'ev_start', 'date', f.date, 'start', f.start) +
      when('end', 'ev_end', 'end_date', this._endDate(), 'end', f.end) +
      field('location', 'ev_location', `<input type="text" data-f="location" value="${ccEsc(f.location)}" maxlength="200" autocomplete="off">`) +
      field('description', 'ev_description', `<textarea data-f="description" rows="3" maxlength="2000">${ccEsc(f.description)}</textarea>`) +
      (f.error ? `<div class="ferr" role="alert">${ccEsc(f.error)}</div>` : '') +
      btns + '</div>';
  }

  // Delete confirmation of the event in the details popup, under its title: an instance of a recurring
  // event offers this event only, or this one and the following ones.
  _confirmHtml(e) {
    if (this._confirm == null || this._confirm !== this._detail) return '';
    var actions = e.recurrence_id
      ? [['delete-one', 'ev_this', 'mdi:delete-outline', 'danger'], ['delete-future', 'ev_future', 'mdi:delete-sweep-outline', 'danger']]
      : [['delete-one', 'ev_delete', 'mdi:delete-outline', 'danger']];
    return `<div class="pconf"><div class="fask">${ccEsc(this._t('ev_delete_confirm'))}</div>` +
      (this._popErr ? `<div class="ferr" role="alert">${ccEsc(this._popErr)}</div>` : '') +
      this._btnsHtml('cancel-delete', actions, this._popBusy) + '</div>';
  }

  _detailEvent() {
    var item = this._detail != null && this._flat?.[this._evIndex(this._detail)];
    return item ? item.e : null;
  }

  async _deleteEvent(range) {
    var e = this._detailEvent();
    var key = this._detail;
    if (!e || this._popBusy || this._deleting === key) return;
    var msg = { type: 'calendar/event/delete', entity_id: this._cals[e.cal].entity, uid: e.uid };
    if (e.recurrence_id) {
      msg.recurrence_id = e.recurrence_id;
      if (range) msg.recurrence_range = range;
    }
    this._deleting = key;
    this._popBusy = true;
    this._popErr = '';
    this._sig = null;
    this._update();
    // The popup may have been closed, or show another event, by the time the answer comes: the
    // outcome only touches the popup when it still shows the deleted event.
    try {
      await this._hass.callWS(msg);
      this._deleting = null;
      if (this._detail === key) this._detail = null;
      this._refetch();
    } catch (err) {
      this._deleting = null;
      if (this._detail === key) {
        this._popBusy = false;
        this._popErr = this._t('ev_delete_failed').replace('{e}', err?.message || String(err));
      }
      this._sig = null;
      this._update();
    }
  }

  _compact() { return false; }

  _zoomButton() { return ''; }

  _render(cals, now) {
    var c = this._config;
    var accent = cals[0]?.color || CC_COLORS[0];
    if (!cals.length) {
      ccMorph(this.shadowRoot, `${this._styles(accent)}<ha-card lang="${ccEsc(this._fmtLang())}"><div class="empty"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon>${this._t('no_calendar')}</div></ha-card>`);
      return;
    }
    var days = this._visibleDays(now);
    // Flat list of shown events, so a click finds its event back.
    this._flat = [];
    days.forEach((d) => { d.events.forEach((e) => { this._flat.push({ e: e, day: d.date }); }); });
    // The open event is gone (finished and hidden, removed by a refetch): close its details.
    if (this._detail != null && this._evIndex(this._detail) < 0) this._detail = null;

    if (this._compact()) {
      ccMorph(this.shadowRoot, this._styles(accent) + this._miniHtml(days, now));
      return;
    }

    if (this._week()) {
      var at = 0;
      var cols = days.map((d) => {
        var html = this._weekColHtml(d, d.events, now, at);
        at += d.events.length;
        return html;
      });
      this._shown = this._flat.length;
      ccMorph(this.shadowRoot, this._styles(accent) + `<ha-card class="${this._detail != null || this._adding ? 'popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
        (c.show_header ? this._headerHtml(now, this._todaySub(days)) : '') +
        this._weekNavHtml(days) +
        `<div class="weekwrap"><div class="week">${cols.join('')}</div></div>${this._todoHtml(now)}${this._errorHtml()}${this._popupHtml()}</ha-card>`);
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
      var label = open ? this._t('less') : ccCount(this._lang(), 'more_one', 'more', moreCount);
      moreHtml = `<div class="more-body${open ? ' open' : ''}">${open ? more.join('') : ''}</div>` +
        `<button class="more" data-action="more" aria-expanded="${open}"><ha-icon icon="${open ? 'mdi:chevron-down' : 'mdi:chevron-right'}"></ha-icon>${ccEsc(label)}</button>`;
    }

    ccMorph(this.shadowRoot, this._styles(accent) + `<ha-card class="${this._detail != null || this._adding ? 'popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      // An unfolded mini card keeps its header whatever show_header says: it holds the fold button.
      (c.show_header || this._zoomed ? this._headerHtml(now, this._todaySub(days)) : '') +
      `<div class="list">${list}</div>${moreHtml}${this._todoHtml(now)}${this._errorHtml()}${this._popupHtml()}</ha-card>`);
  }

  // Event details, at the top of the card.
  _popupHtml() {
    if (this._adding && this._form) return this._formHtml();
    var e = this._detailEvent();
    if (!e) return '';
    var cal = this._cals[e.cal];
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
    var btn = (action, label, icon) => `<button class="pclose" data-action="${action}" title="${ccEsc(this._t(label))}" aria-label="${ccEsc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon></button>`;
    return `<div class="pop" role="dialog" aria-modal="true" aria-label="${ccEsc(e.summary)}" style="--c:${ccEsc(cal.color)}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${ccEsc(e.summary)}</div>` +
      (this._canChange(e, CC_UPDATE) ? btn('edit', 'edit_event', 'mdi:pencil-outline') : '') +
      (this._canChange(e, CC_DELETE) ? btn('delete', 'delete_event', 'mdi:delete-outline') : '') +
      `${btn('close', 'close', 'mdi:close')}</div>${this._confirmHtml(e)}${rows.join('')}</div>`;
  }

  _onSwipe(ev) {
    var start = this._swipe;
    this._swipe = null;
    if (!start || !this._week()) return;
    var dx = ev.clientX - start.x, dy = ev.clientY - start.y;
    if (Math.abs(dx) < CC_SWIPE || Math.abs(dx) < 2 * Math.abs(dy)) return;
    this._weekOff = (this._weekOff || 0) + (dx < 0 ? 1 : -1);
    this._detail = null;
    // The click that follows the swipe must not open the event under the finger.
    this._swiped = Date.now();
    this._update();
  }

  _onClick(ev) {
    if (this._swiped && Date.now() - this._swiped < 400) {
      this._swiped = 0;
      return;
    }
    var path = ev.composedPath();
    var btn = path.find((n) => n.dataset?.action);
    if (btn) {
      switch (btn.dataset.action) {
        case 'more': this._expanded = !this._expanded; break;
        case 'todo-done': this._todoDone(Number(btn.dataset.list), btn.dataset.uid); break;
        case 'week-prev': this._weekOff = (this._weekOff || 0) - 1; this._detail = null; break;
        case 'week-next': this._weekOff = (this._weekOff || 0) + 1; this._detail = null; break;
        case 'week-today': this._weekOff = 0; this._detail = null; break;
        case 'close': this._detail = null; break;
        case 'zoom': this._zoomed = !this._zoomed; this._detail = null; break;
        case 'add': this._openForm(); break;
        case 'cancel-add': this._closeForm(); break;
        case 'save-add': this._saveForm(); return;
        case 'save-one': this._saveForm(''); return;
        case 'save-future': this._saveForm(CC_FUTURE); return;
        case 'back-edit': this._form.confirm = false; this._redrawForm(); return;
        case 'edit': { var e = this._detailEvent(); if (e) this._openForm(e); break; }
        case 'delete': this._confirm = this._detail; this._popErr = ''; break;
        case 'cancel-delete': this._confirm = null; break;
        case 'delete-one': this._deleteEvent(''); return;
        case 'delete-future': this._deleteEvent(CC_FUTURE); return;
      }
      this._update();
      if (btn.dataset.action === 'zoom' && ev.detail === 0) this.shadowRoot.querySelector('.zoom')?.focus({ preventScroll: true });
      return;
    }
    var row = path.find((n) => n.dataset?.ev != null);
    if (row) {
      this._toggleDetail(row.dataset.ev);
      return;
    }
    if (this._adding) return;
    // A click on the card outside the popup closes it.
    if (this._detail != null && !path.some((n) => n.classList?.contains('pop'))) {
      this._detail = null;
      this._update();
    }
  }

  _onKey(ev) {
    if (this._adding) {
      if (ev.key === 'Escape') {
        this._closeForm();
        this._update();
      } else if (ev.key === 'Enter' && ev.target?.tagName === 'INPUT' && ev.target.type !== 'checkbox') {
        ev.preventDefault();
        this._saveForm();
      }
      return;
    }
    if (ev.key === 'Escape' && this._detail != null) {
      this._detail = null;
      this._update();
      return;
    }
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target?.dataset?.ev != null) {
      ev.preventDefault();
      // Same toggle as a click: a second Enter/Space on the open event closes its details.
      this._toggleDetail(ev.target.dataset.ev);
    }
  }

  _styles(accent) {
    return '<style>' +
      // One minmax(0, 1fr) column: the card's min-content width is 0, so it shrinks in a shared grid (1fr 1fr,
      // a stack) instead of pushing out of it, while an inline-block or an auto column still gets its content width.
      `:host { display: grid; grid-template-columns: minmax(0, 1fr); height: 100%; --cc-accent: ${accent}; --cc-accent-on: ${ccOnColor(accent)}; }` +
      // No size containment on the card: it would drop to its padding in a container sized by its content
      // (inline-block, a grid's auto column). The header alone is the container of the narrow query below.
      'ha-card { position: relative; height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
      'ha-card.popped { min-height: 240px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // The body starts 8px under the header, like the other ha-* cards (the card's gap is 10px).
      '.header { display: flex; align-items: center; gap: 10px; margin-bottom: -2px; container-type: inline-size; container-name: cc-head; }' +
      '.logo { width: 40px; height: 40px; flex-shrink: 0; font-family: inherit; }' +
      '.titles { flex: 1 1 0; min-width: 4.5ch; font-size: 16px; }' +
      '.name { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.list, .more-body { display: flex; flex-direction: column; gap: 10px; }' +
      // Week view: 7 columns, each day on top of its events, once each column gets about 100px (a 720px card); a
      // narrower card shows one day per row, its events beside the date, so their text stays readable.
      '.weekwrap { container-type: inline-size; touch-action: pan-y; }' +
      '.wnav { display: flex; align-items: center; gap: 4px; margin: 0 0 6px; }' +
      '.wrange { flex: 1; text-align: center; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }' +
      '.wbtn { all: unset; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; color: var(--secondary-text-color); --mdc-icon-size: 20px; }' +
      '.wbtn:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }' +
      '.wtoday { all: unset; cursor: pointer; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 12px; color: var(--cc-accent); border: 1px solid color-mix(in srgb, var(--cc-accent) 50%, transparent); }' +
      '.wbtn:focus-visible, .wtoday:focus-visible { outline: 2px solid var(--cc-accent); outline-offset: 1px; }' +
      '.week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }' +
      '.wcol { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 4px 3px; border-radius: 8px; }' +
      '.wcol.today { background: color-mix(in srgb, var(--cc-accent) 10%, transparent); }' +
      '.whead { display: flex; flex-direction: column; align-items: center; line-height: 1.15; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; }' +
      '.whead .dn { font-size: 18px; font-weight: 500; color: var(--primary-text-color); text-transform: none; }' +
      '.wcol.today .whead .dn { color: var(--cc-accent); }' +
      '.wevs { display: flex; flex-direction: column; gap: 3px; min-width: 0; }' +
      '.wevs .none { text-align: center; font-size: 12px; }' +
      '.wev { display: flex; flex-direction: column; min-width: 0; padding: 3px 6px; border-radius: 6px; cursor: pointer; font-size: 12px; line-height: 1.3;' +
        ' border-left: 3px solid var(--c); background: color-mix(in srgb, var(--c) 14%, transparent); color: var(--primary-text-color); }' +
      '.wev.allday { background: var(--c); color: var(--c-on); border-left-color: transparent; }' +
      '.wev.past { opacity: .55; }' +
      '.wev.ongoing { box-shadow: inset 0 0 0 1px var(--c); }' +
      '.wev:focus-visible { outline: 2px solid var(--cc-accent); outline-offset: 1px; }' +
      '.wt { font-size: 11px; font-variant-numeric: tabular-nums; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.wev.allday .wt { color: inherit; opacity: .85; }' +
      '.ws { font-weight: 500; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow-wrap: break-word; hyphens: auto; }' +
      '@container (max-width: 719px) {' +
        ' .week { grid-template-columns: minmax(0, 1fr); gap: 2px; }' +
        ' .wcol { flex-direction: row; align-items: flex-start; gap: 10px; }' +
        ' .whead { width: 40px; flex: none; }' +
        ' .wevs { flex: 1; }' +
        ' .wev { flex-direction: row; align-items: baseline; gap: 6px; font-size: 13px; }' +
        ' .wt { flex: none; font-size: 12px; }' +
        ' .ws { -webkit-line-clamp: 2; line-clamp: 2; }' +
        ' .wevs .none { text-align: start; }' +
      ' }' +
      '.more-body:not(.open) { display: none; }' +
      // A full card squeezed into a narrow column (an unfolded mini card left at 6 columns): the events go
      // under the date rather than keep less than 120px beside it.
      '.day { display: flex; flex-wrap: wrap; gap: 10px; }' +
      '.day + .day { border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 10px; }' +
      '.list .day.cont, .more-body .day.cont { border-top: none; padding-top: 0; }' +
      '.date { width: 40px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; line-height: 1.1; padding-top: 2px; }' +
      // ha-card carries the card language, so the upper case follows it (Greek drops its accents).
      '.date .wd, .date .mo { font-size: 11px; font-weight: 500; text-transform: uppercase; color: var(--secondary-text-color); }' +
      '.date .dn { font-size: 20px; font-weight: 500; color: var(--primary-text-color); margin: 2px 0; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; }' +
      // Accent text: mixed with the theme's text color so it reads at ≥ 4.5:1 in light and dark themes.
      '.date.today .wd { color: color-mix(in srgb, var(--cc-accent) 45%, var(--primary-text-color)); }' +
      '.date.today .dn { background: var(--cc-accent); color: var(--cc-accent-on); }' +
      '.events { flex: 1 1 0; min-width: min(100%, 120px); display: flex; flex-direction: column; gap: 4px; }' +
      '.dlabel { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--secondary-text-color); margin: 2px 0 2px 2px; }' +
      '.none { font-size: 13px; color: var(--secondary-text-color); padding: 6px 2px; }' +
      '.none.big { display: flex; align-items: center; justify-content: center; padding: 18px 0; }' +
      // The countdown pill drops under the event when the event would keep less than 120px beside it, so
      // neither the title nor the time is cut down to a letter; the color bar spans both lines.
      '.ev { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 6px 8px 6px 20px; border-radius: 10px; cursor: pointer; min-width: 0;' +
        ' background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.ev:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.ev:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.ev.past { opacity: 0.55; }' +
      '.cbar { width: 4px; align-self: stretch; min-height: 28px; border-radius: 2px; background: var(--c); flex-shrink: 0; }' +
      '.ev .cbar { position: absolute; left: 6px; top: 6px; bottom: 6px; min-height: 0; }' +
      // The countdown goes under the event rather than leave its time and place less than 190px.
      '.emain { flex: 1 1 0; min-width: min(100%, 190px); display: flex; flex-direction: column; gap: 2px; }' +
      '.etitle { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.emeta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; white-space: nowrap; overflow: hidden; }' +
      '.emeta .sep { opacity: 0.6; }' +
      // The time comes first: the location gives way before it (and ends with an ellipsis). A time line
      // still too long (an all-day range) wraps rather than being cut.
      '.emeta .when { flex: 0 0 auto; max-width: 100%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: normal; }' +
      '.loc { display: inline-flex; align-items: center; gap: 2px; flex: 0 1000 auto; min-width: 0; overflow: hidden; }' +
      '.loc .lt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.loc ha-icon { --mdc-icon-size: 13px; flex-shrink: 0; }' +
      '.eprog { height: 3px; border-radius: 2px; margin-top: 3px; background: color-mix(in srgb, var(--c) 20%, transparent); overflow: hidden; }' +
      '.efill { height: 100%; background: var(--c); border-radius: 2px; }' +
      '.cd { flex-shrink: 0; font-size: 11px; font-weight: 500; padding: 1px 8px; border-radius: 12px; white-space: nowrap;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--secondary-text-color); }' +
      '.cd.live { background: var(--c); color: var(--c-on); }' +
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
      '.pclose:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.pclose ha-icon { --mdc-icon-size: 18px; }' +
      '.prow { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--secondary-text-color); padding-left: 14px; }' +
      '.prow ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }' +
      '.pdot { width: 10px; height: 10px; margin: 0 3px; border-radius: 50%; flex-shrink: 0; }' +
      // + button of the header, like the zoom button; the new event form uses the popup's frame.
      '.addb { all: unset; flex: none; cursor: pointer; width: 28px; height: 28px; margin: -4px -2px; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.addb ha-icon { --mdc-icon-size: 20px; }' +
      '.addb:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
      '.addb:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.form .ff { display: flex; flex-direction: column; gap: 3px; flex: 1 1 0; min-width: 0; font-size: 12px; color: var(--secondary-text-color); }' +
      '.form input[type=text], .form input[type=date], .form input[type=time], .form select, .form textarea { box-sizing: border-box; width: 100%; min-width: 0; padding: 7px 9px; border-radius: 8px; font: inherit; font-size: 14px;' +
        ' color: var(--primary-text-color); background: var(--secondary-background-color, rgba(128,128,128,0.12)); border: 1px solid var(--divider-color, rgba(128,128,128,0.3)); outline: none; color-scheme: light dark; }' +
      '.form input:focus, .form select:focus, .form textarea:focus { border-color: var(--c); }' +
      '.form textarea { resize: vertical; min-height: 54px; line-height: 1.35; }' +
      '.form .frow { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }' +
      '.form .fcheck { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--primary-text-color); padding: 8px 0; white-space: nowrap; }' +
      '.form .fcheck input { accent-color: var(--c); }' +
      // Start and end: the date, then the time, on one line.
      '.form .fdt { display: flex; gap: 8px; }' +
      '.form .fdt input { flex: 1 1 0; }' +
      '.pop .ferr { font-size: 12px; color: var(--error-color, #db4437); }' +
      '.pop .fask { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }' +
      '.pop .fbtns { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 2px; }' +
      // Delete confirmation, under the popup's title.
      '.pconf { display: flex; flex-direction: column; gap: 8px; padding: 0 0 8px 14px; border-bottom: 1px solid var(--divider-color, rgba(128,128,128,0.15)); }' +
      // No filled button: outlined, the main one in the calendar's colour, a delete in the error colour.
      '.pop .fbtn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; background: none;' +
        ' color: var(--secondary-text-color); border: 1px solid color-mix(in srgb, var(--secondary-text-color) 35%, transparent); }' +
      '.pop .fbtn.primary { color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color)); border-color: color-mix(in srgb, var(--c) 55%, transparent); }' +
      '.pop .fbtn.danger { --c: var(--error-color, #db4437); color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); border-color: color-mix(in srgb, var(--c) 55%, transparent); }' +
      '.pop .fbtn:hover:not([disabled]) { background: color-mix(in srgb, var(--c) 10%, transparent); }' +
      '.pop .fbtn[disabled] { opacity: 0.6; cursor: default; }' +
      '.pop .fbtn ha-icon { --mdc-icon-size: 16px; }' +
      '.pdesc { font-size: 13px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; color: var(--primary-text-color); padding: 8px 0 0 14px;' +
        ' border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); }' +
      '.zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%;' +
        ' display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.zoom ha-icon { --mdc-icon-size: 16px; }' +
      '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
      '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      // The counter pill; on a very narrow card only its dot is left.
      '.st { display: inline-flex; align-items: center; gap: 4px; flex: 0 1 auto; min-width: 0; overflow: hidden; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;' +
        ' white-space: nowrap; background: color-mix(in srgb, var(--cc-accent) 15%, transparent);' +
        ' color: color-mix(in srgb, var(--cc-accent) 45%, var(--primary-text-color)); }' +
      '.st .stt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.st .dot { display: none; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--cc-accent); }' +
      // The counter pill right after the title, its whole label on one line, while the title stays whole beside it
      // (measured by the card, see _fitPill); otherwise on its own line under the chips, kept on one line, and with
      // its dot alone when even that does not fit the header.
      '.tline { display: flex; align-items: center; gap: 8px; min-width: 0; }' +
      '.tline > .name { flex: 0 1 auto; min-width: 0; }' +
      '.tline > .st { flex: none; max-width: none; }' +
      '.tline > .st .stt { white-space: nowrap; overflow: visible; }' +
      '.titles.below { display: grid; grid-template-columns: minmax(0, 1fr); align-content: center; }' +
      '.titles.below > .tline { display: contents; }' +
      '.titles.below > .tline > .st { order: 3; justify-self: start; align-self: start; margin-top: 3px; }' +
      '.titles.below > .chips { order: 2; flex-wrap: nowrap; overflow: hidden; }' +
      '.titles.dot-only > .tline { display: flex; }' +
      '.titles.dot-only > .tline > .st { order: 0; margin-top: 0; align-self: center; padding: 4px; }' +
      '.titles.dot-only > .tline > .st .stt { display: none; }' +
      '.titles.dot-only > .tline > .st .dot { display: block; }' +
      // Header under 240px (a phone's 6 to 8-column section card): the logo gives its room to the title and
      // the counter, which then shows its whole text down to a 245px card in every language.
      '@container cc-head (max-width: 240px) { .logo { display: none; } }' +
      // Header under 200px: dot only, tighter gaps (the header is the container: its 10px gaps lose 4px
      // through the items' margins). The text stays readable by screen readers, and in the pill's tooltip.
      '@container cc-head (max-width: 200px) {' +
        ' .st, .zoom { margin-left: -4px; }' +
        ' .st { padding: 4px; }' +
        ' .st .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }' +
        ' .st .dot { display: block; }' +
      ' }' +
      '.mnext { font-size: 12px; color: var(--secondary-text-color); display: flex; gap: 6px; align-items: center; min-width: 0; white-space: nowrap; overflow: hidden; border-radius: 6px; cursor: pointer; }' +
      '.mtodos { display: flex; flex-direction: column; gap: 2px; border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 8px; }' +
      '.mtodo { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 12px; color: var(--secondary-text-color); border-radius: 6px; }' +
      '.mtodo[data-action] { cursor: pointer; }' +
      '.mtodo[data-action]:hover { background: color-mix(in srgb, var(--cc-accent) 12%, transparent); }' +
      '.mtodo:focus-visible { box-shadow: 0 0 0 2px var(--cc-accent); outline: none; }' +
      '.mtodo ha-icon { --mdc-icon-size: 16px; }' +
      '.mtodo .tname { color: var(--primary-text-color); font-weight: 500; }' +
      '.tcount.none { opacity: 0.6; }' +
      '.mnext:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.mnext:focus-visible { box-shadow: 0 0 0 2px var(--c); outline: none; }' +
      // The event name keeps at least 40px; the date or time after it gives way first.
      '.mnext b { min-width: 40px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mnext span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 4px 8px; border-radius: 10px; cursor: pointer; white-space: nowrap; overflow: hidden;' +
        ' font-size: 12px; color: var(--secondary-text-color); background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.mallday:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.mallday:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.mallday b { min-width: 40px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday span:last-child { margin-left: auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday .ndot, .mnext .ndot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--c); }' +
      // Workday and school holiday chips under the title; the holiday's days are tinted in the agenda and the week.
      '.chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }' +
      '.chip { display: inline-flex; align-items: center; gap: 3px; min-width: 0; max-width: 100%; padding: 0 7px 0 5px; border-radius: 10px; font-size: 11px; font-weight: 500; line-height: 18px;' +
      ' white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }' +
      '.chip ha-icon { --mdc-icon-size: 13px; flex: none; }' +
      '.chip .ct { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.chip.off, .chip.hol { color: color-mix(in srgb, var(--cc-hol) 70%, var(--primary-text-color)); background: color-mix(in srgb, var(--cc-hol) 16%, transparent); }' +
      ':host { --cc-hol: #f4511e; }' +
      '.dhol { display: flex; align-items: center; gap: 4px; min-width: 0; padding: 2px 8px 2px 6px; border-radius: 8px; font-size: 12px; color: color-mix(in srgb, var(--cc-hol) 70%, var(--primary-text-color));' +
      ' background: color-mix(in srgb, var(--cc-hol) 12%, transparent); }' +
      '.dhol ha-icon { --mdc-icon-size: 14px; flex: none; }' +
      '.dhol span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.wcol.hol .whead { box-shadow: inset 0 -2px 0 var(--cc-hol); }' +
      // To-do lists under the agenda.
      '.todos { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 10px; }' +
      '.thead { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--secondary-text-color); }' +
      '.thead ha-icon { --mdc-icon-size: 16px; }' +
      '.tname { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.tcount { margin-left: auto; padding: 0 7px; border-radius: 10px; line-height: 18px; background: color-mix(in srgb, var(--cc-accent) 16%, transparent); color: var(--primary-text-color); }' +
      '.titem { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 14px; color: var(--primary-text-color); }' +
      '.tcheck { flex: none; display: grid; place-items: center; width: 32px; height: 32px; margin: -2px 0 -2px -4px; padding: 0; border: 0; border-radius: 50%; background: none; color: var(--secondary-text-color); cursor: pointer; }' +
      '.tcheck:hover { color: var(--cc-accent); background: color-mix(in srgb, var(--cc-accent) 12%, transparent); }' +
      '.tcheck:focus-visible { outline: 2px solid var(--cc-accent); }' +
      '.tcheck ha-icon { --mdc-icon-size: 20px; }' +
      '.tsum { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.tdue { flex: none; font-size: 12px; color: var(--secondary-text-color); }' +
      '.tdue.late { color: var(--error-color, #db4437); }' +
      (this._config?.illustration !== false ? CC_SCENE_STYLE : '') +
    '</style>';
  }
}
