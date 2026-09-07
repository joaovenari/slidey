# Changelog

All notable changes to Slidey are documented here. Newest first.
Upstream (Slides Extended) history is frozen in `CHANGELOG-upstream-slides-extended.md`.

## [Unreleased]

### Not yet done

- Slidey's actual features: presenter-clicker focus-robustness (basic keys already work), opinionated slide presets, image-layout defaults, PDF/PPTX export polish.
- Rebrand of internal TypeScript identifiers (`SlidesExtendedPlugin`, `slidesExtended-*.ts`) — cosmetic, deferred.
- Automated `release.yml` reworked for the flat repo but not yet exercised (0.1.0 was cut locally). Private-repo `slidey.zip` download needs the repo public or a token before non-dev installs work.

## 0.1.0 — 2026-09-07

First release. A hard fork of **Slides Extended v2.4.3** (MIT) — at this point functionally identical, with a new identity.

- Hard-forked into `joaovenari/slidey`. Rebranded: plugin id/name → `slidey`, version reset to `0.1.0`, plugin directory → `plugins/slidey/`, runtime distribution-zip download → this repo's releases (`slidey.zip`), user-facing strings → "Slidey". `LICENSE` keeps both upstream copyright lines plus ours.
- Dropped the `docs` submodule; flattened `reveal-dist` from a submodule to a plain directory. Normalized all line endings to LF (`.gitattributes`).
- Added `scripts/sync-reveal-assets.mjs` + `scripts/dev.mjs` and `pnpm dev:vault` / `pnpm reveal:build` — one-command dev loop that assembles a complete plugin folder into `se-test-vault/` (no GitHub release needed for local dev).
- Reworked `release.yml` and `build.yml` for the flattened repo (no submodules); `codeql.yml` de-referenced the removed `reveal-dist` branch.
- Build verified: `reveal-dist` build + 57 tests; plugin build + 138 tests / 90 snapshots; Biome clean.
- **Smoke-tested live in Obsidian** (over CDP): loads clean, renders the test deck (black theme, syntax highlighting, KaTeX, controls, progress bar), and all presentation-clicker keys — PageDown, PageUp, Space, ArrowRight/Left/Down — navigate correctly, including into and out of vertical slide stacks.
- Research pass on existing markdown-to-slides tools and Obsidian slide plugins (see Claude memory `slidey-research-markdown-slides`).
