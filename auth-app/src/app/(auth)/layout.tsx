import { isAuthenticated } from "@/auth/is-authenticated";
import { redirect } from "next/navigation";

export default async function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {

  if(await isAuthenticated()) {
    return redirect('/dashboard');
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {children}
      </div>
    </div>
  )
}