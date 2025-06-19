"use client"
import { Brain, Zap, Settings, Bot } from "lucide-react"
import { AgentCard } from "./agents-card"

interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  context: string[]
  tools: string[]
  capabilities?: string[]
  createdAt: string
}

const agentTypes = [
  { value: "analytics", label: "Data Analytics", icon: Brain },
  { value: "creative", label: "Creative Assistant", icon: Zap },
  { value: "development", label: "Code Assistant", icon: Settings },
  { value: "customer", label: "Customer Support", icon: Bot },
]

interface AgentsGridProps {
  agents: Agent[]
  editingAgent: number | null
  onEdit: (id: number | null) => void
  onDelete: (id: number) => void
  onAddContext: (id: number, context: string) => void
  onRemoveContext: (id: number, index: number) => void
}

export function AgentsGrid({ agents, editingAgent, onEdit, onDelete, onAddContext, onRemoveContext }: AgentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          agentTypes={agentTypes}
          editingAgent={editingAgent}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddContext={onAddContext}
          onRemoveContext={onRemoveContext}
        />
      ))}
    </div>
  )
}
