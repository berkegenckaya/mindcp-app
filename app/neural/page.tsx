"use client"

import { Brain, Hourglass, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function NeuralNetworksComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-20 md:-top-40 left-1/2 -translate-x-1/2 w-[32rem] md:w-[52rem] h-[32rem] md:h-[52rem] rounded-full bg-purple-500/10 blur-3xl opacity-70" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/3 w-[36rem] md:w-[58rem] h-[36rem] md:h-[58rem] rounded-full bg-blue-500/10 blur-3xl opacity-60" />
          <div className="absolute bottom-0 -left-1/3 translate-y-1/2 w-[32rem] md:w-[52rem] h-[32rem] md:h-[52rem] rounded-full bg-cyan-500/10 blur-3xl opacity-60" />
        </div>

        {/* Main Card */}
        <div className="relative z-10 mx-4 w-full max-w-sm md:max-w-2xl space-y-6 md:space-y-8 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center border border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)]  hover:bg-gradient-to-br hover:from-white/12 hover:via-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500">
          {/* Enhanced glassmorphic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl" />

          {/* Icon Badge */}
          <div className="relative z-10 flex justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:border-white/30 transition-all duration-300 group-hover:scale-110">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:text-gray-100 transition-colors duration-300">
                Neural Networks
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Hourglass className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                <span className="text-xs md:text-sm font-medium tracking-wide">COMING SOON</span>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              </div>
            </div>

            <p className="mx-auto max-w-sm md:max-w-lg text-sm md:text-lg text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
              MindCP connects autonomous agents in a peer to peer mesh where they can call each other, share context,
              and complete tasks together. Every interaction is signed on-chain, every output is provable, and node
              operators earn as their agents work.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 group-hover:from-white/15 group-hover:to-white/8 group-hover:border-white/30 transition-all duration-300">
                <h3 className="text-white font-semibold text-xs md:text-sm mb-1 md:mb-2">Agent to Agent Calls</h3>
                <p className="text-gray-400 text-xs">Agents collaborate in real time to deliver complex outcomes</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 group-hover:from-white/15 group-hover:to-white/8 group-hover:border-white/30 transition-all duration-300">
                <h3 className="text-white font-semibold text-xs md:text-sm mb-1 md:mb-2">Verifiable Output</h3>
                <p className="text-gray-400 text-xs">
                  Cryptographic proofs guarantee the origin and integrity of every result
                </p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 group-hover:from-white/15 group-hover:to-white/8 group-hover:border-white/30 transition-all duration-300">
                <h3 className="text-white font-semibold text-xs md:text-sm mb-1 md:mb-2">Earn While You Run</h3>
                <p className="text-gray-400 text-xs">
                  Usage fees flow to developers and node operators in ETH while user data stays private
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-3 md:pt-4">
              <Link href="https://t.me/MindCPAI" target="_blank" rel="noopener noreferrer">
                <button className="group/btn inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 font-semibold text-sm md:text-base text-black bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    Notify Me
                  </span>
                </button>
              </Link>

              <Link href="https://docs.mindcp.ai/technology/mindcp-neural-network" target="_blank" rel="noopener noreferrer">
                <button className="group/btn inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 font-semibold text-sm md:text-base text-white bg-transparent backdrop-blur-md rounded-full shadow-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 border border-white/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span className="relative z-10 flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    Learn More
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />

          {/* Enhanced hover glow effect */}
          <div
            aria-hidden
            className="
            absolute inset-0 rounded-2xl md:rounded-3xl
            bg-gradient-to-br from-white/0 via-white/0 to-white/0
            group-hover:from-white/5 group-hover:via-white/3 group-hover:to-white/8
            transition-all duration-500
            "
          />

          {/* Border glow on hover */}
          <div
            aria-hidden
            className="
            absolute inset-0 rounded-2xl md:rounded-3xl
            ring-1 ring-transparent
            group-hover:ring-white/20
            transition-all duration-500
            "
          />
        </div>
      </section>
    </div>
  )
}
