import { Username } from '@/entities/core/value-objects/username';

// Simple utility to generate unique usernames during E2E tests
export function uniqueUsername() {
  return Username.random().value;
}
