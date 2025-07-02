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
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (tokenInfo.price_trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const openCoinGecko = () => {
    const searchQuery = encodeURIComponent(tokenInfo.name.toLowerCase().replace(/\s+/g, "-"))
    window.open(`https://www.coingecko.com/en/coins/${searchQuery}`, "_blank")
  }

  return (
    <div className="w-full">
      <div className="rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-md border border-white/20 p-3 sm:p-4 my-2 hover:from-white/15 hover:to-white/8 hover:border-white/30 transition-all duration-300 group">
        {/* Enhanced glassmorphic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

        <div className="flex items-center gap-2 sm:gap-3 mb-3 relative z-10">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
            {tokenInfo.image_url ? (
              <img
                src={tokenInfo.image_url || "/placeholder.svg"}
                alt={tokenInfo.name}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover border border-white/20"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}
            <div
              className={`${tokenInfo.image_url ? "hidden" : ""} absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-sm opacity-90`}
            />
            <div
              className={`${tokenInfo.image_url ? "hidden" : ""} relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20`}
            >
              <span className="text-white font-bold text-xs sm:text-sm">{tokenInfo.symbol.slice(0, 3)}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white truncate text-sm sm:text-base">{tokenInfo.name}</div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white">
                {tokenInfo.symbol}
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/30">
                {tokenInfo.blockchain}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={openCoinGecko}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/10 hover:bg-white/20 flex-shrink-0 border border-white/20"
            title="View on CoinGecko"
          >
            <ExternalLink className="h-3 w-3 text-white" />
          </Button>
        </div>

        {/* Description */}
        {tokenInfo.description && (
          <div className="mb-3 p-2 bg-white/10 rounded-lg border border-white/20 relative z-10">
            <p className="text-xs text-gray-300 line-clamp-2">{tokenInfo.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm relative z-10">
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
            <div className="text-xs text-gray-300 font-medium mb-1">Price</div>
            <div className="font-semibold text-white text-sm sm:text-base">{tokenInfo.price}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
            <div className="text-xs text-gray-300 font-medium mb-1">24h Change</div>
            <div className={`flex items-center gap-1 font-semibold text-sm sm:text-base ${getTrendColor()}`}>
              {getTrendIcon()}
              {tokenInfo.price_change_24h}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
            <div className="text-xs text-gray-300 font-medium mb-1">Market Cap</div>
            <div className="font-semibold text-white text-xs sm:text-sm">{tokenInfo.market_cap}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
            <div className="text-xs text-gray-300 font-medium mb-1">24h Volume</div>
            <div className="font-semibold text-white text-xs sm:text-sm">{tokenInfo.volume_24h}</div>
          </div>
        </div>

        {/* Additional Supply Info */}
        {(tokenInfo.circulating_supply || tokenInfo.total_supply || tokenInfo.max_supply) && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 sm:mt-3 text-xs relative z-10">
            {tokenInfo.circulating_supply && (
              <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                <div className="text-gray-300 font-medium mb-1">Circulating</div>
                <div className="font-semibold text-white text-xs">{tokenInfo.circulating_supply}</div>
              </div>
            )}
            {tokenInfo.total_supply && (
              <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                <div className="text-gray-300 font-medium mb-1">Total</div>
                <div className="font-semibold text-white text-xs">{tokenInfo.total_supply}</div>
              </div>
            )}
            {tokenInfo.max_supply && (
              <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                <div className="text-gray-300 font-medium mb-1">Max</div>
                <div className="font-semibold text-white text-xs">{tokenInfo.max_supply}</div>
              </div>
            )}
          </div>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />

        {/* Enhanced hover glow effect */}
        <div
          aria-hidden
          className="
          absolute inset-0 rounded-xl
          bg-gradient-to-br from-white/0 via-white/0 to-white/0
          group-hover:from-white/3 group-hover:via-white/2 group-hover:to-white/5
          transition-all duration-500
          "
        />

        {/* Border glow on hover */}
        <div
          aria-hidden
          className="
          absolute inset-0 rounded-xl
          ring-1 ring-transparent
          group-hover:ring-white/15
          transition-all duration-500
          "
        />
      </div>
    </div>
  )
}
