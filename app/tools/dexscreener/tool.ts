import { tool } from "ai"
import { z } from "zod"
import { searchDexScreenerPairs, fetchDexScreenerPair, normalizeChainName } from "./api"

export const searchDexPairsTool = tool({
  description: "Search for DEX trading pairs across multiple chains using DexScreener",
  parameters: z.object({
    query: z
      .string()
      .describe(
        'Search query for DEX pairs. Can be token symbol, token name, or pair address. Examples: "PEPE", "Shiba Inu", "ETH USDC"',
      ),
    limit: z.number().optional().default(5).describe("Number of pairs to return (default: 5, max: 10)"),
  }),
  execute: async ({ query, limit = 5 }) => {
    try {
      console.log("DexScreener search tool:", { query, limit })

      // Validate inputs
      if (!query || query.trim().length === 0) {
        return JSON.stringify({
          error: "Search query cannot be empty. Please provide a token symbol or name.",
        })
      }

      const pairs = await searchDexScreenerPairs(query.trim())

      if (!pairs || pairs.length === 0) {
        return JSON.stringify({
          error: `No DEX pairs found for "${query}". Try searching with token symbols like "PEPE", "SHIB", or pair names like "ETH USDC".`,
        })
      }

      console.log("Found pairs:", pairs.length)

      // Limit results and ensure valid data
      const limitedPairs = pairs
        .slice(0, Math.min(limit, 10))
        .filter(pair => pair && pair.id && pair.name) // Filter out invalid pairs

      if (limitedPairs.length === 0) {
        return JSON.stringify({
          error: `Found pairs for "${query}" but they contain invalid data. Please try a different search term.`,
        })
      }

      const response = {
        success: true,
        message: `Found ${limitedPairs.length} DEX pairs for "${query}":`,
        source: "DexScreener",
        pairs_data: limitedPairs,
      }

      console.log("DexScreener search tool response: success with", limitedPairs.length, "pairs")
      return JSON.stringify(response)
    } catch (error) {
      console.error("DexScreener search tool error:", error)
      return JSON.stringify({
        error: `An error occurred while searching for DEX pairs: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      })
    }
  },
})

export const getDexPairInfoTool = tool({
  description: "Get detailed information about a specific DEX pair using chain and pair address",
  parameters: z.object({
    chainId: z
      .string()
      .describe(
        'Blockchain network. Examples: "ethereum", "bsc", "polygon", "solana", "avalanche", "arbitrum", "optimism", "base"',
      ),
    pairAddress: z.string().describe("The pair contract address on the specified chain"),
  }),
  execute: async ({ chainId, pairAddress }) => {
    try {
      console.log("DexScreener pair info tool:", { chainId, pairAddress })

      // Validate inputs
      if (!chainId || chainId.trim().length === 0) {
        return JSON.stringify({
          error: "Chain ID cannot be empty. Please provide a valid blockchain network.",
        })
      }

      if (!pairAddress || pairAddress.trim().length === 0) {
        return JSON.stringify({
          error: "Pair address cannot be empty. Please provide a valid pair contract address.",
        })
      }

      const normalizedChain = normalizeChainName(chainId.trim())
      if (!normalizedChain) {
        return JSON.stringify({
          error: `Unsupported chain "${chainId}". Supported chains include: ethereum, bsc, polygon, solana, avalanche, arbitrum, optimism, base, fantom, cronos.`,
        })
      }

      const pair = await fetchDexScreenerPair(normalizedChain, pairAddress.trim())

      if (!pair) {
        return JSON.stringify({
          error: `Could not find DEX pair with address "${pairAddress}" on ${normalizedChain}. Please check the address and chain.`,
        })
      }

      // Validate pair data
      if (!pair.id || !pair.name) {
        return JSON.stringify({
          error: `Found pair but data is incomplete. Please try again or check the pair address.`,
        })
      }

      console.log("Found pair:", pair.name)

      const response = {
        success: true,
        message: `Here's the detailed information for ${pair.name} on ${pair.chainId}:`,
        source: "DexScreener",
        pair_data: pair,
      }

      console.log("DexScreener pair info tool response: success")
      return JSON.stringify(response)
    } catch (error) {
      console.error("DexScreener pair info tool error:", error)
      return JSON.stringify({
        error: `An error occurred while fetching pair information: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      })
    }
  },
})
