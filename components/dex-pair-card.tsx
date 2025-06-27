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
  Star,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface DexPair {
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

interface DexPairsCardProps {
  pairs: DexPair[]
  onTokenClick?: (tokenSymbol: string, network: string) => void
}

export function DexPairsCard({ pairs, onTokenClick }: DexPairsCardProps) {
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

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
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

  const handleTokenClick = (tokenSymbol: string, network: string) => {
    if (onTokenClick) {
      onTokenClick(tokenSymbol, network)
    }
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

  const getSocialIcon = (type: string) => {
    switch (type.toLowerCase()) {
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

  return (
    <div className="w-full max-w-full overflow-hidden">
      {pairs.map((pair, index) => (
        <Card
          key={pair.id}
          className="
            relative group rounded-2xl border border-gray-700/50 bg-gray-800/40
            bg-white/18 backdrop-blur-md
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]
            transition-all duration-300 hover:bg-gray-800/60 mb-4 sm:mb-6
          "
        >
          {/* Header with Token Image */}
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <div className="flex items-start gap-2 sm:gap-4">
              {/* Token Image - daha küçük mobilde */}
              <div className="relative h-10 w-10 sm:h-16 sm:w-16 flex-shrink-0">
                {pair.image_url ? (
                  <img
                    src={pair.image_url || "/placeholder.svg"}
                    alt={pair.baseToken.symbol}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-cover border-2 border-white/30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                ) : null}
                <div
                  className={`${pair.image_url ? "hidden" : ""} absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90`}
                />
                <div
                  className={`${pair.image_url ? "hidden" : ""} relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner`}
                >
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-start gap-1 sm:gap-3 mb-1 sm:mb-2">
                  <CardTitle className="text-base sm:text-2xl text-white leading-tight">{pair.name}</CardTitle>
                  {pair.boosts && pair.boosts > 0 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs flex-shrink-0">
                      <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      <span className="hidden sm:inline">Boosted</span>
                      <span className="sm:hidden">★</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-wrap mb-2 sm:mb-3 overflow-x-auto pb-1">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600/50 text-xs">
                    {getChainDisplayName(pair.chainId)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600/50 text-xs">
                    {pair.dexId.toUpperCase()}
                  </Badge>
                  {pair.labels?.slice(0, 2).map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="bg-gray-700/30 text-gray-300 border-gray-600/50 text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                  {pair.pairCreatedAt && (
                    <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-600/50 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">{pair.pairCreatedAt}</span>
                      <span className="sm:hidden">Created</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg sm:text-3xl font-bold text-white leading-tight">{pair.price}</div>
                    <div className="text-xs sm:text-sm text-gray-300 truncate">
                      ≈ {pair.priceNative} {pair.quoteToken.symbol}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${getTrendColor(pair.price_trend)}`}>
                    {getTrendIcon(pair.price_trend)}
                    <span className="text-sm sm:text-xl font-semibold">{pair.price_change_24h}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pair.url, "_blank")}
                  className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white text-xs h-7 sm:h-9 px-2 sm:px-3"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">DexScreener</span>
                  <span className="sm:hidden">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(pair.pairAddress, pair.id)}
                  className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white text-xs h-7 sm:h-9 px-2 sm:px-3"
                >
                  {copied === pair.id ? (
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  <span className="hidden sm:inline">Copy Address</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-2 sm:p-6 pt-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700/40 backdrop-blur-sm h-8 sm:h-10">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-1 sm:px-3">
                  <span className="hidden sm:inline">Overview</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="trading" className="text-xs sm:text-sm px-1 sm:px-3">
                  <span className="hidden sm:inline">Trading</span>
                  <span className="sm:hidden">Trade</span>
                </TabsTrigger>
                <TabsTrigger value="liquidity" className="text-xs sm:text-sm px-1 sm:px-3">
                  <span className="hidden sm:inline">Liquidity</span>
                  <span className="sm:hidden">Pool</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs sm:text-sm px-1 sm:px-3">
                  Info
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-lg sm:rounded-xl p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300 truncate">Market Cap</span>
                    </div>
                    <div className="text-xs sm:text-lg font-bold text-white truncate">{pair.market_cap}</div>
                  </div>

                  <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">FDV</span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white">{pair.fdv}</div>
                  </div>

                  <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Volume 24h</span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white">{pair.volume_24h}</div>
                  </div>

                  <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Liquidity</span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-white">{pair.liquidity}</div>
                  </div>
                </div>

                {/* Price Changes */}
                <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <p className="text-white">Price Changes</p>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="text-center min-w-0">
                      <div className="text-xs text-gray-300 mb-1 truncate">5m</div>
                      <div
                        className={`text-xs sm:text-lg font-semibold truncate ${getPriceChangeColor(pair.priceChanges.m5)}`}
                      >
                        {pair.priceChanges.m5 > 0 ? "+" : ""}
                        {pair.priceChanges.m5.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">1 Hour</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h1)}`}>
                        {pair.priceChanges.h1 > 0 ? "+" : ""}
                        {pair.priceChanges.h1.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">6 Hours</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h6)}`}>
                        {pair.priceChanges.h6 > 0 ? "+" : ""}
                        {pair.priceChanges.h6.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">24 Hours</div>
                      <div className={`text-sm sm:text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h24)}`}>
                        {pair.priceChanges.h24 > 0 ? "+" : ""}
                        {pair.priceChanges.h24.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Trading Tab */}
              <TabsContent value="trading" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Volume Breakdown */}
                <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <p className="text-white">Volume Breakdown</p>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">5 Min</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">{pair.volume_5m}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">1 Hour</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">{pair.volume_1h}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">6 Hours</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">{pair.volume_6h}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-300 mb-1">24 Hours</div>
                      <div className="text-sm sm:text-lg font-semibold text-white">{pair.volume_24h}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Analysis */}
                <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    <p className="text-white">Transaction Analysis</p>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: "24 Hours", data: pair.transactions.h24 },
                      { label: "6 Hours", data: pair.transactions.h6 },
                      { label: "1 Hour", data: pair.transactions.h1 },
                      { label: "5 Minutes", data: pair.transactions.m5 },
                    ].map((period) => {
                      const buyPressure = getBuyPressure(period.data.buys, period.data.sells)
                      return (
                        <div key={period.label} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium text-gray-300">{period.label}</span>
                            <span className="text-xs sm:text-sm text-gray-300">{period.data.total} txns</span>
                          </div>
                          <div className="flex gap-2 text-xs sm:text-sm">
                            <span className="text-green-600">Buys: {period.data.buys}</span>
                            <span className="text-red-600">Sells: {period.data.sells}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
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
                <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                   <p className="text-white">Liquidity Overview</p>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-300 mb-1">Total Liquidity</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{pair.liquidity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-300 mb-1">{pair.baseToken.symbol} Reserve</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{pair.liquidityBase}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-300 mb-1">{pair.quoteToken.symbol} Reserve</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{pair.liquidityQuote}</div>
                    </div>
                  </div>
                </div>

                {/* Token Addresses */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="bg-gray-700/40 backdrop-blur-sm border text-white border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => handleTokenClick(pair.baseToken.symbol, pair.chainId)}
                        className="hover:text-purple-600 text-white hover:underline transition-colors text-sm sm:text-base"
                      >
                        {pair.baseToken.name} ({pair.baseToken.symbol})
                      </button>
                    </h4>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-gray-300 truncate flex-1 min-w-0">
                        {formatAddress(pair.baseToken.address)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pair.baseToken.address, `base-${pair.id}`)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        {copied === `base-${pair.id}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-700/40 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => handleTokenClick(pair.quoteToken.symbol, pair.chainId)}
                        className="hover:text-purple-600 hover:underline transition-colors text-sm sm:text-base"
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
                        onClick={() => copyToClipboard(pair.quoteToken.address, `quote-${pair.id}`)}
                        className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                      >
                        {copied === `quote-${pair.id}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {/* Links */}
                {(pair.websites || pair.socials) && (
                  <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      <p className="text-white">Project Links</p>
                    </h3>
                    <div className="space-y-3">
                      {pair.websites && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Websites</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.websites.map((website, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(website.url, "_blank")}
                                className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white text-xs"
                              >
                                <Globe className="h-3 w-3 mr-2" />
                                {website.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {pair.socials && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Social Media</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.socials.map((social, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(social.url, "_blank")}
                                className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white text-xs"
                              >
                                {getSocialIcon(social.type)}
                                <span className="ml-2 capitalize">{social.type}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pair Contract */}
                <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg text-white font-semibold mb-3">Pair Contract</h3>
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
                        onClick={() => copyToClipboard(pair.pairAddress, `contract-${pair.id}`)}
                        className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white h-8 w-8 p-0"
                      >
                        {copied === `contract-${pair.id}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(pair.url, "_blank")}
                        className="bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/50 text-white h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
