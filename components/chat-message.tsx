"use client"

import { User, Bot, AlertCircle } from "lucide-react"
import type { Message } from "ai"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { TrendingPoolsCard } from "./trending-pools-card"
import { TokenInfoCompact } from "./token-info-compact"
import { WalletAnalysisCard } from "./wallet-analysis-card"
import { DexPairsCard } from "./dex-pair-card"
import { DexScreenerPairCard } from "./dex-screener-pair-card"

interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  labels?: string[]
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd?: string
  txns: {
    m5: {
      buys: number
      sells: number
    }
    h1: {
      buys: number
      sells: number
    }
    h6: {
      buys: number
      sells: number
    }
    h24: {
      buys: number
      sells: number
    }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd?: number
    base: number
    quote: number
  }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    header?: string
    openGraph?: string
    websites?: Array<{
      url: string
    }>
    socials?: Array<{
      platform: string
      handle: string
    }>
  }
  boosts?: {
    active: number
  }
}

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

interface WalletData {
  address: string
  summary: {
    total_transactions: number
    total_volume: string
    gas_spent: string
    chains_active: number
    most_active_chain: string
  }
  activity: {
    last_24h: number
    last_7d: number
    last_30d: number
  }
  transaction_types: Record<string, number>
  top_tokens: Array<{
    symbol: string
    name: string
    count: number
    total_value_formatted: string
  }>
  recent_activity: Array<{
    hash: string
    timestamp_formatted: string
    type: string
    value_formatted: string
    chain: string
    description: string
  }>
  chains: string[]
  credits_used: number
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
      case "get_token_pools":
      case "get_token_info":
        console.log("GET TOKEN INFO ❌")
        try {
          const result = toolInvocation.result
          let tokenData: TokenData | null = null
          let errorInfo: {
            error: string
            suggestion?: string
            details?: string
          } | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            if (parsed.error) {
              errorInfo = parsed
            } else {
              tokenData = parsed.token_data || parsed.component_data
            }
          } else if (result && typeof result === "object") {
            if (result.error) {
              errorInfo = result
            } else {
              tokenData = result.token_data || result.component_data || result
            }
          }

          // Show error state
          if (errorInfo) {
            return (
              <div
                key={toolIndex}
                className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Token Information Error</span>
                </div>
                <p className="text-xs sm:text-sm mb-2 text-red-200">{errorInfo.error}</p>
                {errorInfo.suggestion && (
                  <p className="text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded-lg">
                    💡 <strong>Suggestion:</strong> {errorInfo.suggestion}
                  </p>
                )}
                {errorInfo.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:text-red-200">Technical Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">{errorInfo.details}</pre>
                  </details>
                )}
              </div>
            )
          }

          if (tokenData && tokenData.name && tokenData.symbol) {
            return <TokenInfoCompact key={toolIndex} tokenInfo={tokenData} />
          }

          // Fallback: No data available
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-md border border-orange-500/30 text-orange-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">No Token Data Available</span>
              </div>
              <p className="text-xs sm:text-sm mb-3 text-orange-200">
                Unable to retrieve token information. This could be due to:
              </p>
              <ul className="text-xs sm:text-sm space-y-1 ml-4 list-disc text-orange-200">
                <li>Token not found in database</li>
                <li>Invalid token symbol or name</li>
                <li>API rate limiting or connectivity issues</li>
                <li>Token not supported by the data provider</li>
              </ul>
              <div className="mt-3 p-2 bg-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-200">
                  💡 <strong>Try:</strong> Check the token symbol spelling or try a different token
                </p>
              </div>
            </div>
          )
        } catch (error) {
          console.error("Error parsing token data:", error)
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">Token Data Parse Error</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-red-200">Failed to parse token information response</p>
              <details>
                <summary className="text-xs cursor-pointer hover:text-red-200">Raw Response</summary>
                <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        }

      case "get_dexscreener_pairs":
      case "get_token_info_address":
        try {
          const result = toolInvocation.result
          console.log("🔍 DexScreener Tool Result:", result)

          let pairsData: DexScreenerPair[] | null = null
          let errorInfo: {
            error: string
            suggestion?: string
            details?: string
          } | null = null

          console.log("🔍 Processing DexScreener data...")

          // Handle different result formats - ÇOK DAHA ESNEKLEŞTİRİLDİ
          if (typeof result === "string") {
            try {
              const parsed = JSON.parse(result)
              console.log("📝 Parsed string result:", parsed)
              if (parsed.error) {
                errorInfo = parsed
              } else {
                // Tüm olası data formatlarını kontrol et
                pairsData =
                  parsed.all_pairs ||
                  parsed.pairs ||
                  parsed.component_data ||
                  parsed.data ||
                  (Array.isArray(parsed) ? parsed : null)
                console.log("📊 Extracted pairsData from string:", pairsData)
              }
            } catch (parseError) {
              console.error("❌ JSON parse error:", parseError)
              errorInfo = { error: "Failed to parse response" }
            }
          } else if (result && typeof result === "object") {
            console.log("📦 Object result:", result)
            if (result.error) {
              errorInfo = result
            } else {
              // Tüm olası data formatlarını kontrol et
              pairsData =
                result.pairs_data ||
                result.pairs ||
                result.component_data ||
                result.data ||
                (Array.isArray(result) ? result : null)
              console.log("📊 Extracted pairsData from object:", pairsData)
            }
          } else if (Array.isArray(result)) {
            console.log("📋 Direct array result:", result)
            pairsData = result
          }

          console.log("✅ Final pairsData:", pairsData)
          console.log("📏 pairsData length:", pairsData?.length)
          console.log("🔍 pairsData is Array:", Array.isArray(pairsData))

          // Show error state
          if (errorInfo) {
            return (
              <div
                key={toolIndex}
                className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">DexScreener Pairs Error</span>
                </div>
                <p className="text-xs sm:text-sm mb-2 text-red-200">{errorInfo.error}</p>
                {errorInfo.suggestion && (
                  <p className="text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded-lg">
                    💡 <strong>Suggestion:</strong> {errorInfo.suggestion}
                  </p>
                )}
                {errorInfo.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:text-red-200">Technical Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">{errorInfo.details}</pre>
                  </details>
                )}
              </div>
            )
          }

          // DÜZELTME: Daha güçlü validation
          if (pairsData && Array.isArray(pairsData) && pairsData.length > 0) {
            console.log("🎉 Rendering DexScreenerPairCard with data:", pairsData)
            return <DexScreenerPairCard key={toolIndex} pairs={pairsData} onTokenClick={onTokenClick} />
          }

          // Debug için raw data göster
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-md border border-yellow-500/30 text-yellow-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">🐛 Debug: DexScreener Data Issue</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-yellow-200">Data received but validation failed:</p>
              <div className="text-xs space-y-1 mb-3">
                <div>• pairsData exists: {pairsData ? "✅" : "❌"}</div>
                <div>• Is Array: {Array.isArray(pairsData) ? "✅" : "❌"}</div>
                <div>• Length: {pairsData?.length || 0}</div>
                <div>• Type: {typeof pairsData}</div>
              </div>
              <details>
                <summary className="text-xs cursor-pointer hover:text-yellow-200">Show Raw Data</summary>
                <pre className="text-xs mt-1 p-2 bg-yellow-500/20 rounded overflow-x-auto max-h-40">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        } catch (error) {
          console.error("❌ Error parsing DexScreener pairs data:", error)
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">DexScreener Pairs Parse Error</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-red-200">Failed to parse DexScreener pairs response</p>
              <details>
                <summary className="text-xs cursor-pointer hover:text-red-200">Raw Response</summary>
                <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        }

      case "get_trending_pools":
      case "get_network_trending_pools":
        try {
          const result = toolInvocation.result
          let poolsData: PoolData[] | null = null
          let errorInfo: {
            error: string
            suggestion?: string
            details?: string
          } | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            if (parsed.error) {
              errorInfo = parsed
            } else {
              poolsData = parsed.pools_data
            }
          } else if (result && typeof result === "object") {
            if (result.error) {
              errorInfo = result
            } else {
              poolsData = result.pools_data || (Array.isArray(result) ? result : null)
            }
          }

          // Show error state
          if (errorInfo) {
            return (
              <div
                key={toolIndex}
                className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Trending Pools Error</span>
                </div>
                <p className="text-xs sm:text-sm mb-2 text-red-200">{errorInfo.error}</p>
                {errorInfo.suggestion && (
                  <p className="text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded-lg">
                    💡 <strong>Suggestion:</strong> {errorInfo.suggestion}
                  </p>
                )}
                {errorInfo.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:text-red-200">Technical Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">{errorInfo.details}</pre>
                  </details>
                )}
              </div>
            )
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

          // Fallback: No data available
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-md border border-orange-500/30 text-orange-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">No Trending Pools Available</span>
              </div>
              <p className="text-xs sm:text-sm mb-3 text-orange-200">
                Unable to retrieve trending pools data. This could be due to:
              </p>
              <ul className="text-xs sm:text-sm space-y-1 ml-4 list-disc text-orange-200">
                <li>No active pools on the specified network</li>
                <li>API rate limiting or connectivity issues</li>
                <li>Network temporarily unavailable</li>
                <li>Invalid network parameter</li>
              </ul>
              <div className="mt-3 p-2 bg-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-200">
                  💡 <strong>Try:</strong> Check the network name or try again in a few minutes
                </p>
              </div>
            </div>
          )
        } catch (error) {
          console.error("Error parsing pools data:", error)
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">Pools Data Parse Error</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-red-200">Failed to parse trending pools response</p>
              <details>
                <summary className="text-xs cursor-pointer hover:text-red-200">Raw Response</summary>
                <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        }

      case "search_dex_pairs":
      case "get_dex_pair_info":
        try {
          const result = toolInvocation.result
          let pairsData: DexPairData[] | null = null
          let errorInfo: {
            error: string
            suggestion?: string
            details?: string
          } | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            if (parsed.error) {
              errorInfo = parsed
            } else {
              pairsData = parsed.pairs_data || (parsed.pair_data ? [parsed.pair_data] : null)
            }
          } else if (result && typeof result === "object") {
            if (result.error) {
              errorInfo = result
            } else {
              pairsData = result.pairs_data || (result.pair_data ? [result.pair_data] : null)
            }
          }

          // Show error state
          if (errorInfo) {
            return (
              <div
                key={toolIndex}
                className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">DEX Pairs Error</span>
                </div>
                <p className="text-xs sm:text-sm mb-2 text-red-200">{errorInfo.error}</p>
                {errorInfo.suggestion && (
                  <p className="text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded-lg">
                    💡 <strong>Suggestion:</strong> {errorInfo.suggestion}
                  </p>
                )}
                {errorInfo.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:text-red-200">Technical Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">{errorInfo.details}</pre>
                  </details>
                )}
              </div>
            )
          }

          if (pairsData && Array.isArray(pairsData) && pairsData.length > 0) {
            return <DexPairsCard key={toolIndex} pairs={pairsData} onTokenClick={onTokenClick} />
          }

          // Fallback: No data available
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-md border border-orange-500/30 text-orange-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">No DEX Pairs Found</span>
              </div>
              <p className="text-xs sm:text-sm mb-3 text-orange-200">Unable to find DEX pairs. This could be due to:</p>
              <ul className="text-xs sm:text-sm space-y-1 ml-4 list-disc text-orange-200">
                <li>No pairs found for the search query</li>
                <li>Invalid token symbol or pair address</li>
                <li>Unsupported blockchain network</li>
                <li>API rate limiting or connectivity issues</li>
              </ul>
              <div className="mt-3 p-2 bg-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-200">
                  💡 <strong>Try:</strong> Use different search terms or check the token symbol spelling
                </p>
              </div>
            </div>
          )
        } catch (error) {
          console.error("Error parsing DEX pairs data:", error)
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">DEX Pairs Parse Error</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-red-200">Failed to parse DEX pairs response</p>
              <details>
                <summary className="text-xs cursor-pointer hover:text-red-200">Raw Response</summary>
                <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        }

      case "get_wallet_analysis":
        try {
          const result = toolInvocation.result
          let walletData: WalletData | null = null
          let errorInfo: {
            error: string
            suggestion?: string
            details?: string
          } | null = null

          // Handle different result formats
          if (typeof result === "string") {
            const parsed = JSON.parse(result)
            if (parsed.error) {
              errorInfo = parsed
            } else {
              walletData = parsed.wallet_data
            }
          } else if (result && typeof result === "object") {
            if (result.error) {
              errorInfo = result
            } else {
              walletData = result.wallet_data || result
            }
          }

          // Show error state
          if (errorInfo) {
            return (
              <div
                key={toolIndex}
                className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Wallet Analysis Error</span>
                </div>
                <p className="text-xs sm:text-sm mb-2 text-red-200">{errorInfo.error}</p>
                {errorInfo.suggestion && (
                  <p className="text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded-lg">
                    💡 <strong>Suggestion:</strong> {errorInfo.suggestion}
                  </p>
                )}
                {errorInfo.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:text-red-200">Technical Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">{errorInfo.details}</pre>
                  </details>
                )}
              </div>
            )
          }

          // Show wallet data if available
          if (walletData && walletData.address && walletData.summary) {
            return <WalletAnalysisCard key={toolIndex} walletData={walletData} />
          }

          // Fallback: No data available
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-md border border-orange-500/30 text-orange-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">No Wallet Data Available</span>
              </div>
              <p className="text-xs sm:text-sm mb-3 text-orange-200">
                Unable to retrieve wallet analysis data. This could be due to:
              </p>
              <ul className="text-xs sm:text-sm space-y-1 ml-4 list-disc text-orange-200">
                <li>Invalid wallet address format</li>
                <li>Wallet has no recent transactions</li>
                <li>API rate limiting or connectivity issues</li>
                <li>Wallet is on an unsupported network</li>
              </ul>
              <div className="mt-3 p-2 bg-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-200">
                  💡 <strong>Try:</strong> Double-check the wallet address or try again in a few minutes
                </p>
              </div>
            </div>
          )
        } catch (error) {
          console.error("Error parsing wallet data:", error)
          return (
            <div
              key={toolIndex}
              className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border border-red-500/30 text-red-300 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">Parse Error</span>
              </div>
              <p className="text-xs sm:text-sm mb-2 text-red-200">Failed to parse wallet analysis response</p>
              <details>
                <summary className="text-xs cursor-pointer hover:text-red-200">Raw Response</summary>
                <pre className="text-xs mt-1 p-2 bg-red-500/20 rounded overflow-x-auto">
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </pre>
              </details>
            </div>
          )
        }

      default:
        return null
    }
  })

  return (
    <div className={cn("flex items-start gap-2 sm:gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="relative h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1">
          <div className="absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-sm opacity-90" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20">
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center gap-2 sm:gap-3">
        {/* Tool Components */}
        {toolComponents?.some((component) => component !== null) && (
          <div className="flex flex-col gap-2 sm:gap-3 w-full min-w-0">{toolComponents}</div>
        )}

        {/* Message Content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-3 py-3 sm:px-4 sm:py-4 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)] w-full min-w-0",
              isUser
                ? "bg-gradient-to-br from-purple-500/90 to-cyan-500/90 text-white border border-white/20"
                : "bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/10 text-white",
            )}
          >
            {isProcessingTool ? (
              <div className="flex items-center gap-2 text-gray-300">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                <span className="text-xs sm:text-sm">Processing request</span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm">{children}</p>
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
                      <li className="leading-relaxed text-xs sm:text-sm">{children}</li>
                    )
                  },
                  h1({ children }) {
                    return <h1 className="text-base sm:text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-sm sm:text-base font-bold mb-2 mt-4 first:mt-0">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-xs sm:text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-2 border-purple-400 pl-4 italic my-2">{children}</blockquote>
                  },
                  a({ children, href }) {
                    return (
                      <a
                        href={href}
                        className="text-purple-300 hover:text-purple-200 hover:underline break-words"
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
                    return <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-white/10">{children}</th>
                  },
                  td({ children }) {
                    return <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-t border-white/10">{children}</td>
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
        <div className="relative h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1">
          <div className="absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-cyan-500/80 to-purple-500/80 blur-sm opacity-90" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/90 to-purple-500/90 shadow-inner border border-white/20">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}
