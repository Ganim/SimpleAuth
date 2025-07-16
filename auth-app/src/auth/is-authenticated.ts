import { HTTPGetProfile } from "@/http/get-profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect ('/sign-in');
  }

  try {
    const {user} = await HTTPGetProfile()

    return {user}

  } catch{
    cookieStore.delete('token');
  }

  redirect ('/sign-in');
}