/* app/neural-networks/page.tsx */
"use client";

import {  Hourglass } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { IconBadge } from "@/components/icon-badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NeuralNetworksComingSoon() {
  return (
    <section className="relative flex h-[98.5vh] w-full items-center justify-center overflow-hidden py-24">
           <SidebarTrigger className="absolute left-4 top-4 z-20" />
      {/* ===== Glows ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[52rem] h-[52rem] rounded-full bg-purple-400/20 blur-3xl opacity-70 mix-blend-screen" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/3 w-[58rem] h-[58rem] rounded-full bg-cyan-400/20 blur-3xl opacity-60 mix-blend-screen" />
        <div className="absolute bottom-0 -left-1/3 translate-y-1/2 w-[52rem] h-[52rem] rounded-full bg-pink-400/20 blur-3xl opacity-60 mix-blend-screen" />
      </div>

      {/* ===== Card ===== */}
      <div
        className="
          relative z-10 mx-4 max-w-xl space-y-8 rounded-2xl p-10 text-center
          border border-white/35
          bg-white/18 backdrop-blur-md
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.16)]
        "
      >
        <IconBadge>
           
          <Hourglass size={38} className="text-white" /> 
        </IconBadge>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Neural&nbsp;Networks
        </h1>
        <p className="mx-auto max-w-md text-lg text-gray-700">
          This section is under construction. We’re training something
          incredible – check back soon to explore neural model dashboards,
          telemetry&nbsp;and more.
        </p>

        <div className="flex justify-center">
          <NeonButton title="  Notify&nbsp;Me" onClick={() => alert('You can subscribe to updates!')}>
           {/*  <Rocket className="mr-2 h-4 w-4" /> */}
          
          </NeonButton>
        </div>
      </div>
    </section>
  );
}