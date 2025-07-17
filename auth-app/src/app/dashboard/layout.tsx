import { getUserProfile } from "@/auth/get-user-profile";
import { getUserRole } from "@/auth/get-user-role";
import { isAuthenticated } from "@/auth/is-authenticated";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

  await isAuthenticated();

  const { profile } = await getUserProfile();
  const role = await getUserRole();
  
  if (!profile || !role) {
    return <div>Error loading user data</div>;
  }
  
  return (
    <SidebarProvider>
      <AppSidebar userProfile={profile} UserRole={role} />
      <SidebarInset>
      {children}
    </SidebarInset>
    </SidebarProvider>
  )
}