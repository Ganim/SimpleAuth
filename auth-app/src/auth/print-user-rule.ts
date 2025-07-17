import type { UserRule } from "./get-user-rule";

export function printUserRule(userRule: UserRule | null) {
  if (!userRule) {
    return "No user rule available.";
  }

  if(userRule === "USER"){
    return 'Usuário'
  }
  if(userRule === "MANAGER"){
    return 'Gerente'
  }
  if(userRule === "ADMIN"){
    return 'Administrador'
  }
} 