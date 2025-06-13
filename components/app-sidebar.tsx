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
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
         
            <Image
              src="/Logonamee.svg"
              alt="MindCP Logo"
              width={200}
              height={20}
             className="scale-75"
            />
        
         {/*  <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MindCP
            </span>
            <span className="truncate text-xs text-muted-foreground">AI Platform</span>
          </div> */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <a
                      href={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent/50"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm font-medium">{item.title}</span>
                      <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-3 border border-purple-500/20">
            <p className="text-xs text-muted-foreground mb-1">Neural Credits</p>
            <p className="text-sm font-semibold">2,847 remaining</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
