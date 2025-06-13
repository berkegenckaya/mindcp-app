/* components/IconBadge.tsx */
import { ReactNode } from "react";

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="relative  mx-auto w-20 h-20 mb-4 shrink-0">
      {/* arka katman */}
      <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90" />
      {/* ön katman */}
      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
        {children ?? <span className="text-lg font-bold text-white">✦</span>}
      </div>
    </div>
  );
}