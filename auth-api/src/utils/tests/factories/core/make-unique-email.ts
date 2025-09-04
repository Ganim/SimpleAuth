// Simple utility to generate unique emails during E2E tests
export function makeUniqueEmail(prefix: string = 'user') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}@example.com`;
}
