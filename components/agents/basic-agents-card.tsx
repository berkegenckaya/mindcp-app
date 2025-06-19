"use client"

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
  onClick: (agentId: number) => void
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

export function BasicAgentCard({ agent, onClick }: BasicAgentCardProps) {
  const IconComponent = getAgentTypeIcon(agent.type)

  return (
    <Card
      className="
        relative group p-2
        rounded-2xl
        border border-white/35
        bg-white/18 backdrop-blur-md
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]
        transition-all duration-300
        hover:scale-[1.02] hover:bg-white/26
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_28px_rgba(0,0,0,0.2)]
        hover:cursor-pointer
      "
      onClick={() => onClick(agent.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Simple icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <IconComponent className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-gray-900">{agent.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={agent.status === "active" ? "default" : agent.status === "idle" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {agent.status}
                </Badge>
                <span className="text-xs text-gray-500">{getAgentTypeLabel(agent.type)}</span>
              </div>
            </div>
          </div>

          {/* Chat icon indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <MessageCircle className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</CardDescription>

        {/* Tools - show max 3 */}
        {agent.tools.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {agent.tools.slice(0, 3).map((tool) => (
                <Badge key={tool} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {tool}
                </Badge>
              ))}
              {agent.tools.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                  +{agent.tools.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Capabilities - show max 2 */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 2).map((cap) => (
                <Badge key={cap} variant="secondary" className="text-xs bg-amber-50 text-amber-700">
                  {cap}
                </Badge>
              ))}
              {agent.capabilities.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                  +{agent.capabilities.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </CardContent>
    </Card>
  )
}
