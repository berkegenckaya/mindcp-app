"use client"

import { TrendingUp, TrendingDown, Minus, ExternalLink, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TokenInfo {
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
}

interface TokenInfoCardProps {
  tokenInfo: TokenInfo
}

export function TokenInfoCard({ tokenInfo }: TokenInfoCardProps) {
  const [copied, setCopied] = useState(false)

  const getTrendIcon = () => {
    switch (tokenInfo.price_trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatAddress = (address: string) => {
    if (address === "Native token" || address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="relative group rounded-2xl border border-white/35 bg-white/18 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)] transition-all duration-300 hover:bg-white/26 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_28px_rgba(0,0,0,0.2)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Token Icon Placeholder */}
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <span className="text-white font-bold text-sm">{tokenInfo.symbol.slice(0, 3)}</span>
              </div>
            </div>

            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {tokenInfo.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-white/20 backdrop-blur-sm border-white/30">{tokenInfo.symbol}</Badge>
                <Badge variant="outline" className="text-xs bg-purple-50/20 text-purple-700 border-purple-300/50">
                  {tokenInfo.blockchain}
                </Badge>
              </div>
            </div>
          </div>

          {/* Price and Trend */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{tokenInfo.price}</div>
            <div className={`flex items-center gap-1 justify-end ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{tokenInfo.price_change_24h}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Market Data Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
            <div className="text-xs text-gray-600 font-medium mb-1">Market Cap</div>
            <div className="text-lg font-semibold text-gray-900">{tokenInfo.market_cap}</div>
          </div>

          <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
            <div className="text-xs text-gray-600 font-medium mb-1">24h Volume</div>
            <div className="text-lg font-semibold text-gray-900">{tokenInfo.volume_24h}</div>
          </div>

          <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
            <div className="text-xs text-gray-600 font-medium mb-1">Circulating Supply</div>
            <div className="text-lg font-semibold text-gray-900">{tokenInfo.circulating_supply}</div>
          </div>

          <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
            <div className="text-xs text-gray-600 font-medium mb-1">Total Supply</div>
            <div className="text-lg font-semibold text-gray-900">{tokenInfo.total_supply}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-3">
            <div>
              <div className="text-xs text-gray-600 font-medium">Max Supply</div>
              <div className="text-sm font-semibold text-gray-900">{tokenInfo.max_supply}</div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 font-medium mb-1">Contract Address</div>
                <div className="text-sm font-mono text-gray-900">{formatAddress(tokenInfo.contract_address)}</div>
              </div>
              {tokenInfo.contract_address !== "Native token" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(tokenInfo.contract_address)}
                    className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const explorerUrl = getExplorerUrl(tokenInfo.blockchain, tokenInfo.contract_address)
                      if (explorerUrl) window.open(explorerUrl, "_blank")
                    }}
                    className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  )
}

function getExplorerUrl(blockchain: string, address: string): string | null {
  const explorers: Record<string, string> = {
    ETH: `https://etherscan.io/token/${address}`,
    BSC: `https://bscscan.com/token/${address}`,
    POLYGON_POS: `https://polygonscan.com/token/${address}`,
    AVALANCHE: `https://snowtrace.io/token/${address}`,
    SOLANA: `https://solscan.io/token/${address}`,
  }

  return explorers[blockchain.toUpperCase()] || null
}
