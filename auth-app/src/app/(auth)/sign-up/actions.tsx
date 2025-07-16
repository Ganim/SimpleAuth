'use server'

import { HTTPSignUpWithEmailAndPassword } from "@/http/sign-up-with-password";
import { HTTPError } from "ky";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpFormSchema = z.object({
  email: z.email({message: "Invalid email format"}),
  emailConfirmation: z.email({message: "Invalid email format"}),
  password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
  passwordConfirmation: z.string().min(6, {message: "Password must be at least 6 characters long"}),
  name: z.string().min(1, {message: "Name is required"}).max(50),
  surname: z.string().min(1, {message: "Surname is required"}).max(50)
});

export async function signUpWithEmailAndPassword(data: FormData) {

  const formData = signUpFormSchema.safeParse(Object.fromEntries(data));
  
  if(!formData.success) {
    const errors = z.treeifyError(formData.error).properties;
    return { success: false, message: null, errors };
  }

  const {email, emailConfirmation, password, passwordConfirmation, name, surname} = formData.data;

  if(email !== emailConfirmation) {
    return { success: false, message: "Email addresses do not match", errors: null };
  }

  if(password !== passwordConfirmation) {
    return { success: false, message: "Passwords do not match", errors: null };
  }

  const profile = { 
    name, 
    surname 
  };

  try{
      await HTTPSignUpWithEmailAndPassword({email, password, profile});
    }
    catch (error) {
      if(error instanceof HTTPError) {
        const {message} = await error.response.json();
        return { success: false, message, errors: null };
      }
  
      return { success: false, message: 'Unexpected error occurred. Try again later.', errors: null };
  }

  redirect('/sign-in');
}