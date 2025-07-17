import type { UserRole } from "./get-user-role";

export function printUserRole(userRole: UserRole | null) {
  if (!userRole) {
    return "No user role available.";
  }

  if(userRole === "USER"){
    return 'Usuário'
  }
  if(userRole === "MANAGER"){
    return 'Gerente'
  }
  if(userRole === "ADMIN"){
    return 'Administrador'
  }
} 