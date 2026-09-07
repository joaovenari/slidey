// Copy the built reveal.js distribution assets into a plugin directory.
//
// In a normal install the plugin downloads `slidey.zip` from its GitHub
// release and unpacks these. In development there is no release, so we copy
// the local `reveal-dist/build/` output straight into the dev vault's plugin
// folder (plus distVersion.json / manifest.json so the version check passes).
//
// Usage: node scripts/sync-reveal-assets.mjs [targetPluginDir]
// Default target: se-test-vault/.obsidian/plugins/slidey

import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const target =
    process.argv[2] ||
    process.env.OUTDIR ||
    path.join(root, "se-test-vault", ".obsidian", "plugins", "slidey");

const revealBuild = path.join(root, "reveal-dist", "build");
if (!existsSync(revealBuild)) {
    console.error(
        `reveal-dist/build not found — run:\n  cd reveal-dist && pnpm install && pnpm build`,
    );
    process.exit(1);
}

mkdirSync(target, { recursive: true });

for (const dir of ["css", "dist", "plugin", "template"]) {
    const from = path.join(revealBuild, dir);
    if (existsSync(from)) {
        cpSync(from, path.join(target, dir), { recursive: true });
    }
}
for (const file of ["distVersion.json", "manifest.json"]) {
    cpSync(path.join(root, file), path.join(target, file));
}

console.log(`Synced reveal assets -> ${target}`);
