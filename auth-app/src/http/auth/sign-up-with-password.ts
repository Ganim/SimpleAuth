import { api } from "./api-client";

interface HTTPSignUpWithEmailAndPasswordRequest{
  email: string;
  password: string;
  profile: { 
    name: string;
    surname: string;
  }
}


export async function HTTPSignUpWithEmailAndPassword({email, password, profile}: HTTPSignUpWithEmailAndPasswordRequest) {
  const result = await api.post('register', {
      json:{
        email,
        password,
        profile
      }
    }).json()

    return result
}