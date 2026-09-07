# Slidey

An Obsidian community plugin that turns a markdown note into a controllable, preset-styled slide deck.

`@AGENTS.md` — architecture / processor-pipeline guidance inherited from the upstream project. Read it and `CONTRIBUTING.md` before touching the markdown processors.

**Vision:** write/plan a normal markdown file in Obsidian → render it as an interactive presentation. The author signals which preset/template a slide uses; Slidey renders it. Works with physical presentation USB clickers. Looks good, handles images well. Optional export to PDF / slide file.

The user (owner of this project) is **not a developer** — explain setup steps and toolchain choices explicitly, don't assume familiarity.

This is a sibling project to **Noctívago** (`C:\Users\jluca\Projects\noctivago`) and **livecast**. It deliberately reuses Noctívago's development workflow (below) but shares no code.

## Origin — this is a hard fork of Slides Extended

Slidey started (2026-09-07) as a fork of [**Slides Extended**](https://github.com/ebullient/obsidian-slides-extended) v2.4.3 (MIT — © 2024 Erin Schnabel, © 2021 Matthäus Szturc; itself the maintained continuation of Advanced Slides). Chosen over a from-scratch build because it already has a mature reveal.js 5.2 pipeline, theming, note-embedding, export, and a 15+ processor markdown transform chain.

We own this fork outright. `LICENSE` keeps both upstream copyright lines plus ours; `CHANGELOG-upstream-slides-extended.md` is their history, frozen. Upstream is available as the `upstream` git remote for diffing/cherry-picking future fixes; there is no shared history with `origin` (`joaovenari/slidey`).

**What changed from upstream at fork time:** plugin `id`/`name` → `slidey`; the hardcoded plugin dir (`src/obsidian/obsidianUtils.ts`) → `plugins/slidey/`; the runtime distribution-zip download URL (`src/slidesExtended-Distribution.ts`) → this repo's releases; user-facing "Slides Extended" strings → "Slidey"; version reset to `0.1.0`; `docs` submodule dropped; `reveal-dist` submodule flattened into a plain directory. Internal TypeScript identifiers (`SlidesExtendedPlugin`, `slidesExtended-*.ts`) are still upstream names — cosmetic, rename later if ever.

## Architecture (from upstream — see `AGENTS.md` + `CONTRIBUTING.md`)

Two build units:
- **plugin** (`src/`, this repo root) → `pnpm dev` / `pnpm build` produces `main.js` + `styles.css`. This is what loads in Obsidian.
- **reveal-dist** (`reveal-dist/`, own `package.json` + build) → produces the browser-side reveal.js assets (`css/`, `dist/`, `plugin/`, `template/`). Built separately: `cd reveal-dist && pnpm install && pnpm build`.

At runtime the plugin runs a local HTTP server (Fastify, default port 3000) that serves the rendered deck into an iframe preview / export. It compares `distVersion.json` against `manifest.json`'s version and, if they differ, downloads `slidey.zip` from this repo's matching GitHub release and unpacks the reveal assets into the plugin folder. **So a normal install needs a real release with `slidey.zip` attached** — until then, only the local `reveal-dist` build + `OUTDIR` dev flow works.

Markdown → slides is a 3-phase processor pipeline (template → slide structure → content, 15+ ordered processors). `LatexProcessor` must precede `MediaProcessor`. Don't reorder without reading `CONTRIBUTING.md`.

## Running it in development

Prereqs: Node 24+, pnpm (via `corepack` — `corepack pnpm ...`, the repo pins the version in `package.json`).

```
corepack pnpm install
cd reveal-dist && corepack pnpm install && corepack pnpm build && cd ..
OUTDIR="<dev-vault>/.obsidian/plugins/slidey" corepack pnpm dev
```

`se-test-vault/` (kept from upstream) is the dev vault — it has render test notes (`media-test.md`, `math-test.md`, `mermaid-test.md`, etc.). `.hotreload` in the output dir makes Obsidian's Hot-Reload plugin pick up rebuilds.

## Status

As of 2026-09-07: fork assembled and rebranded. First build + dev-vault load not yet verified. Presenter-clicker handling (PageUp/PageDown/arrows/Space + keeping focus on the deck iframe) and the preset system are the first real feature work, not yet started. Prior-art notes live in Claude memory (`slidey-research-markdown-slides`).

## Development workflow (inherited from Noctívago)

**Task tracking — the Obsidian three-piece system, tagged `#Slidey`:**
1. **Inbox** — `C:\Claude\Vault Claude\02 - Projetos\Slidey\Notas para Claude Slidey.md`. User-writes-only: one `- [ ] idea #Slidey` per line, plus `## Usage` (their `/usage` readings) and `## Questions` (where Claude parks deferrable design questions).
2. **Board** — `C:\Claude\Vault Claude\02 - Projetos\Slidey\Board.md`. Claude-writes-only. Triaged tasks: `#Slidey` + a stage tag (`#next` / `#planned` / `#future`) + a category tag (`#feature-core` / `#feature-render` / `#bug` / `#ux` / `#export`). `## Done` holds shipped items as `- [x]`. Exactly one `#next` at all times.
3. **CardBoard tab** — a "Slidey" board in the vault's `card-board` plugin config (not yet added; needs Obsidian closed or a reload).

Full backlog with scores lives in Claude memory (`slidey-task-list`), not in the repo.

**Task ranking:** every task gets three 0-10 scores at creation — effort, time-to-implement, usage-limit cost — ranked ascending by their average. Keep all three raw scores visible when presenting a rank.

**Releases:** every shipped release gets a `CHANGELOG.md` entry **and** a dated entry in this file, in the same step. Ship whenever it's easy/low-effort — releasing is cheap, don't gate it. After shipping, the turn's final message summarizes what's actually in the release. Old running-log entries get archived to `CLAUDE_HISTORY.md` to keep this file's auto-loaded context lean.

**Operating modes:** Economic (near a usage limit) / Balanced (default) / Emergency (explicit urgency — one task, ~65% scope margin). Read the inbox's `## Usage` section to pick.

**Working style:** terse responses by default. American English for all code/commits/docs/tracking regardless of chat language. Research how others solve a hard problem before designing it from scratch. One-shot `PushNotification` when blocked, when a build/release finishes, and when a fix/feature ships. At the notes/inbox checkpoint, don't pause for approval — pick the top task and execute; only ask on genuinely mutually-exclusive design forks (use the inbox `## Questions` section for deferrable ones). Check the inbox at the start/end of a session and during any background build wait.
