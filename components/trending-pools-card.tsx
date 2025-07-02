"use client"

import type React from "react"
import { TrendingUp, TrendingDown, Minus, ExternalLink, Copy, Check, Droplets, MousePointer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PoolInfo {
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

interface TrendingPoolsCardProps {
  pools: PoolInfo[]
  onTokenClick?: (tokenSymbol: string, network: string) => void
  onPairClick?: (pairAddress: string, network: string) => void
}

export function TrendingPoolsCard({ pools, onTokenClick, onPairClick }: TrendingPoolsCardProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatAddress = (address: string) => {
    if (address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleTokenClick = (tokenSymbol: string, network: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent pair click
    if (onTokenClick) {
      onTokenClick(tokenSymbol, network)
    }
  }

  const handlePairClick = (pool: PoolInfo) => {
    if (onPairClick) {
      // Map network names to DexScreener format
      const networkMap: Record<string, string> = {
        eth: "ethereum",
        ethereum: "ethereum",
        bsc: "bsc",
        polygon_pos: "polygon",
        polygon: "polygon",
        solana: "solana",
        avalanche: "avalanche",
        arbitrum: "arbitrum",
        optimism: "optimism",
        base: "base",
        fantom: "fantom",
        cronos: "cronos",
      }

      const mappedNetwork = networkMap[pool.network.toLowerCase()] || pool.network.toLowerCase()
      onPairClick(pool.address, mappedNetwork)
    }
  }

  return (
    <div className="w-full">
      <Card className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ">
        {/* Enhanced glassmorphic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <CardHeader className="pb-3 sm:pb-4 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pools Icon */}
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Trending Pools
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-300">
                Top {pools.length} trending trading pools • Click pairs for detailed analysis
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0 relative z-10">
          {pools.slice(0, 5).map((pool, index) => (
            <div
              key={pool.id}
              className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-3 sm:p-4 hover:from-white/15 hover:to-white/8 hover:border-white/30 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg group/item"
              onClick={() => handlePairClick(pool)}
            >
              {/* Pool Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-purple-300">#{index + 1}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/30 px-1 sm:px-2 py-0.5"
                    >
                      {pool.network}
                    </Badge>
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Clickable Token Pair with Visual Indicator */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={(e) => handleTokenClick(pool.base_token.symbol, pool.network, e)}
                        className="font-semibold text-white text-xs sm:text-sm hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                        title={`Get details for ${pool.base_token.symbol}`}
                      >
                        {pool.base_token.symbol}
                      </button>
                      <span className="text-gray-400 text-xs sm:text-sm">/</span>
                      <button
                        onClick={(e) => handleTokenClick(pool.quote_token.symbol, pool.network, e)}
                        className="font-semibold text-white text-xs sm:text-sm hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                        title={`Get details for ${pool.quote_token.symbol}`}
                      >
                        {pool.quote_token.symbol}
                      </button>
                      <div className="hidden sm:flex items-center gap-1 ml-2">
                        <MousePointer className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-blue-300 font-medium">Click for detailed analysis</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-white text-xs sm:text-sm">{pool.price}</div>
                  <div className={`flex items-center gap-1 justify-end text-xs ${getTrendColor(pool.price_trend)}`}>
                    {getTrendIcon(pool.price_trend)}
                    <span>{pool.price_change_24h}</span>
                  </div>
                </div>
              </div>

              {/* Token Details Row */}
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-xs text-gray-300 overflow-hidden">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-medium">Base:</span>
                  <button
                    onClick={(e) => handleTokenClick(pool.base_token.symbol, pool.network, e)}
                    className="hover:text-purple-300 hover:underline transition-colors truncate"
                    title={pool.base_token.name}
                  >
                    {pool.base_token.name}
                  </button>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-medium">Quote:</span>
                  <button
                    onClick={(e) => handleTokenClick(pool.quote_token.symbol, pool.network, e)}
                    className="hover:text-purple-300 hover:underline transition-colors truncate"
                    title={pool.quote_token.name}
                  >
                    {pool.quote_token.name}
                  </button>
                </div>
              </div>

              {/* Pool Stats - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs mb-2 sm:mb-3">
                <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                  <div className="text-gray-300 font-medium mb-1">Volume</div>
                  <div className="font-semibold text-white text-xs">{pool.volume_24h}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                  <div className="text-gray-300 font-medium mb-1">Liquidity</div>
                  <div className="font-semibold text-white text-xs">{pool.liquidity}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 col-span-2 sm:col-span-1 border border-white/20">
                  <div className="text-gray-300 font-medium mb-1">Market Cap</div>
                  <div className="font-semibold text-white text-xs">{pool.market_cap}</div>
                </div>
              </div>

              {/* Pool Address - Compact */}
              <div className="flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-300 font-medium">Pool Address</div>
                  <div className="text-xs font-mono text-white truncate">{formatAddress(pool.address)}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(pool.address, pool.id)
                    }}
                    className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    {copied === pool.id ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-white" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      const explorerUrl = getPoolExplorerUrl(pool.network, pool.address)
                      if (explorerUrl) window.open(explorerUrl, "_blank")
                    }}
                    className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    <ExternalLink className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}

          {/* Show More Indicator */}
          {pools.length > 5 && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-400">Showing top 5 of {pools.length} pools</span>
            </div>
          )}
        </CardContent>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />

        {/* Enhanced hover glow effect */}
        <div
          aria-hidden
          className="
          absolute inset-0 rounded-2xl
          bg-gradient-to-br from-white/0 via-white/0 to-white/0
          group-hover:from-white/5 group-hover:via-white/3 group-hover:to-white/8
          transition-all duration-500
          "
        />

        {/* Border glow on hover */}
        <div
          aria-hidden
          className="
          absolute inset-0 rounded-2xl
          ring-1 ring-transparent
          group-hover:ring-white/20
          transition-all duration-500
          "
        />
      </Card>
    </div>
  )
}

function getPoolExplorerUrl(network: string, address: string): string | null {
  const explorers: Record<string, string> = {
    ETH: `https://etherscan.io/address/${address}`,
    ETHEREUM: `https://etherscan.io/address/${address}`,
    BSC: `https://bscscan.com/address/${address}`,
    POLYGON_POS: `https://polygonscan.com/address/${address}`,
    POLYGON: `https://polygonscan.com/address/${address}`,
    AVALANCHE: `https://snowtrace.io/address/${address}`,
    SOLANA: `https://solscan.io/account/${address}`,
    ARBITRUM: `https://arbiscan.io/address/${address}`,
    OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
    BASE: `https://basescan.org/address/${address}`,
    FANTOM: `https://ftmscan.com/address/${address}`,
    CRONOS: `https://cronoscan.com/address/${address}`,
  }

  return explorers[network.toUpperCase()] || null
}
