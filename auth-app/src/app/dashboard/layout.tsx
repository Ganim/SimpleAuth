import { isAuthenticated } from "@/auth/is-authenticated";

export default async function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

  await isAuthenticated();

  return (
    <>
      {children}
    </>
  )
}