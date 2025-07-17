"use client"

import { checkUserRole } from "@/auth/check-user-role"
import type { ProfileProps } from "@/auth/get-user-profile"
import type { UserRole } from "@/auth/get-user-role"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ShieldUser, Users } from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userProfile: ProfileProps
  UserRole: UserRole
}

export function AppSidebar({ userProfile, UserRole, ...props }: AppSidebarProps) {

const menuTree = []

menuTree.push({
      title: "Dashboard",
      url: "/dashboard",
      icon: ShieldUser,
      isActive: false,
    }
)

if(checkUserRole("ADMIN", UserRole) || checkUserRole("MANAGER", UserRole)) {
  menuTree.push({
      title: "Users",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "See All Users",
          url: "/dashboard/users",
        },
        {
          title: "Create New",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    })
}

menuTree.push({
      title: "Settings",
      url: "/settings",
      icon: Users,
      isActive: false,
    }
)

// This is sample data.
const data = {
  user: {
    name: "John",
    surname: "Doe",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Simple Auth",
      logo: ShieldUser,
      plan: "Project",
    },
  ],
  navMain: menuTree,
  
}

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userProfile={userProfile} UserRole={UserRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
