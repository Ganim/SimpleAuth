import type { UserRule } from "./get-user-rule";

export function checkUserRule(rule: UserRule, userRule: UserRule | null) {
  if (!userRule) {
    return false;
  }

  if (userRule !== rule) {
    return false;
  }

  return true;
}