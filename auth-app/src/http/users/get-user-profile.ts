import { api } from "../auth/api-client";

interface HTTPGetUserProfileResponse {
  profile: {
    name: string;
    surname: string;
    bio: string;
    avatarUrl: string;
    userId: string;
  }
}

export async function HTTPGetUserProfile(id: string) {
  const result = await api.get(`users/${id}`).json<HTTPGetUserProfileResponse>();
  return result;
}
