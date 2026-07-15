# dz-bot-e2e

Throwaway repository for end-to-end tests of the developerz.ai maintainer bot.

The fixture is intentionally tiny. `src/config.ts` currently contains a tracked
bug, and `src/config.test.ts` captures the expected behavior. A coding-agent run
must reproduce the failing test, fix the implementation, rerun the tests, and
open a pull request without merging it.

## Commands

```bash
bun test
bun run typecheck
```
