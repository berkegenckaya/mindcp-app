"use client"

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Zap,
  Clock,
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Hash,
  Coins,
  Network,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface WalletData {
  address: string
  summary: {
    total_transactions: number
    total_volume: string
    gas_spent: string
    chains_active: number
    most_active_chain: string
  }
  activity: {
    last_24h: number
    last_7d: number
    last_30d: number
  }
  transaction_types: Record<string, number>
  top_tokens: Array<{
    symbol: string
    name: string
    count: number
    total_value_formatted: string
  }>
  recent_activity: Array<{
    hash: string
    timestamp_formatted: string
    type: string
    value_formatted: string
    chain: string
    description: string
  }>
  chains: string[]
  credits_used: number
}

interface WalletAnalysisCardProps {
  walletData: WalletData
}

export function WalletAnalysisCard({ walletData }: WalletAnalysisCardProps) {
  const [copied, setCopied] = useState(false)

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
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getChainDisplayName = (chain: string) => {
    const chainNames: Record<string, string> = {
      ethereum: "Ethereum",
      polygon: "Polygon",
      bsc: "BSC",
      avalanche: "Avalanche",
      arbitrum: "Arbitrum",
      optimism: "Optimism",
      base: "Base",
      solana: "Solana",
      fantom: "Fantom",
    }
    return chainNames[chain.toLowerCase()] || chain.toUpperCase()
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "swap":
        return <TrendingUp className="h-3 w-3 text-blue-400" />
      case "transfer":
        return <Activity className="h-3 w-3 text-green-400" />
      case "deposit":
        return <TrendingDown className="h-3 w-3 text-purple-400" />
      case "withdraw":
        return <TrendingUp className="h-3 w-3 text-orange-400" />
      default:
        return <Hash className="h-3 w-3 text-gray-400" />
    }
  }

  const getActivityTrend = () => {
    if (walletData.activity.last_24h > walletData.activity.last_7d / 7) {
      return {
        icon: <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />,
        text: "Increasing",
        color: "text-green-400",
      }
    } else if (walletData.activity.last_24h < walletData.activity.last_7d / 7) {
      return {
        icon: <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />,
        text: "Decreasing",
        color: "text-red-400",
      }
    }
    return {
      icon: <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />,
      text: "Stable",
      color: "text-gray-400",
    }
  }

  const activityTrend = getActivityTrend()

  return (
    <div className="w-full">
      <Card className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300  ">
        {/* Enhanced glassmorphic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        {/* Header */}
        <CardHeader className="pb-3 sm:pb-4 relative z-10">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wallet Icon */}
            <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-purple-400/80 to-cyan-400/80 blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/90 to-cyan-400/90 shadow-inner border border-white/20">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-2xl bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Wallet Analysis
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm text-gray-300">
                    {formatAddress(walletData.address)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletData.address)}
                    className="h-5 w-5 sm:h-6 sm:w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white" />}
                  </Button>
                </div>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                  {getChainDisplayName(walletData.summary.most_active_chain)}
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="text-right">
              <div className="text-lg sm:text-2xl font-bold text-white">{walletData.summary.total_volume}</div>
              <div className="text-xs sm:text-sm text-gray-300">Total Volume</div>
              <div className="flex items-center gap-1 justify-end mt-1">
                {activityTrend.icon}
                <span className={`text-xs sm:text-sm ${activityTrend.color}`}>{activityTrend.text}</span>
              </div>
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
                value="activity"
                className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="tokens"
                className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Tokens
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="text-xs sm:text-sm px-1 sm:px-3 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Txns
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Transactions</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">{walletData.summary.total_transactions}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Volume</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">{walletData.summary.total_volume}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Gas Spent</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">{walletData.summary.gas_spent}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Chains</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">{walletData.summary.chains_active}</div>
                </div>
              </div>

              {/* Active Chains */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <Network className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  Active Chains
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {walletData.chains.map((chain) => (
                    <Badge
                      key={chain}
                      variant="outline"
                      className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs"
                    >
                      {getChainDisplayName(chain)}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {/* Activity Timeline */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  Activity Timeline
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{walletData.activity.last_24h}</div>
                    <div className="text-xs sm:text-sm text-gray-300">Last 24 Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{walletData.activity.last_7d}</div>
                    <div className="text-xs sm:text-sm text-gray-300">Last 7 Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{walletData.activity.last_30d}</div>
                    <div className="text-xs sm:text-sm text-gray-300">Last 30 Days</div>
                  </div>
                </div>
              </div>

              {/* Transaction Types */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  Transaction Types
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(walletData.transaction_types).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTransactionTypeIcon(type)}
                        <span className="text-xs sm:text-sm font-medium capitalize text-white">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white">{count}</span>
                        <div className="w-16 sm:w-20 bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(count / walletData.summary.total_transactions) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tokens Tab */}
            <TabsContent value="tokens" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  Top Tokens by Value
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {walletData.top_tokens.map((token, index) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-2 sm:p-3 bg-white/10 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white font-bold text-xs sm:text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm sm:text-base">{token.symbol}</div>
                          <div className="text-xs text-gray-300">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white text-sm sm:text-base">
                          {token.total_value_formatted}
                        </div>
                        <div className="text-xs text-gray-300">{token.count} transactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  Recent Activity
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {walletData.recent_activity.map((activity) => (
                    <div
                      key={activity.hash}
                      className="flex items-center justify-between p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors border border-white/20"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {getTransactionTypeIcon(activity.type)}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                            {activity.description}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-300 flex-wrap">
                            <Calendar className="h-3 w-3" />
                            <span>{activity.timestamp_formatted}</span>
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-500/20 text-gray-300 border-gray-400/30"
                            >
                              {getChainDisplayName(activity.chain)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="font-semibold text-white text-xs sm:text-sm">{activity.value_formatted}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const explorerUrl = getTransactionExplorerUrl(activity.chain, activity.hash)
                            if (explorerUrl) window.open(explorerUrl, "_blank")
                          }}
                          className="h-5 w-5 sm:h-6 sm:w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                        >
                          <ExternalLink className="h-3 w-3 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
    </div>
  )
}

function getTransactionExplorerUrl(chain: string, hash: string): string | null {
  const explorers: Record<string, string> = {
    ethereum: `https://etherscan.io/tx/${hash}`,
    polygon: `https://polygonscan.com/tx/${hash}`,
    bsc: `https://bscscan.com/tx/${hash}`,
    avalanche: `https://snowtrace.io/tx/${hash}`,
    arbitrum: `https://arbiscan.io/tx/${hash}`,
    optimism: `https://optimistic.etherscan.io/tx/${hash}`,
    base: `https://basescan.org/tx/${hash}`,
    fantom: `https://ftmscan.com/tx/${hash}`,
    solana: `https://solscan.io/tx/${hash}`,
  }

  return explorers[chain.toLowerCase()] || null
}
