export interface ProjectConfig {
  plugins: string[];
}

/** Parse the small project config used by this end-to-end fixture. */
export function parseConfig(input: unknown): ProjectConfig {
  if (typeof input !== 'object' || input === null) {
    throw new TypeError('config must be an object');
  }

  const plugins = (input as { plugins?: unknown }).plugins;
  if (!Array.isArray(plugins)) {
    throw new TypeError('plugins must be an array');
  }

  if (!plugins.every((plugin) => typeof plugin === 'string')) {
    throw new TypeError('plugins must contain only strings');
  }

  return { plugins };
}
