import { api } from "../auth/api-client";

interface HTTPSelectAllUsersResponse{
    users: {
        id: string
        email: string
        role: string
    }[]
}

export async function HTTPSelectAllUsers(){
  const result = await api.get('users').json<HTTPSelectAllUsersResponse>();
  
  return result;
}