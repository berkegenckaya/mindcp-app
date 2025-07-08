import { tool } from "ai"
import { z } from "zod"
import { fetchWalletFeed, analyzeWalletTransactions, validateWalletAddress } from "./api"

export const getWalletAnalysisTool = tool({
  description: "Analyze a cryptocurrency wallet's transaction history and provide comprehensive insights",
  parameters: z.object({
    walletAddress: z.string().describe("The wallet address to analyze (Ethereum, Solana, or other EVM chains)"),
    limit: z
      .number()
      .optional()
      .default(100)
      .describe("Number of recent transactions to analyze (default: 100, max: 500)"),
    chains: z
      .array(z.string())
      .optional()
      .describe('Specific chains to analyze. Examples: ["ethereum", "polygon", "bsc", "solana"]'),
    minUsdValue: z.number().optional().describe("Minimum USD value of transactions to include in analysis"),
    maxUsdValue: z.number().optional().describe("Maximum USD value of transactions to include in analysis"),
  }),
  execute: async ({ walletAddress, limit = 100, chains, minUsdValue, maxUsdValue }) => {
    try {
      console.log("Wallet analysis tool:", { walletAddress, limit, chains, minUsdValue, maxUsdValue })

      // Validate wallet address
      if (!validateWalletAddress(walletAddress)) {
        return JSON.stringify({
          error: `Invalid wallet address format: "${walletAddress}". Please provide a valid Ethereum (0x...) or Solana address.`,
        })
      }

      // Limit the number of transactions to prevent excessive API usage
      const safeLimit = Math.min(limit, 500)

      const feedData = await fetchWalletFeed({
        wallet_address: walletAddress,
        limit: safeLimit,
        chains,
        min_usd_value: minUsdValue,
        max_usd_value: maxUsdValue,
      })

      if (!feedData || !feedData.data || !feedData.data.items) {
        return JSON.stringify({
          error: `Could not fetch transaction data for wallet ${walletAddress}. This might be due to API limitations or the wallet having no recent transactions.`,
          suggestion: "Please try again later or check if the wallet address is correct.",
        })
      }

      if (!feedData.data.items || feedData.data.items.length === 0) {
        return JSON.stringify({
          error: `No transactions found for wallet ${walletAddress}. The wallet might be inactive, new, or have no transactions matching the specified criteria.`,
          suggestion: "Try analyzing a wallet with recent activity, or check if this is the correct wallet address.",
          wallet_info: {
            address: walletAddress,
            status: "No recent transactions found"
          }
        })
      }

      console.log("Fetched transactions:", feedData.data.items.length)

      // Analyze the transactions
      const analysis = analyzeWalletTransactions(feedData.data.items, walletAddress)

      // Format numbers for better readability
      const formatNumber = (num: number, decimals = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
        if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
        return `$${num.toFixed(decimals)}`
      }

      const response = {
        success: true,
        message: `Here's a comprehensive analysis of wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} based on ${analysis.total_transactions} recent transactions:`,
        source: "Cielo Finance",
        wallet_data: {
          address: walletAddress,
          summary: {
            total_transactions: analysis.total_transactions,
            total_volume: formatNumber(analysis.total_volume_usd),
            gas_spent: formatNumber(analysis.gas_spent_usd),
            chains_active: analysis.chains_active.length,
            most_active_chain: analysis.most_active_chain,
          },
          activity: {
            last_24h: analysis.activity_summary.last_24h,
            last_7d: analysis.activity_summary.last_7d,
            last_30d: analysis.activity_summary.last_30d,
          },
          transaction_types: analysis.transaction_types,
          top_tokens: analysis.top_tokens.map((token) => ({
            ...token,
            total_value_formatted: formatNumber(token.total_value_usd),
          })),
          recent_activity: analysis.recent_activity.slice(0, 5).map((activity) => ({
            ...activity,
            value_formatted: formatNumber(activity.value_usd),
            timestamp_formatted: new Date(activity.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          })),
          chains: analysis.chains_active,
          credits_used: feedData.data.paging.total_rows_in_page,
        },
      }

      console.log("Wallet analysis tool response: success")
      return JSON.stringify(response)
    } catch (error) {
      console.error("Wallet analysis tool error:", error)
      return JSON.stringify({
        error: `An error occurred while analyzing the wallet: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      })
    }
  },
})
