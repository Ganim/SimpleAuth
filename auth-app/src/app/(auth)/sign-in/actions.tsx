'use server'

import { HTTPSignInWithEmailAndPassword } from "@/http/sign-in-with-password";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const signInFormSchema = z.object({
  email: z.email({message: "Invalid email format"}),
  password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
});

export async function signInWithEmailAndPassword(data: FormData) {

  const formData = signInFormSchema.safeParse(Object.fromEntries(data));

  if(!formData.success) {
    const errors = z.treeifyError(formData.error).properties;
    return { success: false, message: null, errors };
  } 

  const {email, password} = formData.data;

  try{
    const { token } = await HTTPSignInWithEmailAndPassword({ email, password });

    (await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
  }
  catch (error) {
    if(error instanceof HTTPError) {
      const {message} = await error.response.json();
      return { success: false, message, errors: null };
    }

    return { success: false, message: 'Unexpected error occurred. Try again later.', errors: null };
  }

  return redirect('/dashboard');
}