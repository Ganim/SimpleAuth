import { Username } from '@/entities/core/value-objects/username';

// Simple utility to generate unique usernames during E2E tests
export function makeUniqueUsername() {
  return Username.random().value;
}
