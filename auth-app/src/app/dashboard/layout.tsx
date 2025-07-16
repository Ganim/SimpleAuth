import { isAuthenticated } from "@/auth/is-authenticated";

export default async function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

  const {user} = await isAuthenticated()

  return (
    <>
      <header>
        <h1>Welcome, {user.name}</h1>
      </header>
      {children}
    </>
  )
}