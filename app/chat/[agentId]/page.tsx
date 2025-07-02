"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Send, Bot, Paperclip, MoreVertical, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useChat } from "ai/react"
import { ChatMessage } from "@/components/chat-message"

interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  tools: string[]
  capabilities?: string[]
}

// Updated Neon Button Component for Dark Theme
function NeonButton({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "default",
  size = "default",
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  title?: string
}) {
  const baseClasses =
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 group"

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const variantClasses = {
    default:
      "bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white border border-white/20 shadow-lg hover:from-purple-400 hover:to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    ghost:
      "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 text-white hover:from-white/15 hover:to-white/8 hover:border-white/30",
    outline:
      "bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/30 text-white hover:from-white/12 hover:to-white/6 hover:border-purple-400/50",
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const agentId = Number.parseInt(params.agentId as string)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [connectionError, setConnectionError] = React.useState<string | null>(null)

  // Get agent data from URL params
  const [agent, setAgent] = React.useState<Agent | null>(null)

  React.useEffect(() => {
    const agentDataParam = searchParams.get("data")
    if (agentDataParam) {
      try {
        const agentData = JSON.parse(decodeURIComponent(agentDataParam))
        setAgent(agentData)
      } catch (error) {
        console.error("Failed to parse agent data:", error)
        // Fallback to default agent data
        setAgent({
          id: agentId,
          name: `Agent ${agentId}`,
          description: "AI Assistant",
          type: "analytics",
          status: "active",
          tools: ["OpenAI GPT-4o"],
          capabilities: ["general-assistance"],
        })
      }
    } else {
      // Fallback if no data provided
      setAgent({
        id: agentId,
        name: `Agent ${agentId}`,
        description: "AI Assistant",
        type: "analytics",
        status: "active",
        tools: ["OpenAI GPT-4o"],
        capabilities: ["general-assistance"],
      })
    }
  }, [agentId, searchParams])

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Hello! I'm your enhanced on-chain analysis agent. I can help you with:\n\n• **Token Information** - Get details about any cryptocurrency\n\n• **DEX Pairs** - Search and analyze trading pairs\n\n• **Trending Pools** - Discover popular liquidity pools\n\n• **Price Analysis** - Real-time market data\n\n• **Wallet Analysis** - Review wallet balances, recent transactions, and portfolio performance\n\nTry asking: 'What's the price of ETH?', 'Search for PEPE pairs', or 'Show trending pools'",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
      setConnectionError(error.message)
    },
    onFinish: () => {
      setConnectionError(null) // Clear error on successful completion
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle token click from pools/pairs
  const handleTokenClick = React.useCallback(
    (tokenSymbol: string, network: string) => {
      const query = `Get detailed information about ${tokenSymbol} token`
      append({
        role: "user",
        content: query,
      })
    },
    [append],
  )

  // Handle pair click from trending pools
  const handlePairClick = React.useCallback(
    (pairAddress: string, network: string) => {
      const query = `Get detailed DEX pair information for address ${pairAddress} on ${network} network`
      append({
        role: "user",
        content: query,
      })
    },
    [append],
  )

  // Handle retry
  const handleRetry = () => {
    setConnectionError(null)
    reload()
  }

  if (!agent) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-xl p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)]">
          <h1 className="text-2xl font-bold text-white mb-4">Agent not found</h1>
          <NeonButton onClick={() => router.push("/")} variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </NeonButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex  h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-white/8 via-white/5 to-white/3 backdrop-blur-xl px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => router.push("/")} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </NeonButton>
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-white">{agent.name}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={agent.status === "active" ? "default" : agent.status === "idle" ? "secondary" : "outline"}
                  className={`text-xs backdrop-blur-md border ${
                    agent.status === "active"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : agent.status === "idle"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {agent.status}
                </Badge>
                <span className="text-xs text-gray-300">{agent.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NeonButton variant="ghost" size="sm" onClick={() => router.push("/")} className="hidden md:flex">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Agents</span>
            </NeonButton>
            <NeonButton variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Connection Error */}
          {connectionError && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Connection Error</span>
              </div>
              <p className="text-sm mb-3 text-red-200">{connectionError}</p>
              <NeonButton variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </NeonButton>
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">API Error</span>
              </div>
              <p className="text-sm mb-3 text-red-200">{error.message}</p>
              <NeonButton variant="outline" size="sm" onClick={handleRetry}>
                Retry Request
              </NeonButton>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onTokenClick={handleTokenClick}
              onPairClick={handlePairClick}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-gradient-to-r from-white/8 via-white/5 to-white/3 backdrop-blur-xl p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_-4px_16px_rgba(0,0,0,0.3)]">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <NeonButton variant="outline" size="sm" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </NeonButton>
            <div className="flex-1 flex items-center gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about crypto, tokens, or DeFi..."
                className="flex-1 h-12 px-4 bg-gradient-to-r text-black from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl  placeholder:text-gray-400 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-400/20 focus:from-white/15 focus:to-white/8 hover:from-white/12 hover:to-white/6 hover:border-white/30 transition-all duration-300 shadow-lg text-sm font-medium"
                disabled={isLoading}
              />
              <NeonButton  disabled={!input.trim() || isLoading} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </NeonButton>
            </div>
          </form>

          {/* Agent info */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-300 font-medium">APIs:</span>
            {agent.tools.slice(0, 4).map((tool) => (
              <Badge
                key={tool}
                variant="outline"
                className="text-xs bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-purple-300 border-purple-400/30 backdrop-blur-sm"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
