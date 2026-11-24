/**
 * Folds the panel's top bar on scroll. `o`: `top` and `tabs` (the top bar and the tab row), `tab` (a tab, in the
 * row), `key` (a tab's id, from the button), `icons` (id → SVG path), `badge` (a tab's count, in it), `name`, `sub`,
 * `icon`, `status` (in the top bar), `acts` (its round buttons), `accent` (CSS colour), `extra` (an element shown
 * under the bar when folded, such as a sub-tab row: moved there while folded), `side` (an element moved before the
 * status pill while folded, such as an account picker), `subtab` (the sub-tabs of the tab shown, in the page:
 * mirrored in a row under the folded bar), `mount` (the node the folded bar goes before, when not the top bar), `menu` (() => ({ hass, narrow,
 * show })) for Home Assistant's menu button, `css` (the panel's own rules while folded; the folded bar's height is
 * `--pf-h` on the panel), `actsMenu` (narrow: only the active button `.on`, which opens the others, such as alarm
 * modes), `folded` (start folded: the page was drawn again while folded), `badgeColors` (the counts take the colours of the tabs' own badges), `skip` (() => true while the top bar must not fold). Returns { sync, detach }, or null when the panel has no top bar.
 */
import { calendarPanel_FOLD_CSS } from "./folded-top-bar.js";

export function calendarPanelFold(host, o) {
  const root = host.shadowRoot;
  const q = (sel) => (sel ? root?.querySelector?.(sel) : null);
  const top = q(o.top);
  const tabs = q(o.tabs);
  host.removeAttribute?.("pf-folded");
  if (!root || !top || !tabs || typeof root.querySelector !== "function") return null;
  if (!root.getElementById?.("pf-style")) {
    const style = document.createElement("style");
    style.id = "pf-style";
    style.textContent = calendarPanel_FOLD_CSS + (o.css || "");
    root.appendChild(style);
  }
  top.classList.add("pf-top");
  tabs.classList.add("pf-tabs");
  const sense = document.createElement("div");
  sense.className = "pf-sense";
  sense.setAttribute("aria-hidden", "true");
  sense.innerHTML = '<i class="pf-s1"></i><i class="pf-s2"></i>';
  const fold = document.createElement("div");
  fold.className = "pf-fold";
  fold.style.setProperty("--pf-accent", o.accent);
  if (o.actsMenu) fold.classList.add("pf-amenu");
  fold.innerHTML = `<div class="pf-bar"><span class="pf-menu" hidden></span><span class="pf-ic" aria-hidden="true"></span>
    <div class="pf-names"><span class="pf-t"></span><span class="pf-s"></span></div>
    <div class="pf-pills" role="tablist"></div>
    <div class="pf-end"><span class="pf-stat" role="status"></span><div class="pf-acts"></div></div></div><div class="pf-extra"></div><div class="pf-subs" role="tablist" hidden></div>`;
  const at = o.mount || top;
  at.parentNode.insertBefore(sense, at);
  at.parentNode.insertBefore(fold, at);
  const el = (c) => fold.querySelector(c);
  // Home Assistant's menu button, in a shadow root of its own: the panel's own look-ups of its menu button never
  // find this one
  const menuBtn = document.createElement("ha-menu-button");
  el(".pf-menu").attachShadow?.({ mode: "open" })?.append(menuBtn);
  // A copy keeps the icons of its ha-icon elements, which panels often set as a property (not copied by cloneNode)
  const copyIcons = (from, to) => {
    const a = from.matches?.("ha-icon") ? [from] : [...from.querySelectorAll("ha-icon")];
    const b = to.matches?.("ha-icon") ? [to] : [...to.querySelectorAll("ha-icon")];
    a.forEach((n, i) => {
      const icon = n.icon || n.getAttribute("icon");
      if (b[i] && icon) b[i].setAttribute("icon", icon);
    });
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  let folded = false;
  let queued = false;
  let extraHome = null;
  let sideHome = null;

  const tabButtons = () => [...tabs.querySelectorAll(o.tab)];
  const tabLabel = (b) => {
    const clone = b.cloneNode(true);
    for (const n of clone.querySelectorAll?.(`${o.badge || ".badge"}, ha-menu-button, svg`) || []) n.remove();
    return (b.getAttribute("aria-label") || clone.textContent || "").trim();
  };
  const isActive = (b) => b.classList.contains("active") || b.getAttribute("aria-selected") === "true";

  const sync = () => {
    queued = false;
    if (!folded) return;
    const iconBox = q(o.icon);
    const icon = iconBox?.querySelector("svg, ha-icon, ha-svg-icon, img");
    const iconCopy = icon?.cloneNode(true);
    if (iconCopy) copyIcons(icon, iconCopy);
    el(".pf-ic").replaceChildren(...(iconCopy ? [iconCopy] : []));
    // The icon keeps the colour of its state, as in the top bar
    el(".pf-ic").style.color = iconBox && !o.iconAccent ? getComputedStyle(iconBox).color : "";
    el(".pf-t").textContent = (q(o.name)?.textContent || "").trim();
    el(".pf-s").textContent = (q(o.sub)?.textContent || "").trim();
    const st = q(o.status);
    const stat = el(".pf-stat");
    const text = (st?.textContent || "").trim();
    stat.hidden = !text;
    if (text) {
      stat.style.setProperty("--pf-c", getComputedStyle(st).color || "var(--pf-accent)");
      stat.setAttribute("aria-label", text);
      stat.innerHTML = `<i></i><span>${esc(text)}</span>`;
    }
    const focused = root.activeElement?.closest?.(".pf-pill")?.dataset.i;
    const shown = tabs.hidden ? [] : tabButtons();
    el(".pf-pills").innerHTML = (shown.length > 1 ? shown : [])
      .map((b, i) => {
        const id = o.key(b);
        const label = tabLabel(b);
        const badgeEl = b.querySelector(o.badge || ".badge");
        const count = (badgeEl?.textContent || "").trim();
        // The count in the colour of its tab's own badge (its tone), where the panel colours them
        let tone = "";
        if (count && o.badgeColors) {
          const cs = getComputedStyle(badgeEl);
          tone = ` style="background:${cs.backgroundColor};color:${cs.color}"`;
        }
        const path = o.icons[id];
        const own = path ? null : b.querySelector("svg, ha-icon");
        const ownIcon = own?.localName === "ha-icon" ? own.icon || own.getAttribute("icon") : null;
        const glyph = !path
          ? own
            ? ownIcon
              ? `<ha-icon icon="${esc(ownIcon)}" aria-hidden="true"></ha-icon>`
              : own.outerHTML
            : `<span class="pf-l" aria-hidden="true">${esc(label.slice(0, 1))}</span>`
          : path.startsWith("mdi:")
            ? `<ha-icon icon="${esc(path)}" aria-hidden="true"></ha-icon>`
            : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
        const on = isActive(b);
        return `<button class="pf-pill" role="tab" data-i="${i}" aria-selected="${on}" tabindex="${on ? 0 : -1}" title="${esc(label)}" aria-label="${esc(count ? `${label} (${count})` : label)}">${glyph}${count ? `<b aria-hidden="true"${tone}>${esc(count)}</b>` : ""}</button>`;
      })
      .join("");
    if (focused !== undefined) el(`.pf-pill[data-i="${focused}"]`)?.focus({ preventScroll: true });
    // The active pill in sight in a scrolling row, without scrolling the page
    const row = el(".pf-pills");
    const act = el(".pf-pill[aria-selected=true]");
    if (act && (act.offsetLeft < row.scrollLeft || act.offsetLeft + act.offsetWidth > row.scrollLeft + row.clientWidth)) {
      row.scrollLeft = Math.max(0, act.offsetLeft - 16);
    }
    // The sub-tabs of the tab shown (in the page, under the top bar), mirrored in a row under the folded bar
    const subs = o.subtab ? [...root.querySelectorAll(o.subtab)].filter((b) => !fold.contains(b)) : [];
    const subRow = el(".pf-subs");
    subRow.hidden = subs.length < 2;
    subRow.innerHTML = subs.length < 2 ? "" : subs
      .map((b, i) => {
        const on = isActive(b);
        const hi = b.querySelector("ha-icon");
        const ic = hi && (hi.icon || hi.getAttribute("icon"));
        return `<button class="pf-sub" role="tab" data-s="${i}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${ic ? `<ha-icon icon="${esc(ic)}" aria-hidden="true"></ha-icon>` : ""}${esc(tabLabel(b))}</button>`;
      })
      .join("");
    subRow.onclick = (ev) => {
      const sb = ev.target.closest?.(".pf-sub");
      if (sb) subs[Number(sb.dataset.s)]?.click();
    };
    const acts = el(".pf-acts");
    acts.textContent = "";
    for (const a of o.acts ? root.querySelectorAll(o.acts) : []) {
      if (a.offsetParent === null && !top.contains(a)) continue;
      const c = a.cloneNode(true);
      copyIcons(a, c);
      c.removeAttribute("id");
      // An active button (`.on`) keeps the colour of its state
      if (c.classList.contains("on")) c.style.setProperty("--pf-on", getComputedStyle(a).color);
      if (c.tagName !== "A") {
        // The panel's own click handlers see the original only (its data-* stay off the copy)
        for (const n of [c, ...c.querySelectorAll("*")]) for (const at of [...n.attributes]) if (at.name.startsWith("data-")) n.removeAttribute(at.name);
        c.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          // Narrow, with `actsMenu`: the active button opens the list of the others first
          if (o.actsMenu && fold.clientWidth <= 600 && (!fold.classList.contains("pf-open") || c.classList.contains("on"))) {
            fold.classList.toggle("pf-open");
            return;
          }
          fold.classList.remove("pf-open");
          a.click();
        });
      }
      acts.appendChild(c);
    }
    const m = o.menu?.();
    el(".pf-menu").hidden = !m?.show;
    if (m) {
      menuBtn.hass = m.hass;
      menuBtn.narrow = m.narrow;
    }
  };
  const queue = () => {
    if (queued || !folded) return;
    queued = true;
    requestAnimationFrame(sync);
  };

  const setFolded = (v) => {
    if (v === folded) return;
    if (v) {
      const t = top.getBoundingClientRect();
      const b = tabs.getBoundingClientRect();
      if (!t.height || o.skip?.()) return; // top bar hidden (Settings): the tabs alone stay sticky
      const extra = q(o.extra);
      // The room of the top bar and the tabs (and an extra row), by their heights: the tabs may be stuck at the top
      // already (a jump down the page), where their position says nothing of the room they take in the page
      const room = t.height + b.height + (extra ? extra.getBoundingClientRect().height : 0);
      folded = true;
      sync();
      if (extra) {
        extraHome = [extra.parentNode, extra.nextSibling];
        el(".pf-extra").appendChild(extra);
      }
      const side = q(o.side);
      if (side) {
        sideHome = [side.parentNode, side.nextSibling];
        el(".pf-end").prepend(side);
      }
      // Measured out of the flow first, so that the content never moves (nor the browser's scroll anchoring with it)
      fold.style.width = `${t.width}px`;
      fold.classList.add("pf-measure");
      const h = fold.offsetHeight;
      fold.classList.remove("pf-measure");
      fold.style.width = "";
      fold.style.marginBottom = `${Math.round(room - h)}px`;
      host.style.setProperty("--pf-h", `${h}px`);
      host.setAttribute("pf-folded", "");
    } else {
      folded = false;
      const extra = el(".pf-extra").firstElementChild;
      if (extra && extraHome) extraHome[0].insertBefore(extra, extraHome[1] && extraHome[1].parentNode === extraHome[0] ? extraHome[1] : null);
      extraHome = null;
      const side = sideHome && el(".pf-end").firstElementChild;
      if (side && !side.matches(".pf-stat")) sideHome[0].insertBefore(side, sideHome[1] && sideHome[1].parentNode === sideHome[0] ? sideHome[1] : null);
      sideHome = null;
      host.removeAttribute("pf-folded");
      fold.style.marginBottom = "";
    }
  };

  el(".pf-pills").addEventListener("click", (ev) => {
    const p = ev.target.closest?.(".pf-pill");
    if (p) tabButtons()[Number(p.dataset.i)]?.click();
  });
  el(".pf-pills").addEventListener("keydown", (ev) => {
    const step = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    const p = ev.target.closest?.(".pf-pill");
    if (!step || !p) return;
    ev.preventDefault();
    const all = [...el(".pf-pills").children];
    all[(Number(p.dataset.i) + step + all.length) % all.length]?.focus();
  });

  // The list of buttons opened (narrow, `actsMenu`) closes at a click elsewhere
  const closeMenu = (ev) => {
    if (fold.classList.contains("pf-open") && !ev.composedPath().includes(el(".pf-acts"))) fold.classList.remove("pf-open");
  };
  if (o.actsMenu) root.addEventListener("click", closeMenu, true);
  let io = null;
  if (typeof IntersectionObserver === "function") {
    const [s1, s2] = sense.children;
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const above = !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
        if (e.target === s1 && above) setFolded(true);
        if (e.target === s2 && e.isIntersecting) setFolded(false);
      }
    });
    io.observe(s1);
    io.observe(s2);
  }
  const mo = typeof MutationObserver === "function" ? new MutationObserver(queue) : null;
  mo?.observe(top, { subtree: true, childList: true, characterData: true, attributes: true });
  mo?.observe(tabs, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "aria-selected", "hidden"] });
  // Drawn again while folded (a panel that rewrites its page): folded straight away, without a frame unfolded
  if (o.folded) setFolded(true);
  return {
    sync: queue,
    detach() {
      root.removeEventListener?.("click", closeMenu, true);
      io?.disconnect();
      mo?.disconnect();
      setFolded(false);
      sense.remove();
      fold.remove();
      host.removeAttribute("pf-folded");
    },
  };
}
