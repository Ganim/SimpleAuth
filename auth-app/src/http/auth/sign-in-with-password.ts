import { api } from "./api-client";

interface HTTPSignInWithEmailAndPasswordRequest{
  email: string;
  password: string;
}
interface HTTPSignInWithEmailAndPasswordResponse{
  token: string;
}

export async function HTTPSignInWithEmailAndPassword({email, password}: HTTPSignInWithEmailAndPasswordRequest) {
  const {token} = await api.post('sessions', {
      json:{
        email,
        password
      }
    }).json<HTTPSignInWithEmailAndPasswordResponse>()

    return { token }
}