// One-command dev loop: sync reveal assets into the test vault, then start
// the esbuild watch that rebuilds main.js / styles.css on every save.
//
// Point Obsidian at the `se-test-vault/` folder, enable community plugins,
// install the "Hot Reload" plugin, and enable Slidey. Saves rebuild + reload.
//
// Override the target vault with OUTDIR=/path/to/vault/.obsidian/plugins/slidey

import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const outdir =
    process.env.OUTDIR ||
    path.join(root, "se-test-vault", ".obsidian", "plugins", "slidey");

// reveal.js browser assets (one-time-ish; re-run after `pnpm --dir reveal-dist build`)
execFileSync(process.execPath, [path.join(root, "scripts", "sync-reveal-assets.mjs"), outdir], {
    stdio: "inherit",
});

// marker file the Hot Reload plugin watches
const hotreload = path.join(root, ".hotreload");
if (!existsSync(hotreload)) writeFileSync(hotreload, "");

process.env.OUTDIR = outdir;
console.log(`Watching src/ -> ${outdir}`);
await import(path.join(root, "esbuild.config.mjs"));
