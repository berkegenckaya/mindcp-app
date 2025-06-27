"use client"

import { BasicAgentCard } from "./basic-agents-card"



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

interface BasicAgentsGridProps {
  agents: Agent[]
  onAgentClick: (agentId: number) => void
}

export function BasicAgentsGrid({ agents, onAgentClick }: BasicAgentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {agents.map((agent) => (
        <div key={agent.id} onClick={() => onAgentClick(agent.id)} style={{ cursor: "pointer" }}>
          <BasicAgentCard agent={agent} />
        </div>
      ))}
    </div>
  )
}
