import { describe, expect, test } from 'bun:test';

import { isPluginEnabled } from './plugin';

describe('isPluginEnabled', () => {
  test('returns true for a configured plugin', () => {
    expect(isPluginEnabled(['lint', 'test'], 'lint')).toBe(true);
  });

  test('returns false for an absent plugin', () => {
    expect(isPluginEnabled(['lint', 'test'], 'deploy')).toBe(false);
  });
});
