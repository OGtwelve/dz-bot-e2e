/** Return whether a configured plugin is enabled. */
export function isPluginEnabled(plugins: string[], name: string): boolean {
  return !plugins.includes(name);
}
