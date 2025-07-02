"use client"

import { usePathname } from "next/navigation"
import CustomWalletButton from "./custom-connect"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { cn } from "@/lib/utils"

export default function Header() {
    const pathname = usePathname()
  if (pathname.startsWith("/chat")) return null
  const { state, isMobile } = useSidebar()

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-50  p-4 transition-all duration-300 ease-in-out",
        // Desktop positioning based on sidebar state
        !isMobile && state === "expanded" && "left-64", // When sidebar is expanded (16rem = 64)
        !isMobile && state === "collapsed" && "left-12", // When sidebar is collapsed (3rem = 12)
        // Mobile positioning
        isMobile && "left-0",
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side - SidebarTrigger */}
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
        </div>

        {/* Right side - CustomWalletButton */}
        <div className="flex items-center">
          <CustomWalletButton />
        </div>
      </div>
    </header>
  )
}
