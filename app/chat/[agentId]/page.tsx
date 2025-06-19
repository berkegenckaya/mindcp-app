"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
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

const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Token Info Agent",
    description: "Get information about cryptocurrency tokens using multiple APIs",
    type: "analytics",
    status: "active",
    tools: ["CoinGecko API", "DexScreener API", "Gecko Terminal API", "OpenAI GPT-4o"],
    capabilities: ["token-info", "price-analysis", "market-data", "dex-pairs"],
  },
  {
    id: 2,
    name: "Creative Writer",
    description: "Content creation and copy-writing specialist",
    type: "creative",
    status: "idle",
    tools: ["OpenAI GPT-4", "Hemingway-Lint", "MindCP"],
    capabilities: ["tone-shift", "SEO-optimize", "multilingual-draft"],
  },
  {
    id: 3,
    name: "DevOps Coder",
    description: "Automates code review and opens GitHub pull-requests",
    type: "development",
    status: "training",
    tools: ["GitHub API", "ESLint", "MindCP"],
    capabilities: ["static-analysis", "review-comments", "open-pull-request"],
  },
]

// Neon Button Component
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
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200"
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }
  const variantClasses = {
    default:
      "border border-purple-500 bg-black text-white shadow-inner hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
    ghost: "border border-transparent bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/30",
    outline: "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-purple-400",
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = Number.parseInt(params.agentId as string)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [connectionError, setConnectionError] = React.useState<string | null>(null)

  const agent = mockAgents.find((a) => a.id === agentId)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Hello! I'm your enhanced Token Info Agent with access to multiple APIs. I can help you with:\n\n• **Token Information** - Get details about any cryptocurrency\n• **DEX Pairs** - Search and analyze trading pairs\n• **Trending Pools** - Discover popular liquidity pools\n• **Price Analysis** - Real-time market data\n\nTry asking: 'What's the price of ETH?', 'Search for PEPE pairs', or 'Show trending pools'",
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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center rounded-2xl border border-white/35 bg-white/18 backdrop-blur-md p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Agent not found
          </h1>
          <NeonButton onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </NeonButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-white/35 bg-white/18 backdrop-blur-md px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => router.push("/")} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </NeonButton>

            <div className="relative h-10 w-10">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>

            <div>
              <h1 className="font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {agent.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={agent.status === "active" ? "default" : agent.status === "idle" ? "secondary" : "outline"}
                  className="text-xs bg-white/20 backdrop-blur-sm border-white/30"
                >
                  {agent.status}
                </Badge>
                <span className="text-xs text-gray-600">{agent.type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NeonButton variant="ghost" size="sm" onClick={() => router.push("/")} className="hidden md:flex">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
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
            <div className="rounded-2xl p-4 bg-red-100/20 backdrop-blur-md border border-red-300/50 text-red-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Connection Error</span>
              </div>
              <p className="text-sm mb-3">{connectionError}</p>
              <NeonButton variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </NeonButton>
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="rounded-2xl p-4 bg-red-100/20 backdrop-blur-md border border-red-300/50 text-red-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">API Error</span>
              </div>
              <p className="text-sm mb-3">{error.message}</p>
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
      <div className="border-t border-white/35 bg-white/18 backdrop-blur-md p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <NeonButton variant="outline" size="sm" className="flex-shrink-0" >
              <Paperclip className="h-4 w-4" />
            </NeonButton>
            <div className="flex-1 flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Try: "What's ETH price?", "Search PEPE pairs", "Show trending pools"...`}
                className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
                disabled={isLoading}
              />
              <NeonButton  disabled={!input.trim() || isLoading} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </NeonButton>
            </div>
          </form>

          {/* Agent info */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-600 font-medium">APIs:</span>
            {agent.tools.slice(0, 4).map((tool) => (
              <Badge
                key={tool}
                variant="outline"
                className="text-xs bg-purple-50/20 text-purple-700 border-purple-300/50 backdrop-blur-sm"
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
