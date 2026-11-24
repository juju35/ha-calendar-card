// ── Illustrated header: a desk under a tear-off wall calendar showing today's date ──────────────────
// A 150 × 80 picture at the right of the 90px banner, over its 10px desk strip (edge to edge). The wall
// calendar shows today's month, day number and weekday; the desk tells the status: a video call on a laptop
// while an event is under way (now), an alarm clock that rings now and then before the next one (upcoming),
// a steaming mug when the rest of the day is free. Colours come from the CSS (day and night), and every id
// carries the card's uid so several cards on a page never share a gradient.
import { ccEsc } from "./i18n-helpers.js";

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day
// picture after sunset).
export function ccIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'night') return true;
  if (theme === 'day') return false;
  return !!hass?.themes?.darkMode;
}

// Header icon colour of each status: HA's state colours of a calendar entity (on while an event is under way),
// the card's accent for an event still ahead today, the error colour when a calendar failed to load.
export var CC_STATUS_COLOR = {
  now: 'var(--state-calendar-on-color, var(--state-calendar-active-color, var(--state-active-color, #ff9800)))',
  upcoming: 'var(--cc-accent)',
  free: 'var(--state-calendar-off-color, var(--state-inactive-color, #9e9e9e))',
  error: 'var(--error-color, #db4437)',
};

export function ccSceneSvg(uid, status, month, day, weekday) {
  // A long weekday (Russian "воскресенье") is squeezed into the page rather than overflowing it.
  var fit = weekday.length > 10 ? ' textLength="38" lengthAdjust="spacingAndGlyphs"' : '';
  var desk = {
    now: '<g class="cc-laptop"><path class="cc-lid" d="M95 57.5h32a1.5 1.5 0 0 1 1.5 1.5v17h-35v-17a1.5 1.5 0 0 1 1.5-1.5Z"/>' +
      '<rect class="cc-screen" x="96" y="59.5" width="30" height="15" rx=".8"/>' +
      '<rect class="cc-tile t1" x="97.5" y="61" width="13" height="5.8" rx=".6"/><rect class="cc-tile t2" x="111.5" y="61" width="13" height="5.8" rx=".6"/>' +
      '<rect class="cc-tile t3" x="97.5" y="67.6" width="13" height="5.8" rx=".6"/><rect class="cc-tile t4" x="111.5" y="67.6" width="13" height="5.8" rx=".6"/>' +
      '<circle class="cc-head" cx="104" cy="63.4" r="1.4"/><circle class="cc-head" cx="118" cy="63.4" r="1.4"/><circle class="cc-head" cx="104" cy="70" r="1.4"/><circle class="cc-head" cx="118" cy="70" r="1.4"/>' +
      '<path class="cc-base" d="M89 76h44l-2 4H91Z"/></g>',
    upcoming: '<g class="cc-alarm"><g class="cc-ring"><circle class="cc-bell" cx="106.5" cy="62.2" r="3.4"/><circle class="cc-bell" cx="119.5" cy="62.2" r="3.4"/>' +
      '<path class="cc-leg" d="M107.5 77.5 105 80M118.5 77.5 121 80"/>' +
      '<circle class="cc-abody" cx="113" cy="70.5" r="8"/><circle class="cc-aface" cx="113" cy="70.5" r="6.2"/>' +
      '<path class="cc-ahand" d="M113 70.5V66.4M113 70.5l2.6 1.6"/><circle class="cc-anut" cx="113" cy="70.5" r=".8"/></g></g>',
    free: '<g class="cc-mug"><g class="cc-steam"><path class="s1" d="M106 64q-2-3 0-6t0-6"/><path class="s2" d="M111 64q-2-3 0-6t0-6"/></g>' +
      '<path class="cc-cup" d="M102.5 66h13v10.5a3.5 3.5 0 0 1-3.5 3.5h-6a3.5 3.5 0 0 1-3.5-3.5Z"/><path class="cc-handle" d="M115.5 69h1.6a3 3 0 0 1 0 6h-1.6"/>' +
      '<rect class="cc-band" x="102.5" y="70.2" width="13" height="2.4"/></g>' +
      '<g class="cc-plant"><path class="cc-leaf l1" d="M134 70c-6-1-8-6-7-10 4 1 7 5 7 10Z"/><path class="cc-leaf l2" d="M134 70c5-2 6-8 4-12-4 2-5 7-4 12Z"/>' +
      '<path class="cc-pot" d="M128.5 70h11l-1.6 10h-7.8Z"/></g>',
  }[status] || '';
  return '<div class="cc-desk" aria-hidden="true"></div>' +
    `<svg class="cc-scene" viewBox="0 0 150 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">` +
    `<defs><radialGradient id="cc-glow-${uid}"><stop offset="0" stop-color="#ffd27a" stop-opacity=".42"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>` +
    `<circle class="cc-glow" cx="60" cy="34" r="46" fill="url(#cc-glow-${uid})"/>` +
    // Wall clock.
    '<g class="cc-clock"><circle class="cc-cface" cx="16" cy="22" r="9"/><path class="cc-tick" d="M16 14.6v1.4M16 28v1.4M8.6 22H10M22 22h1.4"/>' +
    '<path class="cc-hand hh" d="M16 22v-4.4"/><path class="cc-hand mm" d="M16 22v-6.4"/><circle class="cc-nut" cx="16" cy="22" r=".9"/></g>' +
    // Tear-off calendar with today's date.
    '<g class="cc-cal" transform="translate(34 5)"><rect class="cc-shadow" x="2" y="3" width="44" height="52" rx="3"/>' +
    '<rect class="cc-page" width="44" height="52" rx="3"/><path class="cc-band" d="M3 0h38a3 3 0 0 1 3 3v10H0V3a3 3 0 0 1 3-3Z"/>' +
    '<circle class="cc-hole" cx="11" cy="0" r="1.8"/><circle class="cc-hole" cx="33" cy="0" r="1.8"/>' +
    `<text class="cc-month" x="22" y="9.8" text-anchor="middle">${ccEsc(month)}</text>` +
    `<text class="cc-day" x="22" y="38.5" text-anchor="middle">${ccEsc(day)}</text>` +
    `<text class="cc-wd" x="22" y="47.5" text-anchor="middle"${fit}>${ccEsc(weekday)}</text>` +
    '<path class="cc-curl" d="M44 46v3a3 3 0 0 1-3 3H33Q40 51 44 46Z"/>' +
    (status === 'now' ? '<circle class="cc-pulse" cx="41" cy="16.5" r="2.6"/><circle class="cc-live" cx="41" cy="16.5" r="2.6"/>' : '') +
    '</g>' +
    // Desk: notes on the left, the status object on the right.
    '<rect class="cc-note" x="4" y="72" width="10" height="8" rx=".8"/><rect class="cc-note b" x="16" y="76" width="18" height="4" rx=".8"/>' +
    `${desk}</svg>`;
}

export var CC_SCENE_STYLE =
  '.banner { position: relative; height: 90px; box-sizing: border-box; margin: -12px -12px -2px; padding: 0 12px 10px; overflow: hidden;' +
  ' border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0; color: #1f2a37;' +
  ' background: linear-gradient(90deg, #f7f9fc 0%, #eef2f7 55%, #e4e9f0 100%); }' +
  '.banner.night { color: #fff; background: linear-gradient(90deg, #2e3546 0%, #262c3a 55%, #20252f 100%); }' +
  '.banner > .logo, .banner > .titles { position: relative; z-index: 1; }' +
  // The text stops where the picture starts (150px), or under the buttons once the picture is gone.
  '.banner > .titles { margin-right: 146px; }' +
  '.banner .logo { display: grid; place-items: center; border-radius: 50%; color: var(--cc-ic); background: rgba(255,255,255,.66); box-shadow: inset 0 0 0 1px rgba(31,42,55,.1); }' +
  '.banner.night .logo { color: color-mix(in srgb, var(--cc-ic) 78%, #fff); background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }' +
  '.banner .logo ha-icon { --mdc-icon-size: 24px; }' +
  '.banner .name { color: inherit; font-weight: 600; }' +
  // The status pill right after the title, centred on it, in the icon's colour (placed by _fitPill, see the card's
  // style).
  '.banner > .titles { align-self: stretch; display: flex; flex-direction: column; justify-content: center; gap: 2px; }' +
  '.banner .st { margin: 0; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; line-height: 16px;' +
  ' background: color-mix(in srgb, var(--cc-ic) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--cc-ic) 45%, #0d2a45); }' +
  '.banner.night .st { background: color-mix(in srgb, var(--cc-ic) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--cc-ic) 35%, #ffffff); }' +
  '.banner .st .dot { display: block; width: 7px; height: 7px; background: var(--cc-ic); }' +
  // The chips stay on one line (each ends with an ellipsis, its full text in its tooltip): stacked, they pushed
  // the title out of the 90px banner on a narrow card.
  '.banner .chips { flex-wrap: nowrap; min-width: 0; overflow: hidden; } .banner .chip { flex: 0 1 auto; }' +
  '.banner .chip { color: #3d4a5a; background: rgba(255,255,255,.7); }' +
  '.banner.night .chip { color: rgba(255,255,255,.85); background: rgba(255,255,255,.12); }' +
  // The header buttons: 24 px frosted discs on the banner's top line, the detail button in the top-right corner.
  '.hbtns { position: absolute; top: 5px; right: 5px; z-index: 2; display: flex; gap: 4px; }' +
  '.hbtns .addb, .hbtns .zoom { all: unset; box-sizing: border-box; display: grid; place-items: center; cursor: pointer; margin: 0; width: 24px; height: 24px; border-radius: 50%;' +
  ' color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); --mdc-icon-size: 16px; }' +
  '.hbtns .addb ha-icon, .hbtns .zoom ha-icon { --mdc-icon-size: 16px; }' +
  '.hbtns .addb:hover, .hbtns .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }' +
  '.night .hbtns .addb, .night .hbtns .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }' +
  '.night .hbtns .addb:hover, .night .hbtns .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }' +
  '.hbtns .addb:focus-visible, .hbtns .zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }' +
  '.cc-desk { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #b98a5c; box-shadow: inset 0 2px 0 #d4a878; }' +
  '.night .cc-desk { background: #4a3a2c; box-shadow: inset 0 2px 0 #5c4836; }' +
  '.cc-scene { position: absolute; right: 0; bottom: 10px; width: 150px; height: 80px; pointer-events: none; font-family: inherit; }' +
  '.cc-glow { display: none; } .night .cc-glow { display: inline; }' +
  '.cc-cface { fill: #fff; stroke: #c3cad3; stroke-width: 1.3; } .night .cc-cface { fill: #fff6dc; stroke: #5a6272; }' +
  '.cc-tick { stroke: #8a94a1; stroke-width: .8; }' +
  '.cc-hand { stroke: #2a3038; stroke-width: 1.1; stroke-linecap: round; transform-box: view-box; transform-origin: 16px 22px; }' +
  '.cc-hand.mm { animation: cc-turn 10s linear infinite; } .cc-hand.hh { animation: cc-turn 120s linear infinite; }' +
  '.cc-nut { fill: #2a3038; }' +
  '.cc-shadow { fill: #dde3ea; } .night .cc-shadow { fill: #1d222c; }' +
  '.cc-page { fill: #fff; stroke: #d3d9e0; stroke-width: .8; } .night .cc-page { fill: #3a4050; stroke: #4a5568; }' +
  '.cc-cal .cc-band { fill: #e5484d; } .night .cc-cal .cc-band { fill: #c93c42; }' +
  '.cc-hole { fill: #5f6b7a; }' +
  '.cc-month { font-size: 7px; font-weight: 700; letter-spacing: .6px; fill: #fff; }' +
  '.cc-day { font-size: 25px; font-weight: 700; fill: #1f2329; } .night .cc-day { fill: #f0f0f0; }' +
  '.cc-wd { font-size: 6px; fill: #5c6470; } .night .cc-wd { fill: #a0a6ae; }' +
  '.cc-curl { fill: #eef1f5; transform-box: fill-box; transform-origin: 100% 100%; animation: cc-flip 7s ease-in-out infinite; } .night .cc-curl { fill: #4a5060; }' +
  '.cc-live { fill: var(--cc-ic); } .cc-pulse { fill: var(--cc-ic); transform-box: fill-box; transform-origin: center; animation: cc-pulse 1.8s ease-out infinite; }' +
  '.cc-note { fill: #f5b400; } .cc-note.b { fill: #86b9de; } .night .cc-note { fill: #b88a12; } .night .cc-note.b { fill: #4f7598; }' +
  '.cc-lid { fill: #9aa3ae; } .cc-base { fill: #c3cad3; } .night .cc-lid { fill: #5d6573; } .night .cc-base { fill: #707987; }' +
  '.cc-screen { fill: #23303f; } .cc-tile { fill: #3b5470; } .cc-head { fill: #9fc1e6; }' +
  '.night .cc-screen { fill: #182230; } .night .cc-laptop { filter: drop-shadow(0 0 3px rgba(120,170,255,.45)); }' +
  '.cc-tile { animation: cc-talk 4.8s steps(1) infinite; } .cc-tile.t2 { animation-delay: -1.2s; } .cc-tile.t3 { animation-delay: -2.4s; } .cc-tile.t4 { animation-delay: -3.6s; }' +
  '.cc-bell, .cc-abody { fill: #e5484d; } .night .cc-bell, .night .cc-abody { fill: #b8393e; }' +
  '.cc-aface { fill: #fff; } .night .cc-aface { fill: #fff6dc; }' +
  '.cc-leg { stroke: #7a2a2e; stroke-width: 1.4; stroke-linecap: round; }' +
  '.cc-ahand { stroke: #2a3038; stroke-width: .9; stroke-linecap: round; fill: none; } .cc-anut { fill: #2a3038; }' +
  '.cc-ring { transform-box: view-box; transform-origin: 113px 80px; animation: cc-ring 5s ease-in-out infinite; }' +
  '.cc-cup { fill: #fff; stroke: #c3cad3; stroke-width: .8; } .night .cc-cup { fill: #d9dde3; stroke: #8a94a1; }' +
  '.cc-handle { fill: none; stroke: #c3cad3; stroke-width: 1.6; } .night .cc-handle { stroke: #8a94a1; }' +
  '.cc-mug .cc-band { fill: #e5484d; }' +
  '.cc-steam path { fill: none; stroke: #aab4c0; stroke-width: 1.1; stroke-linecap: round; opacity: 0; animation: cc-steam 3.2s ease-out infinite; }' +
  '.cc-steam .s2 { animation-delay: -1.6s; } .night .cc-steam path { stroke: #cfd6df; }' +
  '.cc-leaf { fill: #5fae6e; transform-box: view-box; transform-origin: 134px 70px; animation: cc-sway 6s ease-in-out infinite alternate; }' +
  '.cc-leaf.l2 { fill: #4c9a5c; animation-delay: -3s; } .night .cc-leaf { fill: #3c6e48; } .night .cc-leaf.l2 { fill: #335f3e; }' +
  '.cc-pot { fill: #c46b4e; } .night .cc-pot { fill: #7a4334; }' +
  '@keyframes cc-turn { to { transform: rotate(360deg); } }' +
  '@keyframes cc-flip { 0%, 80%, 100% { transform: scale(1); } 88% { transform: scale(1.5, 1.7); } }' +
  '@keyframes cc-pulse { from { transform: scale(1); opacity: .7; } to { transform: scale(2.6); opacity: 0; } }' +
  '@keyframes cc-talk { 0% { fill: #4f8fd6; } 25%, 100% { fill: #3b5470; } }' +
  '@keyframes cc-ring { 0%, 70%, 100% { transform: rotate(0); } 72%, 76%, 80%, 84% { transform: rotate(-7deg); } 74%, 78%, 82%, 86% { transform: rotate(7deg); } 88% { transform: rotate(0); } }' +
  '@keyframes cc-steam { 0% { opacity: 0; transform: translateY(3px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-5px); } }' +
  '@keyframes cc-sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }' +
  // A narrow card: the sky alone stays, the text gets the room.
  '@container (max-width: 300px) { .cc-scene { display: none; } .banner > .titles { margin-right: 30px; } }' +
  '@media (prefers-reduced-motion: reduce) { .banner *, .banner *::before { animation: none !important; } }';

export var ccInDialog = (ev) => ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].indexOf(n.localName) >= 0);

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app) a
// tap on something that is not clickable (the background, an empty spot) sends no click to the page. It counts when
// the press and the release are both outside the card (a scroll cancels the pointer); keyboard clicks (no click
// count) still go through the click event. The handler keeps its own checks (inside the card, a dialog opened from it).
export var ccWatchOutside = (card, handler) => {
  var downOutside = false;
  var outside = (ev) => !ev.composedPath().includes(card);
  var onDown = (ev) => { downOutside = outside(ev); };
  var onUp = (ev) => { if (downOutside && outside(ev)) handler(ev); downOutside = false; };
  var onClick = (ev) => { if (ev.detail === 0) handler(ev); };
  return {
    on() {
      document.addEventListener('pointerdown', onDown, true);
      document.addEventListener('pointerup', onUp, true);
      document.addEventListener('click', onClick, true);
    },
    off() {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('click', onClick, true);
    },
    tap(ev) { onDown(ev); onUp(ev); },
  };
};
