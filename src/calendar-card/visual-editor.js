// ── Visual editor (built on HA's ha-form) ────────────────────────────────────
import { CALENDAR_CARD_VERSION, pickerDefine } from "./card-picker.js";
import { ccLang, ccT } from "./i18n-helpers.js";
import { CC_DEFAULTS, ccCalList, ccList } from "./calendars-events.js";
import { CalendarAgendaCard } from "./card.js";
import { CalendarAgendaMiniCard } from "./mini-card.js";

export var CC_EDITOR_DEFAULTS = Object.assign({ zoom: true }, CC_DEFAULTS);

export class CalendarAgendaCardEditor extends HTMLElement {
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

  _calList() {
    return ccCalList(this._config || {});
  }

  _lang() {
    return ccLang((this._config?.language) || (this._hass?.language));
  }

  _schema() {
    var mini = this.mini || /-mini-card$/.test(this._config.type || '');
    return [
      { name: 'entities', selector: { entity: { domain: 'calendar', multiple: true } } },
      { name: 'title', selector: { text: {} } },
      // The mini card shows the to-do lists once unfolded.
      { name: 'todo_entities', selector: { entity: { domain: 'todo', multiple: true } } },
    ].concat([
      { name: 'workday_entity', selector: { entity: { domain: 'binary_sensor', integration: 'workday' } } },
      { name: 'school_holidays_calendar', selector: { entity: { domain: 'calendar' } } },
      // The unfolded mini card is the full card: the week view and the buttons apply to it too.
      { name: 'view', selector: { select: { mode: 'dropdown', options: [{ value: 'agenda', label: ccT(this._lang(), 'view_agenda') }, { value: 'week', label: ccT(this._lang(), 'view_week') }] } } },
    ], [
      {
        type: 'grid', name: '', schema: [
          { name: 'days_to_show', selector: { number: { min: 1, max: 62, mode: 'box' } } },
          { name: 'max_events', selector: { number: { min: 0, max: 100, mode: 'box' } } },
        ],
      },
      {
        type: 'grid', name: '', schema: [
          { name: 'show_header', selector: { boolean: {} } },
          { name: 'illustration', selector: { boolean: {} } },
          { name: 'show_title', selector: { boolean: {} } },
          { name: 'show_location', selector: { boolean: {} } },
          { name: 'show_end_time', selector: { boolean: {} } },
          { name: 'show_countdown', selector: { boolean: {} } },
          { name: 'show_empty_days', selector: { boolean: {} } },
          { name: 'show_past_events', selector: { boolean: {} } },
          { name: 'add_button', selector: { boolean: {} } },
          { name: 'edit_buttons', selector: { boolean: {} } },
        ].concat(mini ? [{ name: 'zoom', selector: { boolean: {} } }] : []),
      },
      { name: 'illustration_theme', selector: { select: { mode: 'dropdown', options: ['auto', 'day', 'night'].map((v) => ({ value: v, label: ccT(this._lang(), `theme_${v}`) })) } } },
      { name: 'exclude', selector: { text: { multiple: true } } },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'es', label: 'Español' }, { value: 'sr', label: 'Српски' }, { value: 'sr-Latn', label: 'Srpski (latinica)' }, { value: 'it', label: 'Italiano' }, { value: 'nl', label: 'Nederlands' }, { value: 'pt', label: 'Português (Portugal)' }, { value: 'pl', label: 'Polski' }, { value: 'ro', label: 'Română' }, { value: 'da', label: 'Dansk' }, { value: 'sv', label: 'Svenska' }, { value: 'bg', label: 'Български' }, { value: 'ru', label: 'Русский' }, { value: 'uk', label: 'Українська' }, { value: 'hu', label: 'Magyar' }, { value: 'sk', label: 'Slovenčina' }, { value: 'cs', label: 'Čeština' }, { value: 'sl', label: 'Slovenščina' }, { value: 'lv', label: 'Latviešu' }, { value: 'el', label: 'Ελληνικά' }] } },
      },
    ]);
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
    // The form edits entity ids; colors and names set in YAML are kept aside. A YAML `entity:` (single
    // calendar) is shown as the list and written back as `entities`.
    data.entities = this._calList().map((e) => (typeof e === 'string' ? e : e.entity));
    if (data.todo_entities) data.todo_entities = ccList(data.todo_entities).map((e) => (typeof e === 'string' ? e : e?.entity));
    if (data.workday_entity === false) delete data.workday_entity;
    // `exclude: Private` (a YAML scalar) is shown as a one-item list.
    if (data.exclude != null) data.exclude = ccList(data.exclude).map(String);
    delete data.entity;
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
    this._calList().forEach((e) => { if (typeof e === 'object' && e) prev[e.entity] = e; });
    // `entities` replaces a YAML `entity:` (an empty list would otherwise hide it from ccCalendars).
    delete value.entity;
    if (value.entities) value.entities = value.entities.map((id) => prev[id] || id);
    // Same for the names of the to-do lists; an empty list is dropped.
    var prevTodo = {};
    ccList(this._config.todo_entities).forEach((e) => { if (typeof e === 'object' && e) prevTodo[e.entity] = e; });
    if (Array.isArray(value.todo_entities)) {
      if (value.todo_entities.length) value.todo_entities = value.todo_entities.map((id) => prevTodo[id] || id);
      else delete value.todo_entities;
    }
    if (this._config.workday_entity === false && !value.workday_entity) value.workday_entity = false;
    if (Array.isArray(value.exclude)) {
      value.exclude = value.exclude.filter((x) => x != null && String(x).trim() !== '');
      if (!value.exclude.length) delete value.exclude;
    }
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    var lang = this._lang();
    this._config = value;
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('calendar-agenda-card-editor')) {
  pickerDefine('calendar-agenda-card-editor', CalendarAgendaCardEditor);
}

window.customCards = window.customCards || [];
[
  ['calendar-agenda-card', CalendarAgendaCard, 'Calendar Agenda Card', 'Agenda of one or more Home Assistant calendars, grouped by day'],
  ['calendar-agenda-mini-card', CalendarAgendaMiniCard, 'Calendar Agenda Mini Card', 'Next event and the one after, unfolds into the full agenda'],
].forEach(([type, cls, name, description]) => {
  if (customElements.get(type)) return;
  pickerDefine(type, cls);
  window.customCards.push({ type, name, description, preview: true, documentationURL: 'https://github.com/juju35/ha-calendar-card' });
});

console.info(`%c CALENDAR-CARD %c v${CALENDAR_CARD_VERSION} `, 'color:#fff;background:#039be5;font-weight:700', 'color:#039be5;background:#fff');
