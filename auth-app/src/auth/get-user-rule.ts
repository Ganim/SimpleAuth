
import { cookies } from "next/headers";

export type UserRule = "USER" | "MANAGER" | "ADMIN";

export async function getUserRule(): Promise<UserRule | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    const role = decodedPayload.role;
    if (role === "USER" || role === "MANAGER" || role === "ADMIN") {
      return role;
    }
    return null;
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return null;
  }
}