# Changelog

All notable changes to Slidey are documented here. Newest first.
Upstream (Slides Extended) history is frozen in `CHANGELOG-upstream-slides-extended.md`.

## [Unreleased]

### 2026-09-07 — Fork established

- Hard-forked **Slides Extended v2.4.3** (MIT) into `joaovenari/slidey`. Rebranded: plugin id/name → `slidey`, version reset to `0.1.0`, plugin directory → `plugins/slidey/`, runtime distribution-zip download → this repo's releases (`slidey.zip`), user-facing strings → "Slidey".
- Dropped the `docs` submodule; flattened `reveal-dist` from a submodule to a plain directory.
- Normalized all line endings to LF (`.gitattributes`).
- Added `scripts/sync-reveal-assets.mjs` + `scripts/dev.mjs` and `pnpm dev:vault` / `pnpm reveal:build` — one-command dev loop that assembles a complete plugin folder into `se-test-vault/` (no GitHub release needed for local dev).
- Build verified: `reveal-dist` build + 57 tests pass; plugin build + 138 tests / 90 snapshots pass; Biome clean.
- Research pass on existing markdown-to-slides tools and Obsidian slide plugins (see Claude memory `slidey-research-markdown-slides`).

### Not yet done

- Live in-Obsidian smoke test (render a deck, presenter-clicker keys).
- Slidey's actual features: opinionated slide presets, reliable presentation-remote handling, image-layout defaults, PDF/PPTX export polish.
- Rebrand of internal TypeScript identifiers (`SlidesExtendedPlugin`, `slidesExtended-*.ts`) — cosmetic, deferred.
- CI (`build.yml` builds only the plugin; `release.yml` still references upstream's submodule flow and needs rework before the first real release).
