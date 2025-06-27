"use client"

import { useRouter } from "next/navigation"
import { Bot, MessageCircle, Brain, Zap, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface BasicAgentCardProps {
  agent: Agent
}

const getAgentTypeIcon = (type: string) => {
  switch (type) {
    case "analytics":
      return Brain
    case "creative":
      return Zap
    case "development":
      return Settings
    default:
      return Bot
  }
}

const getAgentTypeLabel = (type: string) => {
  switch (type) {
    case "analytics":
      return "Data Analytics"
    case "creative":
      return "Creative Assistant"
    case "development":
      return "Code Assistant"
    case "customer":
      return "Customer Support"
    default:
      return "AI Agent"
  }
}

export function BasicAgentCard({ agent }: BasicAgentCardProps) {
  const router = useRouter()
  const IconComponent = getAgentTypeIcon(agent.type)

  const handleClick = () => {
    const agentData = encodeURIComponent(
      JSON.stringify({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        type: agent.type,
        status: agent.status,
        tools: agent.tools,
        capabilities: agent.capabilities,
      }),
    )
    router.push(`/chat/${agent.id}?data=${agentData}`)
  }

  return (
    <Card
      className="
    relative group cursor-pointer rounded-2xl p-2
    border border-gray-700/50
    bg-black/60 backdrop-blur-md
    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_6px_22px_rgba(0,0,0,0.3)]
    transition-all duration-300
    hover:scale-[1.02] hover:bg-black/80
    hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_28px_rgba(0,0,0,0.4)]
  "
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Glassmorphic icon with neon glow */}
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </div>

            <div>
              <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={agent.status === "active" ? "default" : agent.status === "idle" ? "secondary" : "outline"}
                  className="text-xs bg-white/20 backdrop-blur-sm border-white/30"
                >
                  {agent.status}
                </Badge>
                <span className="text-xs text-gray-300">{getAgentTypeLabel(agent.type)}</span>
              </div>
            </div>
          </div>

          {/* Chat icon with neon glow on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 blur-sm opacity-60" />
              <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-lg">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-300 mb-4 line-clamp-2">{agent.description}</CardDescription>

        {/* Tools with glassmorphic badges */}
        {agent.tools.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {agent.tools.slice(0, 3).map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/50 backdrop-blur-sm"
                >
                  {tool}
                </Badge>
              ))}
              {agent.tools.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-800/60 text-gray-300 border-gray-600/50 backdrop-blur-sm"
                >
                  +{agent.tools.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Capabilities with amber glassmorphic badges */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {agent.capabilities.slice(0, 2).map((cap) => (
                <Badge
                  key={cap}
                  className="text-xs bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-blue-200 backdrop-blur-sm border border-blue-400/30"
                >
                  {cap}
                </Badge>
              ))}
              {agent.capabilities.length > 2 && (
                <Badge className="text-xs bg-gray-800/60 text-gray-300 border-gray-600/50 backdrop-blur-sm">
                  +{agent.capabilities.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  )
}
