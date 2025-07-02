import { ArrowRight } from "lucide-react"
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
 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      {/* link badge */}
      {href && (
        <div
          className="
          absolute top-4 right-4
          inline-flex items-center justify-center
          w-8 h-8 rounded-xl
           bg-white/25 backdrop-blur-md
          text-white
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]
          transition-all
          group-hover:bg-white/35
        "
        >
          <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </div>
      )}

      {/* icon badge */}
      <div className="mb-4 relative w-12 h-12">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90 scale-95 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform" />
        <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
          {icon ?? <span className="text-lg font-bold text-white">✦</span>}
        </div>
      </div>

      {/* text */}
      <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-200">{description}</p>
    </>
  )

  const cardClasses = cn(
    `
    relative group p-5
    rounded-2xl 
   
    bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 backdrop-blur-md
    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_6px_22px_rgba(0,0,0,0.05)]
    transition-all duration-300
    hover:scale-[1.02] hover:bg-white/26
    hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_28px_rgba(0,0,0,0.2)]
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
