"use client"

import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TokenInfo {
  name: string
  symbol: string
  price: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  market_cap: string
  volume_24h: string
  blockchain: string
  image_url?: string
  description?: string
  circulating_supply?: string
  total_supply?: string
  max_supply?: string
}

interface TokenInfoCompactProps {
  tokenInfo: TokenInfo
}

export function TokenInfoCompact({ tokenInfo }: TokenInfoCompactProps) {
  const getTrendIcon = () => {
    switch (tokenInfo.price_trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (tokenInfo.price_trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const openCoinGecko = () => {
    const searchQuery = encodeURIComponent(tokenInfo.name.toLowerCase().replace(/\s+/g, "-"))
    window.open(`https://www.coingecko.com/en/coins/${searchQuery}`, "_blank")
  }

  return (
    <div className="w-full">
      <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-3 sm:p-4 my-2">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
            {tokenInfo.image_url ? (
              <img
                src={tokenInfo.image_url || "/placeholder.svg"}
                alt={tokenInfo.name}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}
            <div
              className={`${tokenInfo.image_url ? "hidden" : ""} absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-sm opacity-90`}
            />
            <div
              className={`${tokenInfo.image_url ? "hidden" : ""} relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner`}
            >
              <span className="text-white font-bold text-xs sm:text-sm">{tokenInfo.symbol.slice(0, 3)}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">{tokenInfo.name}</div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge className="text-xs bg-white/30 backdrop-blur-sm border-white/40">{tokenInfo.symbol}</Badge>
              <Badge variant="outline" className="text-xs bg-purple-50/30 text-purple-700 border-purple-300/50">
                {tokenInfo.blockchain}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={openCoinGecko}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/10 hover:bg-white/20 flex-shrink-0"
            title="View on CoinGecko"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Description */}
        {tokenInfo.description && (
          <div className="mb-3 p-2 bg-white/10 rounded-lg">
            <p className="text-xs text-gray-700 line-clamp-2">{tokenInfo.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="bg-white/10 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">Price</div>
            <div className="font-semibold text-gray-900 text-sm sm:text-base">{tokenInfo.price}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">24h Change</div>
            <div className={`flex items-center gap-1 font-semibold text-sm sm:text-base ${getTrendColor()}`}>
              {getTrendIcon()}
              {tokenInfo.price_change_24h}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">Market Cap</div>
            <div className="font-semibold text-gray-900 text-xs sm:text-sm">{tokenInfo.market_cap}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">24h Volume</div>
            <div className="font-semibold text-gray-900 text-xs sm:text-sm">{tokenInfo.volume_24h}</div>
          </div>
        </div>

        {/* Additional Supply Info */}
        {(tokenInfo.circulating_supply || tokenInfo.total_supply || tokenInfo.max_supply) && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 sm:mt-3 text-xs">
            {tokenInfo.circulating_supply && (
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-gray-600 font-medium mb-1">Circulating</div>
                <div className="font-semibold text-gray-900 text-xs">{tokenInfo.circulating_supply}</div>
              </div>
            )}
            {tokenInfo.total_supply && (
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-gray-600 font-medium mb-1">Total</div>
                <div className="font-semibold text-gray-900 text-xs">{tokenInfo.total_supply}</div>
              </div>
            )}
            {tokenInfo.max_supply && (
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-gray-600 font-medium mb-1">Max</div>
                <div className="font-semibold text-gray-900 text-xs">{tokenInfo.max_supply}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
