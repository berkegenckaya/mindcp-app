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
    <div className="w-full max-w-4xl mx-auto">
      {pairs.map((pair, index) => (
        <Card
          key={pair.id}
          className="relative group rounded-2xl border border-white/35 bg-white/18 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)] transition-all duration-300 hover:bg-white/26 mb-6"
        >
          {/* Header with Token Image */}
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {/* Token Image */}
              <div className="relative h-16 w-16 flex-shrink-0">
                {pair.image_url ? (
                  <img
                    src={pair.image_url || "/placeholder.svg"}
                    alt={pair.baseToken.symbol}
                    className="h-16 w-16 rounded-xl object-cover border-2 border-white/30"
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
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    {pair.name}
                  </CardTitle>
                  {pair.boosts && pair.boosts > 0 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Boosted
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant="outline" className="bg-purple-50/20 text-purple-700 border-purple-300/50">
                    {getChainDisplayName(pair.chainId)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50/20 text-blue-700 border-blue-300/50">
                    {pair.dexId.toUpperCase()}
                  </Badge>
                  {pair.labels?.map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="bg-gray-50/20 text-gray-700 border-gray-300/50 text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                  {pair.pairCreatedAt && (
                    <Badge variant="outline" className="bg-green-50/20 text-green-700 border-green-300/50 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {pair.pairCreatedAt}
                    </Badge>
                  )}
                </div>

                {/* Price and Change */}
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{pair.price}</div>
                    <div className="text-sm text-gray-600">
                      ≈ {pair.priceNative} {pair.quoteToken.symbol}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${getTrendColor(pair.price_trend)}`}>
                    {getTrendIcon(pair.price_trend)}
                    <span className="text-xl font-semibold">{pair.price_change_24h}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pair.url, "_blank")}
                  className="bg-white/10 hover:bg-white/20 border-white/30"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  DexScreener
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(pair.pairAddress, pair.id)}
                  className="bg-white/10 hover:bg-white/20 border-white/30"
                >
                  {copied === pair.id ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy Address
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-gray-600">MCap</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{pair.market_cap}</div>
                  </div>

                 {/*  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600">FDV</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{pair.fdv}</div>
                  </div> */}

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-600">Volume 24h</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{pair.volume_24h}</div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-600">Liquidity</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{pair.liquidity}</div>
                  </div>
                </div>

                {/* Price Changes */}
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Price Changes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">5 Minutes</div>
                      <div className={`text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.m5)}`}>
                        {pair.priceChanges.m5 > 0 ? "+" : ""}
                        {pair.priceChanges.m5.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">1 Hour</div>
                      <div className={`text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h1)}`}>
                        {pair.priceChanges.h1 > 0 ? "+" : ""}
                        {pair.priceChanges.h1.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">6 Hours</div>
                      <div className={`text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h6)}`}>
                        {pair.priceChanges.h6 > 0 ? "+" : ""}
                        {pair.priceChanges.h6.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">24 Hours</div>
                      <div className={`text-lg font-semibold ${getPriceChangeColor(pair.priceChanges.h24)}`}>
                        {pair.priceChanges.h24 > 0 ? "+" : ""}
                        {pair.priceChanges.h24.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Trading Tab */}
              <TabsContent value="trading" className="mt-4 space-y-4">
                {/* Volume Breakdown */}
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Volume Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">5 Minutes</div>
                      <div className="text-lg font-semibold text-gray-900">{pair.volume_5m}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">1 Hour</div>
                      <div className="text-lg font-semibold text-gray-900">{pair.volume_1h}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">6 Hours</div>
                      <div className="text-lg font-semibold text-gray-900">{pair.volume_6h}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">24 Hours</div>
                      <div className="text-lg font-semibold text-gray-900">{pair.volume_24h}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Analysis */}
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-purple-500" />
                    Transaction Analysis
                  </h3>
                  <div className="space-y-4">
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
                            <span className="text-sm font-medium text-gray-600">{period.label}</span>
                            <span className="text-sm text-gray-600">{period.data.total} txns</span>
                          </div>
                          <div className="flex gap-2 text-sm">
                            <span className="text-green-600">Buys: {period.data.buys}</span>
                            <span className="text-red-600">Sells: {period.data.sells}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${buyPressure}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600">Buy Pressure: {buyPressure.toFixed(1)}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Liquidity Tab */}
              <TabsContent value="liquidity" className="mt-4 space-y-4">
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Liquidity Pool Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Total Liquidity</div>
                      <div className="text-xl font-bold text-gray-900">{pair.liquidity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">{pair.baseToken.symbol} Reserve</div>
                      <div className="text-xl font-bold text-gray-900">{pair.liquidityBase}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">{pair.quoteToken.symbol} Reserve</div>
                      <div className="text-xl font-bold text-gray-900">{pair.liquidityQuote}</div>
                    </div>
                  </div>
                </div>

                {/* Token Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => handleTokenClick(pair.baseToken.symbol, pair.chainId)}
                        className="hover:text-purple-600 hover:underline transition-colors"
                      >
                        {pair.baseToken.name} ({pair.baseToken.symbol})
                      </button>
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-600">{formatAddress(pair.baseToken.address)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pair.baseToken.address, `base-${pair.id}`)}
                        className="h-6 w-6 p-0"
                      >
                        {copied === `base-${pair.id}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <button
                        onClick={() => handleTokenClick(pair.quoteToken.symbol, pair.chainId)}
                        className="hover:text-purple-600 hover:underline transition-colors"
                      >
                        {pair.quoteToken.name} ({pair.quoteToken.symbol})
                      </button>
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-600">{formatAddress(pair.quoteToken.address)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pair.quoteToken.address, `quote-${pair.id}`)}
                        className="h-6 w-6 p-0"
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
              <TabsContent value="info" className="mt-4 space-y-4">
                {/* Links */}
                {(pair.websites || pair.socials) && (
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      Project Links
                    </h3>
                    <div className="space-y-3">
                      {pair.websites && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Websites</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.websites.map((website, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(website.url, "_blank")}
                                className="bg-white/10 hover:bg-white/20 border-white/30"
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
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Social Media</h4>
                          <div className="flex flex-wrap gap-2">
                            {pair.socials.map((social, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(social.url, "_blank")}
                                className="bg-white/10 hover:bg-white/20 border-white/30"
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
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3">Pair Contract</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Contract Address</div>
                      <div className="font-mono text-sm text-gray-900">{formatAddress(pair.pairAddress)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(pair.pairAddress, `contract-${pair.id}`)}
                        className="bg-white/10 hover:bg-white/20 border-white/30"
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
                        className="bg-white/10 hover:bg-white/20 border-white/30"
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
