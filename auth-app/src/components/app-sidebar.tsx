"use client"


import { checkUserRule } from "@/auth/check-user-rule"
import type { ProfileProps } from "@/auth/get-user-profile"
import type { UserRule } from "@/auth/get-user-rule"
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
  UserRule: UserRule
}

export function AppSidebar({ userProfile, UserRule, ...props }: AppSidebarProps) {

const menuTree = []

menuTree.push({
      title: "Dashboard",
      url: "/dashboard",
      icon: ShieldUser,
      isActive: false,
    }
)

if(checkUserRule("ADMIN", UserRule) || checkUserRule("MANAGER", UserRule)) {
  menuTree.push({
      title: "Users",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "See All Users",
          url: "#",
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
        <NavUser userProfile={userProfile} UserRule={UserRule} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
