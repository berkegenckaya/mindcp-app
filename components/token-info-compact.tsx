"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TokenInfo {
  name: string
  symbol: string
  price: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  market_cap: string
  volume_24h: string
  blockchain: string
  contract_address: string
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

  return (
    <div className="inline-block rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4 my-2 max-w-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 scale-95 rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-sm opacity-90" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
            <span className="text-white font-bold text-xs">{tokenInfo.symbol.slice(0, 2)}</span>
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{tokenInfo.name}</div>
          <div className="flex items-center gap-2">
            <Badge className="text-xs bg-white/30 backdrop-blur-sm border-white/40">{tokenInfo.symbol}</Badge>
            <Badge variant="outline" className="text-xs bg-purple-50/30 text-purple-700 border-purple-300/50">
              {tokenInfo.blockchain}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-600 font-medium">Price</div>
          <div className="font-semibold text-gray-900">{tokenInfo.price}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-medium">24h Change</div>
          <div className={`flex items-center gap-1 font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            {tokenInfo.price_change_24h}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-medium">Market Cap</div>
          <div className="font-semibold text-gray-900">{tokenInfo.market_cap}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-medium">24h Volume</div>
          <div className="font-semibold text-gray-900">{tokenInfo.volume_24h}</div>
        </div>
         <div>
          <div className="text-xs text-gray-600 font-medium">24h Volume</div>
          <div className="font-semibold text-gray-900">{tokenInfo.contract_address}</div>
        </div>
      </div>
    </div>
  )
}
