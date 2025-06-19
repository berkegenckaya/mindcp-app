"use client"

import { Wallet, TrendingUp, TrendingDown, Activity, DollarSign, Zap, Clock, BarChart3, ExternalLink, Copy, Check, Calendar, Hash, Coins, Network } from 'lucide-react'
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
        return <TrendingUp className="h-3 w-3 text-blue-500" />
      case "transfer":
        return <Activity className="h-3 w-3 text-green-500" />
      case "deposit":
        return <TrendingDown className="h-3 w-3 text-purple-500" />
      case "withdraw":
        return <TrendingUp className="h-3 w-3 text-orange-500" />
      default:
        return <Hash className="h-3 w-3 text-gray-500" />
    }
  }

  const getActivityTrend = () => {
    if (walletData.activity.last_24h > walletData.activity.last_7d / 7) {
      return { icon: <TrendingUp className="h-4 w-4 text-green-500" />, text: "Increasing", color: "text-green-600" }
    } else if (walletData.activity.last_24h < walletData.activity.last_7d / 7) {
      return { icon: <TrendingDown className="h-4 w-4 text-red-500" />, text: "Decreasing", color: "text-red-600" }
    }
    return { icon: <Activity className="h-4 w-4 text-gray-500" />, text: "Stable", color: "text-gray-600" }
  }

  const activityTrend = getActivityTrend()

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="relative group rounded-2xl border border-white/35 bg-white/18 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)] transition-all duration-300 hover:bg-white/26">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {/* Wallet Icon */}
            <div className="relative h-16 w-16 flex-shrink-0">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Wallet Analysis
              </CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-700">{formatAddress(walletData.address)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletData.address)}
                    className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Badge variant="outline" className="bg-blue-50/20 text-blue-700 border-blue-300/50">
                  {getChainDisplayName(walletData.summary.most_active_chain)}
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{walletData.summary.total_volume}</div>
              <div className="text-sm text-gray-600">Total Volume</div>
              <div className="flex items-center gap-1 justify-end mt-1">
                {activityTrend.icon}
                <span className={`text-sm ${activityTrend.color}`}>{activityTrend.text}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Transactions</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{walletData.summary.total_transactions}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Volume</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{walletData.summary.total_volume}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Gas Spent</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{walletData.summary.gas_spent}</div>
                </div>

               {/*  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Chains</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{walletData.summary.chains_active}</div>
                </div> */}
              </div>

              {/* Active Chains */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-500" />
                  Active Chains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {walletData.chains.map((chain) => (
                    <Badge
                      key={chain}
                      variant="outline"
                      className="bg-purple-50/20 text-purple-700 border-purple-300/50"
                    >
                      {getChainDisplayName(chain)}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4 space-y-4">
              {/* Activity Timeline */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Activity Timeline
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{walletData.activity.last_24h}</div>
                    <div className="text-sm text-gray-600">Last 24 Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{walletData.activity.last_7d}</div>
                    <div className="text-sm text-gray-600">Last 7 Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{walletData.activity.last_30d}</div>
                    <div className="text-sm text-gray-600">Last 30 Days</div>
                  </div>
                </div>
              </div>

              {/* Transaction Types */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Transaction Types
                </h3>
                <div className="space-y-3">
                  {Object.entries(walletData.transaction_types).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTransactionTypeIcon(type)}
                        <span className="text-sm font-medium capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
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
            <TabsContent value="tokens" className="mt-4 space-y-4">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  Top Tokens by Value
                </h3>
                <div className="space-y-3">
                  {walletData.top_tokens.map((token, index) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{token.symbol}</div>
                          <div className="text-xs text-gray-600">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{token.total_value_formatted}</div>
                        <div className="text-xs text-gray-600">{token.count} transactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-4 space-y-4">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {walletData.recent_activity.map((activity) => (
                    <div
                      key={activity.hash}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {getTransactionTypeIcon(activity.type)}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{activity.timestamp_formatted}</span>
                            <Badge variant="outline" className="text-xs">
                              {getChainDisplayName(activity.chain)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900">{activity.value_formatted}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const explorerUrl = getTransactionExplorerUrl(activity.chain, activity.hash)
                            if (explorerUrl) window.open(explorerUrl, "_blank")
                          }}
                          className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Credits Used */}
        {/*   <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">Analysis powered by Cielo Finance • {walletData.credits_used} credits used</span>
          </div> */}
        </CardContent>
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
