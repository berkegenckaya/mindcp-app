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
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
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
      <Card className="relative group rounded-2xl border border-white/35 bg-white/18 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)] transition-all duration-300 hover:bg-white/26">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pools Icon */}
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Trending Pools
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">
                Top {pools.length} trending trading pools • Click pairs for detailed analysis
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
          {pools.slice(0, 5).map((pool, index) => (
            <div
              key={pool.id}
              className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-3 sm:p-4 hover:bg-white/30 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handlePairClick(pool)}
            >
              {/* Pool Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-purple-600">#{index + 1}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-50/20 text-purple-700 border-purple-300/50 px-1 sm:px-2 py-0.5"
                    >
                      {pool.network}
                    </Badge>
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Clickable Token Pair with Visual Indicator */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={(e) => handleTokenClick(pool.base_token.symbol, pool.network, e)}
                        className="font-semibold text-gray-900 text-xs sm:text-sm hover:text-purple-600 hover:underline transition-colors cursor-pointer"
                        title={`Get details for ${pool.base_token.symbol}`}
                      >
                        {pool.base_token.symbol}
                      </button>
                      <span className="text-gray-500 text-xs sm:text-sm">/</span>
                      <button
                        onClick={(e) => handleTokenClick(pool.quote_token.symbol, pool.network, e)}
                        className="font-semibold text-gray-900 text-xs sm:text-sm hover:text-purple-600 hover:underline transition-colors cursor-pointer"
                        title={`Get details for ${pool.quote_token.symbol}`}
                      >
                        {pool.quote_token.symbol}
                      </button>
                      <div className="hidden sm:flex items-center gap-1 ml-2">
                        <MousePointer className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-blue-600 font-medium">Click for detailed analysis</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">{pool.price}</div>
                  <div className={`flex items-center gap-1 justify-end text-xs ${getTrendColor(pool.price_trend)}`}>
                    {getTrendIcon(pool.price_trend)}
                    <span>{pool.price_change_24h}</span>
                  </div>
                </div>
              </div>

              {/* Token Details Row */}
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-xs text-gray-600 overflow-hidden">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-medium">Base:</span>
                  <button
                    onClick={(e) => handleTokenClick(pool.base_token.symbol, pool.network, e)}
                    className="hover:text-purple-600 hover:underline transition-colors truncate"
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
                    className="hover:text-purple-600 hover:underline transition-colors truncate"
                    title={pool.quote_token.name}
                  >
                    {pool.quote_token.name}
                  </button>
                </div>
              </div>

              {/* Pool Stats - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs mb-2 sm:mb-3">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-gray-600 font-medium mb-1">Volume</div>
                  <div className="font-semibold text-gray-900 text-xs">{pool.volume_24h}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-gray-600 font-medium mb-1">Liquidity</div>
                  <div className="font-semibold text-gray-900 text-xs">{pool.liquidity}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 col-span-2 sm:col-span-1">
                  <div className="text-gray-600 font-medium mb-1">Market Cap</div>
                  <div className="font-semibold text-gray-900 text-xs">{pool.market_cap}</div>
                </div>
              </div>

              {/* Pool Address - Compact */}
              <div className="flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-600 font-medium">Pool Address</div>
                  <div className="text-xs font-mono text-gray-900 truncate">{formatAddress(pool.address)}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(pool.address, pool.id)
                    }}
                    className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20"
                  >
                    {copied === pool.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      const explorerUrl = getPoolExplorerUrl(pool.network, pool.address)
                      if (explorerUrl) window.open(explorerUrl, "_blank")
                    }}
                    className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5  opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}

          {/* Show More Indicator */}
          {pools.length > 5 && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500">Showing top 5 of {pools.length} pools</span>
            </div>
          )}
        </CardContent>
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
