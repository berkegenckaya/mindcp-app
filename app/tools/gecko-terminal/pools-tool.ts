import { tool } from "ai"
import { z } from "zod"
import { fetchNetworkTrendingPools, fetchAllNetworksTrendingPools } from "./pools-api"

export const getTrendingPoolsTool = tool({
  description: "Get trending cryptocurrency trading pools across all networks or for a specific network",
  parameters: z.object({
    network: z
      .string()
      .optional()
      .describe(
        'Optional network to filter pools. Examples: "eth", "bsc", "polygon_pos", "solana", "avalanche". Leave empty for all networks.',
      ),
    limit: z.number().optional().default(10).describe("Number of pools to return (default: 10, max: 20)"),
  }),
  execute: async ({ network, limit = 10 }) => {
    try {
      console.log("Fetching trending pools:", { network, limit })

      let pools
      if (network) {
        pools = await fetchNetworkTrendingPools(network)
      } else {
        pools = await fetchAllNetworksTrendingPools()
      }

      if (!pools || pools.length === 0) {
        return {
          error: `Could not fetch trending pools${network ? ` for ${network}` : ""}. Please try again or check the network name.`,
        }
      }

      console.log("Fetched pools data:", pools)

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

      // Create a simple, clean response format
      const response = {
        success: true,
        message: `Here are the top ${limitedPools.length} trending pools${network ? ` on ${network.toUpperCase()}` : " across all networks"}:`,
        pools_data: formattedPools,
      }

      console.log("Tool response:", response)

      // Return the response as a JSON string to ensure it's properly formatted
      return JSON.stringify(response)
    } catch (error) {
      console.error("Tool execution error:", error)
      return JSON.stringify({
        error: `An error occurred while fetching trending pools: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  },
})
