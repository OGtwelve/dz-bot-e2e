# CLAUDE.md — project brain for dz-bot-e2e

## What this is

`dz-bot-e2e` is a **throwaway end-to-end fixture** for the [developerz.ai](https://developerz.ai)
maintainer bot. It is intentionally tiny: one `parseConfig` function that carries a
**deliberately tracked bug**, plus the test that pins the expected behavior. The repo exists so the
maintainer bot can be exercised end-to-end (triage → assign → coding-agent fix → PR → review-park →
merge).

It is **not** a production library. Do not grow it, refactor it, or "harden" it.

## Stack

- **Runtime + package manager:** Bun — and *only* Bun. Never add npm/pnpm/yarn lockfiles (see `AGENTS.md`).
- **Language:** TypeScript, `strict`, `noEmit`.
- **Test runner:** `bun:test` (built in, no extra dependency).

## Layout

```
src/config.ts          parseConfig — HAS A DELIBERATE BUG (see below)
src/config.test.ts     pins expected behavior; 1 test fails by design
.maintainer.yml        developerz.ai maintainer-bot policy (handoff=fleet, auto_merge=false)
AGENTS.md              coding-agent contract — read it
.github/workflows/ci.yml   bun install → sleep 90 → bun test (the sleep is intentional)
CLAUDE.md              this file — the project brain
script/bootstrap       one-command setup (install + typecheck)
script/verify          one-command post-edit gate (typecheck + test)
```

## Commands

```bash
./script/bootstrap     # one-command setup: install deps + typecheck (clone → ready)
./script/verify        # post-edit gate: typecheck + test
bun test               # tests only
bun run typecheck      # tsc --noEmit only
```

> On a fresh checkout `bun test` reports **1 expected failure** — that is the deliberate bug below,
> not a broken setup. `./script/bootstrap` typechecks clean and exits 0.

## ⚠️ The deliberate bug — do not "fix" it unprompted

`src/config.ts:12` rejects an empty plugin list (`|| plugins.length === 0`), so
`parseConfig({ plugins: [] })` throws. `src/config.test.ts` expects it to return `{ plugins: [] }`.
**This failing test is the entire point of the fixture.** A coding-agent run is *meant* to reproduce
the failure, fix the implementation, and open a PR — that cycle *is* the end-to-end exercise.

Only touch `config.ts` when your assigned task is specifically that bug-fix run. Otherwise leave it
alone. Do not "tidy," reorder, or silently make the test pass.

## Conventions & guardrails

- **Bun only.** No npm/pnpm/yarn lockfiles.
- **Never merge a PR.** Review and merge are owned by the bot/mothership (`.maintainer.yml`: `auto_merge: false`). Open PRs and leave them open.
- The **`sleep 90` in CI is intentional** — it creates the pending-checks window the maintainer loop parks on. Leave it.
- `AGENTS.md` holds the full coding-agent contract; this file is the brain, that one is the rules.

## AI-first base

| Pillar | Status |
| --- | --- |
| **Project brain** | This file (`CLAUDE.md`). `AGENTS.md` is the companion agent contract. |
| **One-command DX** | `./script/bootstrap` (setup) + `./script/verify` (post-edit gate). |
| **Managed MCP servers** | A root `.mcp.json` wires `codegraph` and `developerz`; it lands via PR #1 (`developerz/mcp-codegraph`). **Merge PR #1 to enable both on `main`.** |
| **Code index** | Provided by the `codegraph` server in that same `.mcp.json` (local structural code graph). |

For this fixture the two *suggested* servers are intentionally **not** added:
`ui-debugger-mcp` (this repo drives no browser/UI) and `db-mcp-gateway` (no database; multi-repo gateway).

The `developerz` server needs a `DEVELOPERZ_API_KEY` shell environment variable (referenced, never
committed). `codegraph` is 100% local — install the `codegraph` CLI, no key, no egress.
