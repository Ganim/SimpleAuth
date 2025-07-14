'use server'

import { api } from "@/http/api-client";

export async function signInWithEmailAndPassword(data: FormData) {
  const {email, password} = Object.fromEntries(data);

  const result = await api.post('sessions', {
    json:{
      email,
      password
    }
  }).json()

  console.log(result);
}