"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"

import { Radio, Headphones, Network, Coins } from "lucide-react"

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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { cn } from "@/lib/utils"

const streamData = [
  {
    title: "Dashboard",
    icon: Radio,
    url: "/",
    soon: false,
  },
]

const studioData = [
  {
    title: "Neural Network",
    icon: Network,
    url: "/neural",
    soon: true,
  },
]

const web3Data = [
  {
    title: "Revenue",
    icon: Coins,
    url: "/revenue",
    soon: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="bg-[#1a1a1a] border-r border-[#2a2a2a]" variant="sidebar" {...props}>
      <SidebarHeader className="bg-[#1a1a1a] p-6">
        <div className="flex flex-col items-center gap-3">
          <Image width={180} height={180} alt="" src="/logowhit.svg" ></Image>
          <div className="text-blue-400 text-xs font-medium tracking-wide"></div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#1a1a1a] px-4">
        {/* Stream Section */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium mb-3">Control Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {streamData.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="group">
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "rounded-lg h-10 px-4 mb-2 transition-all duration-200",
                        isActive(item.url)
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg"
                          : " hover:bg-[#3a3a3a]",
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3 relative">
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            isActive(item.url) ? "text-blue-400" : "text-gray-300",
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium transition-colors duration-200",
                            isActive(item.url) ? "text-white" : "text-white",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.soon && (
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            soon
                          </span>
                        )}
                        {isActive(item.url) && (
                          <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-[#2a2a2a] " />

        {/* Studio Section */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium mb-3">Network</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studioData.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="group">
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "rounded-lg h-10 px-4 mb-2 transition-all duration-200",
                        isActive(item.url)
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 shadow-lg"
                          : "hover:bg-[#2a2a2a]",
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3 relative">
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isActive(item.url) ? "text-purple-400" : "text-gray-400",
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium transition-colors duration-200",
                            isActive(item.url) ? "text-white" : "text-gray-300",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.soon && (
                          <span
                            className={cn(
                              "absolute -top-1 -right-1 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                              isActive(item.url) ? "bg-purple-400" : "bg-purple-500",
                            )}
                          >
                            soon
                          </span>
                        )}
                        {isActive(item.url) && (
                          <div className="absolute right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-[#2a2a2a] " />

        {/* Web3 Section */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium mb-3">Earn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {web3Data.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="group">
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "rounded-lg h-10 px-4 mb-2 transition-all duration-200",
                        isActive(item.url)
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 shadow-lg"
                          : "hover:bg-[#2a2a2a]",
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3 relative">
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isActive(item.url) ? "text-green-400" : "text-gray-400",
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium transition-colors duration-200",
                            isActive(item.url) ? "text-white" : "text-gray-300",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.soon && (
                          <span
                            className={cn(
                              "absolute -top-1 -right-1 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                              isActive(item.url) ? "bg-green-400" : "bg-purple-500",
                            )}
                          >
                            soon
                          </span>
                        )}
                        {isActive(item.url) && (
                          <div className="absolute right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#1a1a1a] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-[#2a2a2a] rounded-lg h-10 px-4">
              <a href="https://t.me/xEthanMCP" target="_blank" className="flex items-center gap-3">
                <Headphones className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 font-medium"> Support</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
