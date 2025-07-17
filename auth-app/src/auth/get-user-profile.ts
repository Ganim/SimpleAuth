
import { HTTPGetProfile } from "@/http/auth/get-profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface ProfileProps{
    name: string;
    id: string;
    userId: string;
    surname: string;
    bio: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserProfile(){
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect (process.env.BASE_URL + '/sign-in');
  }

  try {
    const {profile} = await HTTPGetProfile()

    return {profile}

  } catch(error){
    console.error("Error fetching user profile:", error);
  }

  redirect (process.env.BASE_URL + 'api/auth/sign-out');
} 