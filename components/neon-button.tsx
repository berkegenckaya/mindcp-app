import { Button } from "./ui/button";



export function NeonButton({title}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
   <Button className="
      relative inline-flex items-center justify-center cursor-pointer
      px-6 py-2  tracking-wider leading-6 font-bold text-gray-900
      rounded-full border border-white/40 mt-1
      bg-white/20 backdrop-blur-md
      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),0_4px_24px_rgba(0,0,0,0.15)]
      transition-all duration-300 ease-in-out
      hover:bg-white/30
      hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),0_6px_28px_rgba(0,0,0,0.2)]
      focus:outline-none
    "
  >
        {/*   <Plus className="h-4 w-4 mr-2" /> */}
      {title}
        </Button>
  );
}