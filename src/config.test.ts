import { describe, expect, test } from 'bun:test';

import { parseConfig } from './config';

describe('parseConfig', () => {
  test('preserves a configured plugin list', () => {
    expect(parseConfig({ plugins: ['lint', 'test'] })).toEqual({
      plugins: ['lint', 'test'],
    });
  });

  test('accepts an empty plugin list', () => {
    expect(parseConfig({ plugins: [] })).toEqual({ plugins: [] });
  });

  test('rejects non-string plugins', () => {
    expect(() => parseConfig({ plugins: ['lint', 42] })).toThrow(
      'plugins must contain only strings',
    );
  });
});

test('the returned config cannot be mutated through the input object', () => {
  const input = { plugins: ['a', 'b'] };
  const cfg = parseConfig(input);
  input.plugins.push('c');
  expect(cfg.plugins).toEqual(['a', 'b']);
});
