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
    <div
      className={cn(
        `
        relative flex items-start gap-4 p-5
        rounded-xl
        border border-gray-700/50
        bg-black/40 backdrop-blur-md
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_4px_18px_rgba(0,0,0,0.3)]
        transition-all duration-300
        hover:scale-[1.02] hover:bg-black/60
        hover:border-gray-600/70
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_6px_24px_rgba(0,0,0,0.4)]
      `,
      )}
    >
      {/* icon badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg">
        {icon}
      </div>

      {/* content */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-white leading-tight">
          {step && <span className="mr-2 text-xs font-medium text-gray-400">Step {step}</span>}
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-300">{description}</p>
      </div>
    </div>
  )
}
