// Turns jscpd's JSON report into GitHub annotations. The job fails on the jscpd step itself; this script only annotates.
// Usage: node .github/scripts/jscpd-annotate.mjs [report/jscpd-report.json]
import { existsSync, readFileSync } from "node:fs";

const path = process.argv[2] || "report/jscpd-report.json";
// The step runs with `if: always()`: when jscpd failed before writing its report, there is nothing to annotate.
if (!existsSync(path)) {
  console.log(`jscpd: no report at ${path}, nothing to annotate`);
  process.exit(0);
}
const report = JSON.parse(readFileSync(path, "utf8"));
const dups = report.duplicates || [];
const esc = (s) => String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
for (const d of dups) {
  const a = d.firstFile;
  const b = d.secondFile;
  const lines = a.end - a.start + 1;
  const msg = `${lines} duplicated lines, also in ${b.name}:${b.start}-${b.end}`;
  console.log(`::warning file=${esc(a.name)},line=${a.start},endLine=${a.end},title=Duplication (jscpd)::${esc(msg)}`);
}
const pct = report.statistics?.total?.percentage ?? 0;
console.log(`jscpd: ${dups.length} clone(s), ${pct}% duplicated`);
