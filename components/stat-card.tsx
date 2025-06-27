import { ArrowRight } from 'lucide-react'
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FancyCardProps = {
  title: string
  description: string
  icon?: ReactNode
  href?: string
}

export function FancyCard({ title, description, icon, href }: FancyCardProps) {
  const CardContent = () => (
    <>
      {/* link badge */}
      {href && (
        <div
          className="
          absolute top-4 right-4
          inline-flex items-center justify-center
          w-8 h-8 rounded-xl
          border border-gray-600/50 bg-black/40 backdrop-blur-md
          text-gray-300
          shadow-lg
          transition-all
          group-hover:bg-black/60 group-hover:border-gray-500/70
        "
        >
          <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </div>
      )}

      {/* icon badge */}
      <div className="mb-4 relative w-12 h-12">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 blur-md opacity-90 scale-95 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform" />
        <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg">
          {icon ?? <span className="text-lg font-bold text-white">✦</span>}
        </div>
      </div>

      {/* text */}
      <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </>
  )

  const cardClasses = cn(
    `
    relative group p-5
    rounded-2xl
    border border-gray-700/50
    bg-black/40 backdrop-blur-md
    shadow-lg
    transition-all duration-300
    hover:scale-[1.02] hover:bg-black/60
    hover:border-gray-600/70 hover:shadow-xl
    `,
    href && "cursor-pointer",
  )

  if (href) {
    return (
      <a href={href} className={cardClasses}>
        <CardContent />
      </a>
    )
  }

  return (
    <div className={cardClasses}>
      <CardContent />
    </div>
  )
}
