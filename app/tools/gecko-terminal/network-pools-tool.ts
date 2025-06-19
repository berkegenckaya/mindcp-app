import { tool } from "ai"
import { z } from "zod"
import { fetchNetworkTrendingPools } from "./pools-api"

export const getNetworkTrendingPoolsTool = tool({
  description: "Get trending cryptocurrency trading pools for a specific network/blockchain",
  parameters: z.object({
    network: z
      .string()
      .describe(
        'Network/blockchain to get trending pools from. Examples: "eth", "bsc", "polygon_pos", "solana", "avalanche", "arbitrum", "optimism", "base"',
      ),
    limit: z.number().optional().default(10).describe("Number of pools to return (default: 10, max: 20)"),
  }),
  execute: async ({ network, limit = 10 }) => {
    try {
      console.log("Fetching trending pools for network:", { network, limit })

      // Validate and normalize network name
      const normalizedNetwork = normalizeNetworkName(network)
      if (!normalizedNetwork) {
        return JSON.stringify({
          error: `Invalid network "${network}". Supported networks: eth, bsc, polygon_pos, solana, avalanche, arbitrum, optimism, base, fantom, cronos`,
        })
      }

      const pools = await fetchNetworkTrendingPools(normalizedNetwork)

      if (!pools || pools.length === 0) {
        return JSON.stringify({
          error: `No trending pools found for ${normalizedNetwork}. The network might not have active pools or there might be an API issue.`,
        })
      }

      console.log("Fetched network pools data:", pools.length, "pools")

      // Limit the results
      const limitedPools = pools.slice(0, Math.min(limit, 20))

      // Format the data for better readability
      const formatNumber = (num: number, decimals = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
        if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
        return `$${num.toFixed(decimals)}`
      }

      const formatPercentage = (num: number) => {
        return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
      }

      const formattedPools = limitedPools.map((pool) => ({
        id: pool.id,
        name: pool.name,
        base_token: pool.base_token,
        quote_token: pool.quote_token,
        network: pool.network,
        price: pool.price_usd >= 1 ? `$${pool.price_usd.toFixed(4)}` : `$${pool.price_usd.toFixed(8)}`,
        price_change_24h: formatPercentage(pool.price_change_24h),
        price_trend: pool.price_change_24h > 0 ? "up" : pool.price_change_24h < 0 ? "down" : "stable",
        volume_24h: formatNumber(pool.volume_24h),
        liquidity: formatNumber(pool.liquidity_usd),
        market_cap: formatNumber(pool.market_cap_usd),
        address: pool.address,
      }))

      // Create a response with network-specific information
      const response = {
        success: true,
        message: `Here are the top ${limitedPools.length} trending pools on ${getNetworkDisplayName(normalizedNetwork)}:`,
        network: normalizedNetwork,
        network_display_name: getNetworkDisplayName(normalizedNetwork),
        pools_data: formattedPools,
      }

      console.log("Network pools tool response: success with", formattedPools.length, "pools")

      return JSON.stringify(response)
    } catch (error) {
      console.error("Network pools tool execution error:", error)
      return JSON.stringify({
        error: `An error occurred while fetching trending pools for ${network}: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  },
})

// Helper function to normalize network names
function normalizeNetworkName(network: string): string | null {
  const networkMap: Record<string, string> = {
    // Ethereum variants
    eth: "eth",
    ethereum: "eth",
    mainnet: "eth",

    // BSC variants
    bsc: "bsc",
    binance: "bsc",
    "binance-smart-chain": "bsc",
    bnb: "bsc",

    // Polygon variants
    polygon: "polygon_pos",
    polygon_pos: "polygon_pos",
    matic: "polygon_pos",

    // Solana variants
    solana: "solana",
    sol: "solana",

    // Avalanche variants
    avalanche: "avalanche",
    avax: "avalanche",

    // Arbitrum variants
    arbitrum: "arbitrum",
    arb: "arbitrum",

    // Optimism variants
    optimism: "optimism",
    op: "optimism",

    // Base variants
    base: "base",

    // Other networks
    fantom: "fantom",
    ftm: "fantom",
    cronos: "cronos",
    cro: "cronos",
  }

  const normalized = network.toLowerCase().trim()
  return networkMap[normalized] || null
}

// Helper function to get display names for networks
function getNetworkDisplayName(network: string): string {
  const displayNames: Record<string, string> = {
    eth: "Ethereum",
    bsc: "BNB Smart Chain",
    polygon_pos: "Polygon",
    solana: "Solana",
    avalanche: "Avalanche",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
    base: "Base",
    fantom: "Fantom",
    cronos: "Cronos",
  }

  return displayNames[network] || network.toUpperCase()
}
