import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FancyCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  href?: string;
};

export function FancyCard({ title, description, icon, href }: FancyCardProps) {
  return (
    <div
      className={cn(
        `
        relative group p-5
        rounded-2xl
        border border-white/35
        bg-white/18 backdrop-blur-md
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]
        transition-all duration-300
        hover:scale-[1.02] hover:bg-white/26
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_28px_rgba(0,0,0,0.2)]
      `
      )}
    >
      {/* link badge */}
      {href && (
        <a
          href={href}
          className="
            absolute top-4 right-4
            inline-flex items-center justify-center
            w-8 h-8 rounded-xl
            border border-white/40 bg-white/25 backdrop-blur-md
            text-gray-700
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]
            transition-all
            hover:bg-white/35
          "
        >
          <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </a>
      )}

      {/* icon badge */}
      <div className="mb-4 relative w-12 h-12">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90 scale-95 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform" />
        <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
          {icon ?? <span className="text-lg font-bold text-white">✦</span>}
        </div>
      </div>

      {/* text */}
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}