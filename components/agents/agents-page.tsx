"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BasicAgentsGrid } from "./basic-agents-grid"
import { agents, Agent } from "@/lib/agents"

export default function AgentsPage() {
  const router = useRouter()

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
