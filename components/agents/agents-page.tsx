"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BasicAgentsGrid } from "./basic-agents-grid"


interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  tools: string[]
  capabilities?: string[]
  createdAt: string
}

export default function BasicAgentsPage() {
  const router = useRouter()

  const [agents] = React.useState<Agent[]>([
    {
      id: 1,
      name: "On-Chain Analyst",
      description:
        "Analyzes blockchain data and generates reports on token performance and trends",
      type: "analytics",
      status: "active",
      tools: ["coingecko", "dexscrenner", "mindcp", "openai-gpt-4o-mini"],
      capabilities: ["on-chain", "data-analysis", "data-visualization"],
      createdAt: "2025-01-20",
    },
   
  ])

  const handleAgentClick = (agentId: number) => {
    // Navigate to chat screen with the selected agent
    router.push(`/chat/${agentId}`)
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Your AI Agent</h1>
          <p className="mt-2 text-gray-600">Select an agent to start a conversation</p>
        </div>

        {/* Agents Grid */}
        <BasicAgentsGrid agents={agents} onAgentClick={handleAgentClick} />
      </div>
    </div>
  )
}
