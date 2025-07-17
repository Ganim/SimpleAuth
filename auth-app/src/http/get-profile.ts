import { api } from "./api-client";

interface HTTPGetProfileResponse{
  profile: {
    name: string;
    id: string;
    userId: string;
    surname: string;
    bio: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export async function HTTPGetProfile() {
  const result = await api.get('me').json<HTTPGetProfileResponse>();

  return result;
}