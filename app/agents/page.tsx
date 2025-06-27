import AgentsPage from "@/components/agents/agents-page";

export default function AgentsPageRoute() {
  return   <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Glowing background */}
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent"></div>
  {/*                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>
   */}
        </div>
  
        {/* Main content */}
        <main className="relative z-10 flex-1 p-6 md:p-12">
          <AgentsPage />
        </main>
      </div>
}
