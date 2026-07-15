/** Format a project name as a deterministic ASCII slug. */
export function formatProjectSlug(name: string): string {
  const slug = name
    .trim()
    .replace(/[A-Z]/g, (letter) => letter.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length === 0) {
    throw new TypeError('project name must contain letters or digits');
  }

  return slug;
}
