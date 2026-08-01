# CLAUDE.md — project brain for dz-bot-e2e

> **The rule.** `dz-bot-e2e` is a **throwaway end-to-end fixture** for the
> [developerz.ai](https://developerz.ai) maintainer bot: one `parseConfig` function carrying a
> **deliberately tracked bug**, plus the test that pins it. The repo exists to exercise the bot
> end-to-end (triage → assign → coding-agent fix → PR → review-park → merge).
>
> **It is not a production library — do not grow it, refactor it, or "harden" it.**
> **Do not "fix" the bug unless your assigned task is specifically that bug-fix run** (see
> **The deliberate bug** below).

## Non-negotiables

These override any general instinct to "improve" the code. Follow them exactly.

| Rule | Why |
| --- | --- |
| **Bun only.** Never add npm/pnpm/yarn lockfiles. | Repo contract (`AGENTS.md`); single toolchain. |
| **Never merge a PR.** Open it and leave it open. | Review + merge are owned by the bot/mothership (`.maintainer.yml`: `auto_merge: false`). |
| **Do not touch `src/config.ts`** unless your task is the bug-fix run — no tidying, reordering, or silently making the test pass. | The failing test *is* the point of the fixture. |
| **Leave the `sleep 90` in CI alone.** | It creates the pending-checks window the maintainer loop parks on. |
| **Do not grow/harden the fixture.** No linter, no extra deps, no new features. | Throwaway fixture — keep it tiny. |
| After edits run `./script/verify` and **expect 1 failure** on a fresh checkout. | That failure is the deliberate bug, not a broken gate. |

`AGENTS.md` is the companion coding-agent contract — this file is the brain, that one is the rules.

## Stack

| | |
| --- | --- |
| **Runtime + package manager** | Bun — *only* Bun (`bun.lock`) |
| **Language** | TypeScript, `strict`, `noEmit` (`tsconfig.json`) |
| **Test runner** | `bun:test` (built in, no extra dependency) |
| **CI** | `bun install --frozen-lockfile` → `sleep 90` → `bun test` (`.github/workflows/ci.yml`) |

## Repo structure

```
src/config.ts              parseConfig — HAS A DELIBERATE BUG (see below)
src/config.test.ts         pins expected behavior; 1 test fails by design
.maintainer.yml            developerz.ai policy (handoff=fleet, auto_merge=false)
AGENTS.md                  coding-agent contract — the rules
CLAUDE.md                  this file — the project brain
script/bootstrap           setup: bun install + typecheck
script/verify              gate: typecheck + test
bin/setup  bin/dev  bin/check   runner-facing equivalents of script/*
.github/workflows/ci.yml   install → sleep 90 → test (sleep is intentional)
```

## Commands

| Command | What it does | Fresh-checkout result |
| --- | --- | --- |
| `./script/bootstrap` | `bun install --frozen-lockfile` + typecheck | ✅ exits 0 |
| `./script/verify` | typecheck + test | ⚠️ 1 expected failure (the bug) |
| `bun run typecheck` | `tsc --noEmit` only | ✅ exits 0 |
| `bun test` | tests only | ⚠️ 1 expected failure (the bug) |
| `bin/setup` · `bin/dev` · `bin/check` | runner-facing: install · `bun test --watch` · typecheck+test | `bin/check` shows the same 1 expected failure |

> There is no app/server in this fixture — **the test suite IS the dev loop.** No linter is
> configured; adding one would grow the fixture (see Non-negotiables).

## ⚠️ The deliberate bug — do not "fix" it unprompted

`src/config.ts:12` rejects an empty plugin list (`|| plugins.length === 0`), so
`parseConfig({ plugins: [] })` throws. `src/config.test.ts` expects it to return `{ plugins: [] }`.

- **This failing test is the entire point of the fixture.** A coding-agent run is *meant* to
  reproduce the failure, fix the implementation, and open a PR — that cycle *is* the end-to-end
  exercise.
- **Only touch `config.ts` when your assigned task is specifically that bug-fix run.** Otherwise
  leave it alone.

## Managed MCP servers

A root `.mcp.json` wires two servers. It is **not yet on `main`** — it lands via open
[PR #1](https://github.com/OGtwelve/dz-bot-e2e/pull/1) (`developerz/mcp-codegraph`). Merge PR #1 to
enable both on `main`.

| Server | Transport | Requires | Scope |
| --- | --- | --- | --- |
| `codegraph` | stdio | `codegraph` CLI — no key, no egress | 100% local structural code index |
| `developerz` | http | `DEVELOPERZ_API_KEY` env var (referenced, never committed) | maintainer-bot API |

> The two *suggested* servers are intentionally **not** added: `ui-debugger-mcp` (no browser/UI) and
> `db-mcp-gateway` (no database). Adding them would grow the fixture.
