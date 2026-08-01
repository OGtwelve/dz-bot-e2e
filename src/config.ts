export interface ProjectConfig {
  plugins: string[];
}

/** Parse the small project config used by this end-to-end fixture. */
export function parseConfig(input: unknown): ProjectConfig {
  if (typeof input !== 'object' || input === null) {
    throw new TypeError('config must be an object');
  }

  const plugins = (input as { plugins?: unknown }).plugins;
  if (!Array.isArray(plugins) || plugins.length === 0) {
    throw new TypeError('plugins must be a non-empty array');
  }

  if (!plugins.every((plugin) => typeof plugin === 'string')) {
    throw new TypeError('plugins must contain only strings');
  }

  // Copy at the return: `plugins` is the CALLER's array, so handing it back
  // by reference lets a later `input.plugins.push(...)` mutate a config this
  // function already validated.
  return { plugins: [...plugins] };
}
