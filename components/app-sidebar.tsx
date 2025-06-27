"use client"

import type * as React from "react"
import { Bot, Brain, Home, ChevronRight, User, Coins } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "AI Agents",
      url: "/agents",
      icon: Bot,
    },
    {
      title: "Neural Networks",
      url: "/neural",
      icon: Brain,
    },
    {
      title: "Revenue",
      url: "/revenue",
      icon: Coins,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-none" variant="floating" {...props}>
      <SidebarHeader className="bg-black">
        <div className="flex items-center gap-2 px-4 py-3">
          <Image
            src="/Logonamee.svg"
            alt="MindCP Logo"
            width={200}
            height={20}
            className="scale-75 brightness-0 invert"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 px-3 py-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <a
                      href={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all duration-200 hover:bg-gray-800/60 hover:text-white active:bg-gray-700"
                    >
                      <item.icon className="h-4 w-4 transition-colors group-hover:text-purple-400" />
                      <span className="text-sm font-medium flex-1">{item.title}</span>
                      <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 group-hover:text-purple-400" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-black">
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Neural Credits</p>
            <p className="text-sm font-semibold text-white">2,847 remaining</p>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail className="bg-[#141414]" />
    </Sidebar>
  )
}
