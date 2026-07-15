import { describe, expect, test } from 'bun:test';

import { formatProjectSlug } from './project-slug';

describe('formatProjectSlug', () => {
  test('trims and lowercases project names', () => {
    expect(formatProjectSlug(' DeveloperZ AI ')).toBe('developerz-ai');
  });

  test('collapses non-alphanumeric runs and strips edge hyphens', () => {
    expect(formatProjectSlug('---API___Worker---')).toBe('api-worker');
  });

  test('keeps ASCII letters and digits', () => {
    expect(formatProjectSlug('Release 2026')).toBe('release-2026');
  });

  test('rejects names without ASCII letters or digits', () => {
    expect(() => formatProjectSlug(' --- ')).toThrow(
      new TypeError('project name must contain letters or digits'),
    );
  });
});
