import { api } from "../auth/api-client";

export async function HTTPDeleteUser(id: string) {
  await api.delete(`users/${id}`);
}
