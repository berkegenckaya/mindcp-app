import type React from "react"
import { cn } from "@/lib/utils"

type AgentGuideCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  step?: number
}

export function AgentGuideCard({ title, description, icon, step }: AgentGuideCardProps) {
  return (
    <>
    
    <div
    
      className={cn(
        `
        relative overflow-hidden group flex items-start gap-4 p-6
        rounded-2xl border
        border-0.5 border-[#2a2a2a]
        bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-xl
    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_6px_22px_rgba(0,0,0,0.05)]
        transition-all duration-300 ease-out
        hover:bg-gradient-to-br hover:from-white/12 hover:via-white/8 hover:to-white/5
        hover:border-white/20 hover:scale-[1.02]
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.5)]
        `,
      )}
    >
      
      {/* Enhanced glassmorphic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Icon badge with glassmorphic styling */}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:border-white/30 transition-all duration-300">
        <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <h3 className="text-base font-semibold text-white leading-tight group-hover:text-gray-100 transition-colors duration-300">
          {step && (
            <span className="mr-2 text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300">
              Step {step}
            </span>
          )}
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />

      {/* Enhanced hover glow effect */}
      <div
        aria-hidden
        className="
        absolute inset-0 rounded-2xl
        bg-gradient-to-br from-white/0 via-white/0 to-white/0
        group-hover:from-white/3 group-hover:via-white/2 group-hover:to-white/5
        transition-all duration-500
        "
      />

      {/* Border glow on hover */}
      <div
        aria-hidden
        className="
        absolute inset-0 rounded-2xl
        ring-1 ring-transparent
        group-hover:ring-white/15
        transition-all duration-500
        "
      />
    </div></>
  )
}
