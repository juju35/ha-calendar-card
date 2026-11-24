// ── Mini card ────────────────────────────────────────────────────────────────
// The next event (or the one under way) and the one after; the detail button unfolds the full card
// and a click anywhere else on the page folds it back, like the other mini cards.
import { ccEsc } from "./i18n-helpers.js";
import { ccAddDays, ccKey, ccMultiDay } from "./calendars-events.js";
import { CalendarAgendaCard } from "./card.js";

export class CalendarAgendaMiniCard extends CalendarAgendaCard {
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
        html = html.replace('<div class="emeta">', `<div class="emeta"><span class="when">${ccEsc(d)}</span><span class="sep">·</span>`);
      }
      body = allDayHtml + html;
      if (second) {
        var cal = this._cals[second.e.cal];
        var when = ccKey(second.day) === ccKey(now) ? this._when(second.e)
          : `${this._wdShort(second.day)} ${second.e.allDay ? '' : this._timeFmt(second.e.start)}`.trim();
        body += `<div class="mnext" style="--c:${ccEsc(cal.color)}" data-ev="${this._flat.indexOf(second)}" role="button" tabindex="0"><span>${this._t('next')}</span><span class="ndot"></span><b>${ccEsc(second.e.summary)}</b><span>${ccEsc(when)}</span></div>`;
      }
    }
    return `<ha-card class="mini${this._detail != null ? ' popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      this._headerHtml(now, this._todaySub(days)) +
      `<div class="list">${body}</div>${this._todoSummaryHtml()}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }

  // Folded: a line per to-do list, its name and its number of open items; a tap unfolds the card to the lists
  // (with zoom: false, the line only shows).
  _todoSummaryHtml() {
    if (!this._todos?.length) return '';
    var zoom = this._config.zoom !== false;
    var lines = this._todos.map((t) => {
      var n = t.items.length;
      var attrs = zoom ? ' data-action="zoom" role="button" tabindex="0"' : '';
      return `<div class="mtodo"${attrs}><ha-icon icon="mdi:format-list-checks"></ha-icon><span class="tname">${ccEsc(t.name)}</span>` +
        `<span class="tcount${n ? '' : ' none'}">${n}</span></div>`;
    });
    return `<div class="mtodos">${lines.join('')}</div>`;
  }
}
