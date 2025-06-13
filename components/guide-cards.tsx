import { cn } from "@/lib/utils";

type AgentGuideCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  step?: number;
};

export function AgentGuideCard({
  title,
  description,
  icon,
  step,
}: AgentGuideCardProps) {
  return (
    <div
      className={cn(
        `
        relative flex items-start gap-4 p-5
        rounded-xl
        border border-white/35
        bg-white/18 backdrop-blur-md
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_4px_18px_rgba(0,0,0,0.13)]
        transition-all duration-300
        hover:scale-[1.02] hover:bg-white/26
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_6px_24px_rgba(0,0,0,0.18)]
      `
      )}
    >
      {/* icon badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 text-white shadow-inner">
        {icon}
      </div>

      {/* content */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 leading-tight">
          {step && (
            <span className="mr-2 text-xs font-medium text-gray-400">
              Step {step}
            </span>
          )}
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}