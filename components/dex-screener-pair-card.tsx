"use client"

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  Activity,
  Globe,
  Twitter,
  MessageCircle,
  Calendar,
  DollarSign,
  Users,
  ArrowUpDown,
  Info,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

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

interface DexScreenerPairCardProps {
  pairs: DexScreenerPair[]
  onTokenClick?: (tokenSymbol: string, network: string) => void
}

export function DexScreenerPairCard({ pairs, onTokenClick }: DexScreenerPairCardProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-gray-400"
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

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
    return `$${num.toFixed(decimals)}`
  }

  const formatVolume = (num: number, decimals = 2) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`
    return num.toFixed(decimals)
  }

  const getChainDisplayName = (chainId: string) => {
    const chainNames: Record<string, string> = {
      ethereum: "Ethereum",
      bsc: "BSC",
      polygon: "Polygon",
      avalanche: "Avalanche",
      arbitrum: "Arbitrum",
      optimism: "Optimism",
      base: "Base",
      solana: "Solana",
      fantom: "Fantom",
      cronos: "Cronos",
    }
    return chainNames[chainId] || chainId.toUpperCase()
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-3 w-3" />
      case "telegram":
        return <MessageCircle className="h-3 w-3" />
      default:
        return <Globe className="h-3 w-3" />
    }
  }

  const getBuyPressure = (buys: number, sells: number) => {
    const total = buys + sells
    if (total === 0) return 50
    return (buys / total) * 100
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown"
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="w-full max-w-full">
      {pairs.map((pair, index) => (
        <Card
          key={`${pair.chainId}-${pair.pairAddress}`}
          className="
            relative group rounded-2xl border border-white/10
            bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-xl
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)]
            transition-all duration-300 hover:bg-gradient-to-br hover:from-white/12 hover:via-white/8 hover:to-white/5 hover:border-white/20 mb-4 sm:mb-6
          "
        >
          {/* Enhanced glassmorphic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          {/* Header with Token Image */}
          <CardHeader className="pb-1 sm:pb-4 px-3 sm:px-6 relative z-10">
            <div className="flex items-start gap-1 sm:gap-4">
              {/* Token Image */}
              <div className="relative h-10 w-10 sm:h-16 sm:w-16 flex-shrink-0">
                {pair.info?.imageUrl ? (
                  <img
                    src={pair.info.imageUrl || "/placeholder.svg"}
                    alt={pair.baseToken.symbol}
                    className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl object-cover border-2 border-white/30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                ) : null}
                <div
                  className={`${pair.info?.imageUrl ? "hidden" : ""} absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-md opacity-90`}
                />
                <div
                  className={`${pair.info?.imageUrl ? "hidden" : ""} relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20`}
                >
                  <BarChart3 className="h-4 w-4 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <CardTitle className="text-lg sm:text-2xl bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                  </CardTitle>
                  {pair.boosts && pair.boosts.active > 0 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {pair.boosts.active} Boost{pair.boosts.active > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 sm:mb-3">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                    {getChainDisplayName(pair.chainId)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                    {pair.dexId.toUpperCase()}
                  </Badge>
                  {pair.labels?.slice(0, 2).map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="bg-gray-500/20 text-gray-300 border-gray-400/30 text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                  {pair.pairCreatedAt && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">{formatDate(pair.pairCreatedAt)}</span>
                      <span className="sm:hidden">Created</span>
                    </Badge>
                  )}
                </div>

                {/* Price and Change */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div>
                    <div className="text-xl sm:text-3xl font-bold text-white">
                      {pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(6)}` : pair.priceNative}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">
                      {pair.priceNative} {pair.quoteToken.symbol}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 sm:gap-2 ${getTrendColor(pair.priceChange.h24)}`}>
                    {getTrendIcon(pair.priceChange.h24)}
                    <span className="text-base sm:text-xl font-semibold">
                      {pair.priceChange.h24 > 0 ? "+" : ""}
                      {pair.priceChange.h24.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pair.url, "_blank")}
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-xs sm:text-sm text-white"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">DexScreener</span>
                  <span className="sm:hidden">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(pair.pairAddress, pair.pairAddress)}
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-xs sm:text-sm text-white"
                >
                  {copied === pair.pairAddress ? (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Copy Address</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-6 pt-0 relative z-10">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm text-xs sm:text-sm border border-white/20">
                <TabsTrigger
                  value="overview"
                  className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="liquidity"
                  className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Liquidity
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Info
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {pair.marketCap && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 relative group/metric">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-300">Market Cap</span>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-white relative z-10">
                        {formatNumber(pair.marketCap)}
                      </div>
                    </div>
                  )}

                  {pair.fdv && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 relative group/metric">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-300">FDV</span>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-white relative z-10">
                        {formatNumber(pair.fdv)}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 relative group/metric">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Volume 24h</span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white relative z-10">
                      ${formatVolume(pair.volume.h24)}
                    </div>
                  </div>

                  {pair.liquidity?.usd && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 relative group/metric">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-300">Liquidity</span>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-white relative z-10">
                        {formatNumber(pair.liquidity.usd)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Changes */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    Price Changes
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">5 Min</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getTrendColor(pair.priceChange.m5 || 0)}`}>
                        {(pair.priceChange.m5 || 0) > 0 ? "+" : ""}
                        {(pair.priceChange.m5 || 0).toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">1 Hour</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getTrendColor(pair.priceChange.h1 || 0)}`}>
                        {(pair.priceChange.h1 || 0) > 0 ? "+" : ""}
                        {(pair.priceChange.h1 || 0).toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">6 Hours</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getTrendColor(pair.priceChange.h6 || 0)}`}>
                        {(pair.priceChange.h6 || 0) > 0 ? "+" : ""}
                        {(pair.priceChange.h6 || 0).toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">24 Hours</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getTrendColor(pair.priceChange.h24 || 0)}`}>
                        {(pair.priceChange.h24 || 0) > 0 ? "+" : ""}
                        {(pair.priceChange.h24 || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Trading Tab */}
              <TabsContent value="trading" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Volume Breakdown */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    Volume Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">5 Min</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">${formatVolume(pair.volume.m5)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">1 Hour</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">${formatVolume(pair.volume.h1)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">6 Hours</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">${formatVolume(pair.volume.h6)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">24 Hours</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">
                        ${formatVolume(pair.volume.h24)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Analysis */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                    <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    Transaction Analysis
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: "24 Hours", data: pair.txns.h24 },
                      { label: "6 Hours", data: pair.txns.h6 },
                      { label: "1 Hour", data: pair.txns.h1 },
                      { label: "5 Minutes", data: pair.txns.m5 },
                    ].map((period) => {
                      const buyPressure = getBuyPressure(period.data.buys, period.data.sells)
                      const total = period.data.buys + period.data.sells
                      return (
                        <div key={period.label} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium text-gray-300">{period.label}</span>
                            <span className="text-xs sm:text-sm text-gray-300">{total} txns</span>
                          </div>
                          <div className="flex gap-2 text-xs sm:text-sm">
                            <span className="text-green-400">Buys: {period.data.buys}</span>
                            <span className="text-red-400">Sells: {period.data.sells}</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${buyPressure}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-300">Buy Pressure: {buyPressure.toFixed(1)}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Liquidity Tab */}
              <TabsContent value="liquidity" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {pair.liquidity && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                      Liquidity Pool Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {pair.liquidity.usd && (
                        <div className="text-center">
                          <div className="text-xs sm:text-sm text-gray-300 mb-1">Total Liquidity</div>
                          <div className="text-lg sm:text-xl font-bold text-white">
                            {formatNumber(pair.liquidity.usd)}
                          </div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-300 mb-1">{pair.baseToken.symbol} Reserve</div>
                        <div className="text-lg sm:text-xl font-bold text-white">
                          {formatVolume(pair.liquidity.base)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-300 mb-1">{pair.quoteToken.symbol} Reserve</div>
                        <div className="text-lg sm:text-xl font-bold text-white">
                          {formatVolume(pair.liquidity.quote)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Token Addresses */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => onTokenClick?.(pair.baseToken.symbol, pair.chainId)}
                        className="hover:text-purple-300 hover:underline transition-colors text-sm sm:text-base text-white"
                      >
                        {pair.baseToken.name} ({pair.baseToken.symbol})
                      </button>
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-300 break-all sm:break-normal">
                        {formatAddress(pair.baseToken.address)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pair.baseToken.address, `base-${pair.pairAddress}`)}
                        className="h-6 w-6 p-0 ml-2 flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/20"
                      >
                        {copied === `base-${pair.pairAddress}` ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => onTokenClick?.(pair.quoteToken.symbol, pair.chainId)}
                        className="hover:text-purple-300 hover:underline transition-colors text-sm sm:text-base text-white"
                      >
                        {pair.quoteToken.name} ({pair.quoteToken.symbol})
                      </button>
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-300 break-all sm:break-normal">
                        {formatAddress(pair.quoteToken.address)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pair.quoteToken.address, `quote-${pair.pairAddress}`)}
                        className="h-6 w-6 p-0 ml-2 flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/20"
                      >
                        {copied === `quote-${pair.pairAddress}` ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Links */}
                {(pair.info?.websites || pair.info?.socials) && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      Project Links
                    </h3>
                    <div className="space-y-3">
                      {pair.info?.websites && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Websites</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.info.websites.map((website, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(website.url, "_blank")}
                                className="bg-white/10 hover:bg-white/20 border-white/30 text-xs text-white"
                              >
                                <Globe className="h-3 w-3 mr-2" />
                                Website
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {pair.info?.socials && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Social Media</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.info.socials.map((social, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://${social.platform}.com/${social.handle}`, "_blank")}
                                className="bg-white/10 hover:bg-white/20 border-white/30 text-xs text-white"
                              >
                                {getSocialIcon(social.platform)}
                                <span className="ml-2 capitalize">
                                  {social.platform}: @{social.handle}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pair Contract */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 text-white">Pair Contract</h3>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-300">Contract Address</div>
                      <div className="font-mono text-xs sm:text-sm text-white break-all sm:break-normal">
                        {formatAddress(pair.pairAddress)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(pair.pairAddress, `contract-${pair.pairAddress}`)}
                        className="bg-white/10 hover:bg-white/20 border-white/30 h-8 w-8 p-0"
                      >
                        {copied === `contract-${pair.pairAddress}` ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-white" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(pair.url, "_blank")}
                        className="bg-white/10 hover:bg-white/20 border-white/30 h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
      ))}
    </div>
  )
}
