import { AgentDashboard } from "@/components/dashboard/agent-dashboard";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ">
      {/* Glowing background */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent"></div>
{/*                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>
 */}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 p-6  md:p-12">
        <AgentDashboard />
      </main>
    </div>
  );
}