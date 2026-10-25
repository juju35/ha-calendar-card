// Evaluates the card source in a sandbox with minimal browser stubs and returns the requested top-level names.
// The card is a single classic script (no exports), so the bundle stays exactly what HACS serves.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export function loadCard(file, names) {
  const src = readFileSync(fileURLToPath(new URL(`../src/${file}`, import.meta.url)), "utf8");
  const registry = new Map();
  const sandbox = {
    console: { info() {}, log() {}, warn() {}, error() {} },
    HTMLElement: class {
      attachShadow() {
        this.shadowRoot = { innerHTML: "", activeElement: null, addEventListener() {}, querySelector: () => null };
        return this.shadowRoot;
      }
      addEventListener() {}
      dispatchEvent() {}
      appendChild() {}
    },
    CustomEvent: class {},
    customElements: { get: (n) => registry.get(n), define: (n, c) => registry.set(n, c) },
    document: { documentElement: { lang: "en" }, createElement: (tag) => ({ tagName: tag, addEventListener() {} }) },
    navigator: { language: "en" },
    localStorage: { getItem: () => null, setItem() {} },
    setInterval: () => 0,
    clearInterval() {},
    // The current global timers, so node:test mock timers apply to the card too.
    setTimeout: (...args) => globalThis.setTimeout(...args),
    clearTimeout: (id) => globalThis.clearTimeout(id),
  };
  sandbox.window = sandbox;
  // The current global Date, so node:test mock timers apply to the card too.
  Object.defineProperty(sandbox, "Date", { get: () => globalThis.Date });
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__exports = { ${names.join(", ")} };`, sandbox, { filename: file });
  return { ...sandbox.__exports, customElements: registry };
}
