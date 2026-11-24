// ── i18n ──────────────────────────────────────────────────────────────────────
import { CcI18n } from "./i18n/cci18n.js";

// Language tag -> CcI18n key: the full tag when it has its own strings (sr-Latn), else the part before
// the dash (fr-FR -> fr, pt-BR -> European Portuguese pt), else English.
export function ccLang(l) {
  l = String(l || 'en');
  if (Object.hasOwn(CcI18n, l)) return l;
  l = l.split('-')[0];
  return Object.hasOwn(CcI18n, l) ? l : 'en';
}

// Locale for Intl: the full tag when its base matches the resolved card language (en-GB, sr-Latn…),
// else the card language; bare pt means European Portuguese.
export function ccFmtLang(tag, lang) {
  var l = String(tag || '');
  if (l.split('-')[0].toLowerCase() !== lang.split('-')[0]) l = lang;
  return l.toLowerCase() === 'pt' ? 'pt-PT' : l;
}

export function ccT(lang, key) {
  var strings = CcI18n[lang] || CcI18n.en;
  return strings[key] || CcI18n.en[key] || key;
}

// CLDR plural category of n in the card language, cached per language. 'one' covers 1 everywhere, and
// also 21, 31… in Serbian (21 догађај); the other forms are one plural string ("{n} events", or a
// "Label: {n}" counter in Polish, whose 2-4 and 5+ forms differ).
export var ccPlurals = {};
export function ccIsOne(lang, n) {
  if (n === 1) return true;
  try {
    ccPlurals[lang] = ccPlurals[lang] || new Intl.PluralRules(lang);
    return ccPlurals[lang].select(n) === 'one';
  } catch {
    return false;
  }
}

// "{n} event(s)…" from a singular and a plural key.
export function ccCount(lang, one, many, n) {
  return ccT(lang, ccIsOne(lang, n) ? one : many).replace('{n}', n);
}

// The width of an element's whole text in fractional pixels, even while an ellipsis cuts it.
export var ccTextWidth = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width || el.scrollWidth;
};

// Shadow DOM patching: a new render rewrites the markup in place instead of replacing it (innerHTML), so the nodes
// kept keep their size, running animations, focus, hover and scroll. Replacing them all on every minute tick and
// every fetch made the card's content show anew, the Sections view reflowing and the page jumping by itself.
// Elements with a data-key are matched by it, the others by position; a node of another kind is replaced. A custom
// element written empty (<ha-icon>) draws its own content: only the attributes the markup gives are updated.
export var ccPatchChildren = (cur, next) => {
  const old = [...cur.childNodes];
  const fresh = [...next.childNodes];
  const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-key') : null);
  const byKey = new Map();
  for (const o of old) {
    const k = keyOf(o);
    if (k !== null && !byKey.has(k)) byKey.set(k, o);
  }
  const used = new Set();
  fresh.forEach((n, i) => {
    const k = keyOf(n);
    let o = k !== null ? byKey.get(k) : old[i];
    if (!o || o.nodeType !== n.nodeType || o.nodeName !== n.nodeName || used.has(o) || (k === null && keyOf(o) !== null)) o = null;
    const ref = cur.childNodes[i] ?? null;
    if (!o) {
      cur.insertBefore(n, ref);
      return;
    }
    used.add(o);
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType !== 1) {
      if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
      return;
    }
    const own = n.localName.includes('-') && !n.firstChild;
    if (!own) for (const { name } of [...o.attributes]) if (!n.hasAttribute(name)) o.removeAttribute(name);
    for (const { name, value } of n.attributes) if (o.getAttribute(name) !== value) o.setAttribute(name, value);
    if (!own) ccPatchChildren(o, n);
  });
  while (cur.childNodes.length > fresh.length) cur.removeChild(cur.lastChild);
};
export function ccMorph(root, html) {
  const tpl = root.childNodes && document.createElement('template');
  if (!tpl || !tpl.content) {
    root.innerHTML = html;
    return;
  }
  tpl.innerHTML = html;
  ccPatchChildren(root, tpl.content);
}

export function ccEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
