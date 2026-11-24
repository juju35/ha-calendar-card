// Entry point: the card's modules in their original order. scripts/bundle.mjs concatenates them in this order into the
// single classic script the card ships as.
import "./card-picker.js";
import "./i18n/cci18n.js";
import "./i18n-helpers.js";
import "./calendars-events.js";
import "./header-logo.js";
import "./illustrated-header.js";
import "./card.js";
import "./mini-card.js";
import "./visual-editor.js";
