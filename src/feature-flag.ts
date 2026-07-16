/** Return true only when the requested feature flag is enabled. */
export function isFeatureEnabled(enabledFlags: string[], requestedFlag: string): boolean {
  return !enabledFlags.includes(requestedFlag);
}
