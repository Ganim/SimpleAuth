import { api } from "./api-client";

interface signInWithPasswordRequest{
  email: string;
  password: string;
}
interface signInWithPasswordResponse{
  user: {
    email: string;
    id: string;
    password_hash: string;
    role: 'USER';
    createdAt: Date;
    updatedAt: Date;
}
}

export async function signInWithPassword({email, password}: signInWithPasswordRequest) {
  const result = await api.post('users', {
      json:{
        email,
        password
      }
    }).json<signInWithPasswordResponse>()

    return result
}