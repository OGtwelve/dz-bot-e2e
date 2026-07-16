import { describe, expect, test } from 'bun:test';

import { isFeatureEnabled } from './feature-flag';

describe('isFeatureEnabled', () => {
  test('accepts an enabled flag', () => {
    expect(isFeatureEnabled(['triage', 'review'], 'review')).toBe(true);
  });

  test('rejects an absent flag', () => {
    expect(isFeatureEnabled(['triage', 'review'], 'deploy')).toBe(false);
  });
});
