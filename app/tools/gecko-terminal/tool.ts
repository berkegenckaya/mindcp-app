import { tool } from "ai"
import { z } from "zod"
import { fetchTokenData, searchToken } from "./api"

export const getTokenInfoTool = tool({
  description:
    "Get comprehensive information about a cryptocurrency token including price, market cap, volume, and more",
  parameters: z.object({
    tokenQuery: z
      .string()
      .describe(
        'The token name, symbol, or network/token format. Examples: "ethereum", "btc", "eth/usdc", "solana", "polygon"',
      ),
  }),
  execute: async ({ tokenQuery }) => {
    try {
      console.log("Searching for token:", tokenQuery)

      const tokenInfo = await searchToken(tokenQuery)

      if (!tokenInfo) {
        return JSON.stringify({
          error: `Could not find token information for "${tokenQuery}". Please try a different token or use the format "network/token". Supported tokens include: ETH, BTC, SOL, BNB, MATIC, AVAX, or specify like "eth/usdc".`,
        })
      }

      console.log("Found token info:", tokenInfo)

      const { network, token } = tokenInfo
      const data = await fetchTokenData(network, token)

      if (!data) {
        return JSON.stringify({
          error: `Could not fetch data for ${token} on ${network}. The token may not exist or there might be an API issue. Please try again or check the token symbol.`,
        })
      }

      console.log("Fetched token data:", data)

      // Format the data for better readability
      const formatNumber = (num: number, decimals = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
        if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
        return `$${num.toFixed(decimals)}`
      }

      const formatSupply = (num: number) => {
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
        return num.toFixed(0)
      }

      const tokenResult = {
        success: true,
        message: `Here's the current information for ${data.name} (${data.symbol.toUpperCase()}):`,
        token_data: {
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          price: data.price >= 1 ? `$${data.price.toFixed(2)}` : `$${data.price.toFixed(6)}`,
          price_change_24h: `${data.price_change_24h > 0 ? "+" : ""}${data.price_change_24h.toFixed(2)}%`,
          price_trend: data.price_change_24h > 0 ? "up" : data.price_change_24h < 0 ? "down" : "stable",
          market_cap: formatNumber(data.market_cap),
          volume_24h: formatNumber(data.total_volume),
          circulating_supply: formatSupply(data.circulating_supply),
          total_supply: formatSupply(data.total_supply),
          max_supply: data.max_supply ? formatSupply(data.max_supply) : "Unlimited",
          contract_address: data.contract_address || "Native token",
          blockchain: data.blockchain ? data.blockchain.toUpperCase() : "UNKNOWN",
        },
      }

      console.log("Token tool response:", tokenResult)

      // Return as JSON string to ensure proper formatting
      return JSON.stringify(tokenResult)
    } catch (error) {
      console.error("Tool execution error:", error)
      return JSON.stringify({
        error: `An error occurred while fetching token information: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  },
})
