// The header's status pill rule (_fitPill), on a stand-in DOM: right after the title only while the title stays
// whole and the pill's whole label fits beside it; otherwise on its own line under the subtitle (.below); in the
// banner, with its dot alone (.dot-only) when the text still does not fit above the ground strip. Decided by
// measurement only: no fixed width threshold, no share cap, no title cut down to a few characters.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const src = readFileSync(new URL("../src/calendar-card.js", import.meta.url), "utf8");
const method = src.match(/\n( +)_fitPill\(\) \{[\s\S]*?\n\1\}\n/)[0].trim();
const textWidth = src.match(/(?:const|var) \w*[tT]extWidth = [\s\S]*?\n\};\n/)[0];
const CLS = {"titles":  "titles",  "row":  "tline",  "pill":  "st",  "name":  "name",  "sub":  "chips"};

// Stand-in element: class names, children, a box and a text width.
const node = (cls, { box = {}, w = 0, children = [], display = "block" } = {}) => {
  const n = {
    cls: new Set(cls.split(" ")),
    children,
    w,
    display,
    attrs: {},
    dataset: {},
    textContent: "text",
    scrollWidth: 0,
    clientWidth: 0,
    box: { top: 0, bottom: 20, height: 20, width: w, ...box },
    getBoundingClientRect() {
      return this.box;
    },
    matches(sel) {
      return sel.split(",").some((s) => s.trim().split(/[ >]+/).pop().split(".").filter(Boolean).every((c) => this.cls.has(c)));
    },
    querySelectorAll(sel) {
      const out = [];
      const walk = (p) => {
        for (const c of p.children) {
          if (sel === "*" || c.matches(sel)) out.push(c);
          walk(c);
        }
      };
      walk(this);
      return out;
    },
    querySelector(sel) {
      return this.querySelectorAll(sel)[0] || null;
    },
    closest(sel) {
      for (let p = this; p; p = p.parent) if (p.matches(sel)) return p;
      return null;
    },
    hasAttribute: (a) => a in n.attrs,
    removeAttribute: (a) => delete n.attrs[a],
    toggleAttribute: () => {},
    classList: {
      add: (...c) => {
        for (const x of c) n.cls.add(x);
      },
      remove: (...c) => {
        for (const x of c) n.cls.delete(x);
      },
      contains: (c) => n.cls.has(c),
    },
  };
  for (const c of children) c.parent = n;
  return n;
};

const fit = (titles) => {
  const doc = { createRange: () => ({ selectNodeContents(el) { this.el = el; }, getBoundingClientRect() { return { width: this.el.w }; } }) };
  const gcs = (el) => ({ columnGap: "8px", display: el.display, getPropertyValue: () => "10px" });
  const card = new Function("document", "getComputedStyle", `${textWidth}; return { ${method} };`)(doc, gcs);
  card.isConnected = true;
  card.shadowRoot = { querySelectorAll: (sel) => (titles.matches(sel) ? [titles] : []) };
  card._fitPill();
  return titles.cls;
};

// A header: the title (its whole text width), the pill (its whole width), in a row of the given width.
const header = ({ row = 300, title = 120, pill = 80, banner = false, subBottom = 60 } = {}) => {
  const t = node(`${CLS.titles}`, {
    box: { width: row, top: 20, bottom: subBottom, height: subBottom - 20 },
    children: [
      node(`${CLS.row}`, { box: { width: row, top: 20, bottom: 40, height: 20 }, children: [node(CLS.name, { w: title }), node(CLS.pill, { w: pill })] }),
      node(CLS.sub, { box: { top: 42, bottom: subBottom, height: subBottom - 42 } }),
    ],
  });
  if (!banner) return t;
  return node("banner", { box: { top: 0, bottom: 90, height: 90 }, children: [t] }).children[0];
};

test("the pill stays on the title row while the whole title and the whole label fit", () => {
  assert.ok(!fit(header({ row: 300, title: 120, pill: 80 })).has("below"));
  assert.ok(!fit(header({ row: 209, title: 120, pill: 80 })).has("below"));
});

test("the pill leaves the row rather than cut the title", () => {
  // 4 characters of the title would leave the pill room: still below, the title stays whole.
  assert.ok(fit(header({ row: 208, title: 120, pill: 80 })).has("below"));
  assert.ok(fit(header({ row: 400, title: 360, pill: 60 })).has("below"));
});

test("in the banner, the dot alone when the text still overflows the ground strip", () => {
  const ok = fit(header({ row: 150, banner: true, subBottom: 60 }));
  assert.ok(ok.has("below") && !ok.has("dot-only"));
  const tall = fit(header({ row: 150, banner: true, subBottom: 85 }));
  assert.ok(tall.has("below") && tall.has("dot-only"));
});

test("no fixed threshold moves the pill: the stylesheet places it from the card's measure only", () => {
  assert.match(src, /\.below/);
  assert.match(src, /\.dot-only/);
  assert.doesNotMatch(src, /fourChars/);
});
