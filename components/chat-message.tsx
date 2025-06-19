"use client"

import { User, Bot } from 'lucide-react'
import type { Message } from "ai"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { TrendingPoolsCard } from "./trending-pools-card"
import { TokenInfoCompact } from "./token-info-compact"
import { DexPairsCard } from './dex-pair-card'


interface ChatMessageProps {
  message: Message
  onTokenClick?: (tokenSymbol: string, network: string) => void
  onPairClick?: (pairAddress: string, network: string) => void
}

interface TokenData {
  name: string
  symbol: string
  price: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  market_cap: string
  volume_24h: string
  circulating_supply: string
  total_supply: string
  max_supply: string
  contract_address: string
  blockchain: string
  image_url?: string
  description?: string
}

interface PoolData {
  id: string
  name: string
  base_token: {
    name: string
    symbol: string
    address: string
  }
  quote_token: {
    name: string
    symbol: string
    address: string
  }
  network: string
  price: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  volume_24h: string
  liquidity: string
  market_cap: string
  address: string
}

interface DexPairData {
  id: string
  name: string
  chainId: string
  dexId: string
  pairAddress: string
  labels?: string[]
  baseToken: {
    name: string
    symbol: string
    address: string
  }
  quoteToken: {
    name: string
    symbol: string
    address: string
  }
  price: string
  priceNative: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  volume_24h: string
  volume_6h: string
  volume_1h: string
  volume_5m: string
  liquidity: string
  liquidityBase: string
  liquidityQuote: string
  market_cap: string
  fdv: string
  transactions: {
    h24: { buys: number; sells: number; total: number }
    h6: { buys: number; sells: number; total: number }
    h1: { buys: number; sells: number; total: number }
    m5: { buys: number; sells: number; total: number }
  }
  priceChanges: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  pairCreatedAt?: string
  url: string
  image_url?: string
  header_url?: string
  websites?: Array<{
    label: string
    url: string
  }>
  socials?: Array<{
    type: string
    url: string
  }>
  boosts?: number
}

export function ChatMessage({ message, onTokenClick, onPairClick }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isProcessingTool =
    message.role === "assistant" &&
    message.toolInvocations?.some((tool) => tool.state === "call") &&
    message.content === ""

  const toolComponents = message.toolInvocations?.map((toolInvocation, toolIndex) => {
    if (toolInvocation.state !== "result") return null

    switch (toolInvocation.toolName) {
      case "get_coingecko_token_info":
      case "get_token_info":
        try {
          const result = toolInvocation.result
          let tokenData: TokenData | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            tokenData = parsed.token_data || parsed.component_data
          } else if (result && typeof result === "object") {
            tokenData = result.token_data || result.component_data || result
          }

          if (tokenData && tokenData.name && tokenData.symbol) {
            return <TokenInfoCompact key={toolIndex} tokenInfo={tokenData} />
          }
        } catch (error) {
          console.error("Error parsing token data:", error)
        }
        return null

      case "get_trending_pools":
      case "get_network_trending_pools":
        try {
          const result = toolInvocation.result
          let poolsData: PoolData[] | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            poolsData = parsed.pools_data
          } else if (result && typeof result === "object") {
            poolsData = result.pools_data || (Array.isArray(result) ? result : null)
          }

          if (poolsData && Array.isArray(poolsData) && poolsData.length > 0) {
            return (
              <TrendingPoolsCard
                key={toolIndex}
                pools={poolsData}
                onTokenClick={onTokenClick}
                onPairClick={onPairClick}
              />
            )
          }
        } catch (error) {
          console.error("Error parsing pools data:", error)
        }
        return null

      case "search_dex_pairs":
      case "get_dex_pair_info":
        try {
          const result = toolInvocation.result
          let pairsData: DexPairData[] | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            pairsData = parsed.pairs_data || (parsed.pair_data ? [parsed.pair_data] : null)
          } else if (result && typeof result === "object") {
            pairsData = result.pairs_data || (result.pair_data ? [result.pair_data] : null)
          }

          if (pairsData && Array.isArray(pairsData) && pairsData.length > 0) {
            return <DexPairsCard key={toolIndex} pairs={pairsData} onTokenClick={onTokenClick} />
          }
        } catch (error) {
          console.error("Error parsing DEX pairs data:", error)
        }
        return null

      default:
        return null
    }
  })

  return (
    <div className={cn("flex items-start gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="relative h-8 w-8 flex-shrink-0">
          <div className="absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-sm opacity-90" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
            <Bot className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center gap-3 w-full max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
        {/* Tool Components */}
        {toolComponents?.some((component) => component !== null) && (
          <div className="flex flex-col gap-3 w-full">{toolComponents}</div>
        )}

        {/* Message Content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-4 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)] w-full",
              isUser
                ? "bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white border border-white/30"
                : "bg-white/18 border border-white/35",
            )}
          >
            {isProcessingTool ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                <span className="text-sm">Processing request</span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>
                  },
                  li({ children }) {
                    // Hide list items if we have tool components to avoid duplication
                    return toolComponents?.some((component) => component !== null) ? null : (
                      <li className="leading-relaxed text-sm">{children}</li>
                    )
                  },
                  h1({ children }) {
                    return <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-bold mb-2 mt-4 first:mt-0">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-2 border-purple-400 pl-4 italic my-2">{children}</blockquote>
                  },
                  a({ children, href }) {
                    return (
                      <a
                        href={href}
                        className="text-purple-400 hover:text-purple-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    )
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-white/20">{children}</table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return <th className="px-4 py-2 text-sm font-medium bg-white/10">{children}</th>
                  },
                  td({ children }) {
                    return <td className="px-4 py-2 text-sm border-t border-white/10">{children}</td>
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="relative h-8 w-8 flex-shrink-0">
          <div className="absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 blur-sm opacity-90" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-inner">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}
