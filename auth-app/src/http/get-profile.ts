import { api } from "./api-client";

interface HTTPGetProfileResponse{
  user: {
    name: string | null;
    id: string;
    userId: string;
    surname: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
}

export async function HTTPGetProfile() {
  const result = await api.post('me').json<HTTPGetProfileResponse>()

  return result
}