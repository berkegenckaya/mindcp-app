"use client"

import { TrendingUp, TrendingDown, ExternalLink, Network, Activity, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Pool {
  name: string
  dex: string
  price: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  volume_24h: string
  liquidity: string
  pair_address: string
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
  url: string
  image_url?: string // Add image_url field
}

interface ChainData {
  chain_name: string
  pools_count: number
  pools: Pool[]
}

interface MultiChainPoolsData {
  success: boolean
  message: string
  ticker: string
  total_pools: number
  chains: string[]
  pools_by_chain: Record<string, ChainData>
}

interface MultiChainPoolsCardProps {
  poolsData: MultiChainPoolsData
  onPairClick?: (pairAddress: string, network: string) => void
}

export function MultiChainPoolsCard({ poolsData, onPairClick }: MultiChainPoolsCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <Activity className="h-3 w-3 text-gray-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getChainIcon = (chainName: string) => {
    return <Network className="h-4 w-4 text-blue-400" />
  }

  const openDexScreener = (url: string) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  const handlePoolClick = (pool: Pool, chainId: string) => {
    if (onPairClick && pool.pair_address) {
      onPairClick(pool.pair_address, chainId)
    }
  }

  // Function to render token image with fallback
  const renderTokenImage = (pool: Pool) => {
    if (pool.image_url) {
      return (
        <img
          src={pool.image_url}
          alt={pool.base_token.symbol}
          className="w-8 h-8 rounded-full object-cover border border-white/20"
          onError={(e) => {
            // Fallback to ticker text if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      )
    }
    return null
  }

  const renderTokenFallback = (pool: Pool) => {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm border border-white/20">
        {pool.base_token.symbol.charAt(0)}
      </div>
    )
  }

  // Sort chains to prioritize Ethereum first
  const sortedChains = [...poolsData.chains].sort((a, b) => {
    const aChainName = poolsData.pools_by_chain[a].chain_name.toLowerCase()
    const bChainName = poolsData.pools_by_chain[b].chain_name.toLowerCase()
    
    // Ethereum always comes first
    if (aChainName === 'ethereum') return -1
    if (bChainName === 'ethereum') return 1
    
    // Then sort alphabetically
    return aChainName.localeCompare(bChainName)
  })

  // Get the first available token image from all pools
  const getFirstTokenImage = () => {
    for (const chain of sortedChains) {
      const chainData = poolsData.pools_by_chain[chain]
      for (const pool of chainData.pools) {
        if (pool.image_url) {
          return pool.image_url
        }
      }
    }
    return null
  }

  const firstTokenImage = getFirstTokenImage()

  return (
    <div className="w-full">
      <Card className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
        {/* Enhanced glassmorphic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        {/* Header */}
        <CardHeader className="pb-3 sm:pb-4 relative z-10">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Token Icon */}
            <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
              <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-blue-400/80 to-purple-400/80 blur-md opacity-90" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/90 to-purple-400/90 shadow-inner border border-white/20 overflow-hidden">
                {firstTokenImage ? (
                  <img
                    src={firstTokenImage}
                    alt={poolsData.ticker}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      // Fallback to ticker text if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span className={`text-white font-bold text-lg sm:text-xl ${firstTokenImage ? 'hidden' : 'flex'}`}>
                  {poolsData.ticker}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-2xl bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {poolsData.ticker} Pools
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                  {poolsData.total_pools} Total Pools
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                  {poolsData.chains.length} Chains
                </Badge>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="text-right">
              <div className="text-lg sm:text-2xl font-bold text-white">{poolsData.chains.length}</div>
              <div className="text-xs sm:text-sm text-gray-300">Networks</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6 pt-0 relative z-10">
          <Tabs defaultValue={sortedChains[0]} className="w-full">
            <TabsList className="grid w-full bg-white/20 backdrop-blur-sm text-xs sm:text-sm border border-white/20" style={{ gridTemplateColumns: `repeat(${Math.min(sortedChains.length, 4)}, 1fr)` }}>
              {sortedChains.slice(0, 4).map((chain) => (
                <TabsTrigger
                  key={chain}
                  value={chain}
                  className="text-xs sm:text-sm text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  {poolsData.pools_by_chain[chain].chain_name}
                </TabsTrigger>
              ))}
            </TabsList>

            {sortedChains.map((chain) => {
              const chainData = poolsData.pools_by_chain[chain]
              return (
                <TabsContent key={chain} value={chain} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  {/* Chain Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getChainIcon(chainData.chain_name)}
                      <h3 className="text-lg font-semibold text-white">{chainData.chain_name}</h3>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                      {chainData.pools_count} Pools
                    </Badge>
                  </div>

                  {/* Pools List */}
                  <div className="space-y-2 sm:space-y-3">
                    {chainData.pools.map((pool, index) => (
                      <div
                        key={`${pool.pair_address}-${index}`}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                        onClick={() => handlePoolClick(pool, chain)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg text-white font-bold text-xs sm:text-sm">
                              #{index + 1}
                            </div>
                            
                            {/* Token Image */}
                            <div className="relative flex-shrink-0">
                              {renderTokenImage(pool)}
                              <div className={`${pool.image_url ? 'hidden' : 'flex'}`}>
                                {renderTokenFallback(pool)}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors">{pool.name}</span>
                                <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-300 border-gray-400/30">
                                  {pool.dex}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-4 mt-1 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-green-400" />
                                  <span className="text-xs sm:text-sm text-gray-300">{pool.price}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(pool.price_trend)}
                                  <span className={`text-xs sm:text-sm ${getTrendColor(pool.price_trend)}`}>
                                    {pool.price_change_24h}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-xs sm:text-sm text-gray-300 mb-1">Volume: {pool.volume_24h}</div>
                            <div className="text-xs sm:text-sm text-gray-300 mb-2">Liquidity: {pool.liquidity}</div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDexScreener(pool.url)
                                }}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                                title="View on DexScreener"
                              >
                                <ExternalLink className="h-3 w-3 text-white" />
                              </Button>
                              {onPairClick && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePoolClick(pool, chain)
                                  }}
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30"
                                  title="View Detailed Info"
                                >
                                  <Activity className="h-3 w-3 text-blue-300" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )
            })}
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