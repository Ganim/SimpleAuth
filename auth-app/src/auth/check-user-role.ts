import type { UserRole } from "./get-user-role";

export function checkUserRole(role: UserRole, userRole: UserRole | null) {
  if (!userRole) {
    return false;
  }

  if (userRole !== role) {
    return false;
  }

  return true;
}