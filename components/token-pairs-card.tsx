"use client"

import { ExternalLink, TrendingUp, TrendingDown, Minus, Copy, Eye } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TokenPairData {
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
    url: string
  }>
  socials?: Array<{
    platform: string
    handle: string
  }>
  boosts?: number
}

interface TokenPairsCardProps {
  pairs: TokenPairData[]
  title?: string
  onTokenClick?: (tokenSymbol: string, network: string) => void
  onPairClick?: (pairAddress: string, network: string) => void
}

export function TokenPairsCard({ pairs, title = "Token Pairs", onTokenClick, onPairClick }: TokenPairsCardProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(`${type}-${text}`)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatChainName = (chainId: string) => {
    const chainNames: Record<string, string> = {
      ethereum: "Ethereum",
      bsc: "BSC",
      polygon: "Polygon",
      solana: "Solana",
      avalanche: "Avalanche",
      arbitrum: "Arbitrum",
      optimism: "Optimism",
      base: "Base",
      fantom: "Fantom",
      cronos: "Cronos",
    }
    return chainNames[chainId] || chainId.toUpperCase()
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl p-4 sm:p-6 bg-white/18 backdrop-blur-md border border-white/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold t">{title}</h3>
        <div className="text-sm ">
          {pairs.length} pair{pairs.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={pair.id || index}
            className="rounded-xl p-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {pair.image_url && (
                    <img
                      src={pair.image_url || "/placeholder.svg"}
                      alt={pair.baseToken.symbol}
                      className="w-8 h-8 rounded-full bg-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-semibold  text-lg">{pair.name}</h4>
                    <div className="flex items-center gap-2 text-sm ">
                      <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium">
                        {formatChainName(pair.chainId)}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium">
                        {pair.dexId.toUpperCase()}
                      </span>
                      {pair.labels && pair.labels.length > 0 && (
                        <span className="px-2 py-1 rounded-md bg-purple-500/20 text-xs font-medium text-black">
                          {pair.labels[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(pair.pairAddress, "pair")}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Copy pair address"
                >
                  <Copy className="h-4 w-4 /70" />
                </button>
                <a
                  href={pair.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="View on DexScreener"
                >
                  <ExternalLink className="h-4 w-4 " />
                </a>
              </div>
            </div>

            {/* Price and Change */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm ">Price</div>
                <div className="text-xl font-bold ">{pair.price}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm ">24h Change</div>
                <div className={cn("text-xl font-bold flex items-center gap-1", getTrendColor(pair.price_trend))}>
                  {getTrendIcon(pair.price_trend)}
                  {pair.price_change_24h}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-xs /60">Volume 24h</div>
                <div className="text-sm font-semibold ">{pair.volume_24h}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs /60">Liquidity</div>
                <div className="text-sm font-semibold ">{pair.liquidity}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs ">Market Cap</div>
                <div className="text-sm font-semibold ">{pair.market_cap}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs ">FDV</div>
                <div className="text-sm font-semibold ">{pair.fdv}</div>
              </div>
            </div>

            {/* Transactions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-xs ">Txns 24h</div>
                <div className="text-sm font-semibold ">
                  <span className="text-green-400">{pair.transactions.h24.buys}</span>
                  <span className=" mx-1">/</span>
                  <span className="text-red-400">{pair.transactions.h24.sells}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs ">Txns 6h</div>
                <div className="text-sm font-semibold ">
                  <span className="text-green-400">{pair.transactions.h6.buys}</span>
                  <span className=" mx-1">/</span>
                  <span className="text-red-400">{pair.transactions.h6.sells}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs ">Txns 1h</div>
                <div className="text-sm font-semibold ">
                  <span className="text-green-400">{pair.transactions.h1.buys}</span>
                  <span className=" mx-1">/</span>
                  <span className="text-red-400">{pair.transactions.h1.sells}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs ">Txns 5m</div>
                <div className="text-sm font-semibold ">
                  <span className="text-green-400">{pair.transactions.m5.buys}</span>
                  <span className=" mx-1">/</span>
                  <span className="text-red-400">{pair.transactions.m5.sells}</span>
                </div>
              </div>
            </div>

            {/* Token Addresses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium ">{pair.baseToken.symbol}</span>
                  <span className="text-xs  font-mono">
                    {pair.baseToken.address.slice(0, 6)}...{pair.baseToken.address.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(pair.baseToken.address, "base")}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Copy base token address"
                >
                  <Copy className="h-3 w-3 " />
                </button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium ">{pair.quoteToken.symbol}</span>
                  <span className="text-xs  font-mono">
                    {pair.quoteToken.address.slice(0, 6)}...{pair.quoteToken.address.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(pair.quoteToken.address, "quote")}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Copy quote token address"
                >
                  <Copy className="h-3 w-3 " />
                </button>
              </div>
            </div>

            {/* Additional Info */}
            {(pair.pairCreatedAt || pair.websites || pair.socials) && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-4 text-xs ">
                  {pair.pairCreatedAt && <span>Created: {pair.pairCreatedAt}</span>}
                  {pair.websites && pair.websites.length > 0 && (
                    <a
                      href={pair.websites[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:/80 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </a>
                  )}
                  {pair.boosts && pair.boosts > 0 && (
                    <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-black">
                      🚀 {pair.boosts} boost{pair.boosts !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                
                
              </div>

            )}

            {/* socials */}
            {pair.socials && pair.socials.length > 0 && (
              <div className="mt-2 flex items-center gap-3">
                {pair.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={`https://${social.platform}.com/${social.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}: @{social.handle}
                  </a>
                ))}
              </div>
            )}

            {/* Copy Success Message */}
            {copiedAddress && copiedAddress.includes(pair.pairAddress) && (
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                <span>✓</span>
                Address copied to clipboard!
              </div>
            )}
          </div>
        ))}
      </div>

      {pairs.length === 0 && (
        <div className="text-center py-8 ">
          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No token pairs found</p>
        </div>
      )}
    </div>
  )
}
