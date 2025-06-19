import { smoothStream, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getNetworkTrendingPoolsTool, getTokenInfoTool, getTrendingPoolsTool } from "@/app/tools/gecko-terminal"
import { getDexPairInfoTool, searchDexPairsTool } from "@/app/tools/dexscreener"


export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("Received messages:", messages)

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format")
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are a helpful AI assistant with access to comprehensive cryptocurrency and DEX information.

You have access to these tools:

TOKEN INFORMATION:
1. get_coingecko_token_info - Get detailed information about ANY cryptocurrency token (preferred for token queries)
2. get_token_info - Get token info from Gecko Terminal (limited coverage, use as fallback)

DEX POOLS & PAIRS:
3. get_trending_pools - Get trending trading pools across all networks (Gecko Terminal)
4. get_network_trending_pools - Get trending trading pools for a specific network (Gecko Terminal)
5. search_dex_pairs - Search for DEX pairs across multiple chains (DexScreener)
6. get_dex_pair_info - Get specific DEX pair information by chain and address (DexScreener)

TOOL PRIORITY & USAGE:
- For TOKEN INFORMATION queries → ALWAYS use get_coingecko_token_info FIRST (broadest coverage)
- For TRENDING POOLS queries → use get_trending_pools or get_network_trending_pools
- For DEX PAIR SEARCH queries → use search_dex_pairs (great for finding specific pairs)
- For SPECIFIC PAIR INFO → use get_dex_pair_info (when you have chain + address)

When users ask about:
- Specific tokens (BTC, ETH, DOGE, etc.) → use get_coingecko_token_info
- "trending pools" or "hot pools" → use get_trending_pools  
- Network-specific pools (e.g., "Ethereum pools") → use get_network_trending_pools
- "search for PEPE pairs" or "find SHIB pairs" → use search_dex_pairs
- Specific pair with address → use get_dex_pair_info

SUPPORTED NETWORKS:
DexScreener supports 40+ chains including:
- ethereum, bsc, polygon, avalanche, arbitrum, optimism, base, solana
- fantom, cronos, sui, aptos, near, aurora, harmony, moonbeam
- And many more!

Gecko Terminal supports:
- eth, bsc, polygon_pos, solana, avalanche, arbitrum, optimism, base, fantom, cronos

RESPONSE GUIDELINES:
- Present information clearly and conversationally
- Include raw tool responses for UI component rendering
- Provide insights about price movements, volume, liquidity
- Suggest alternatives if searches fail
- Be helpful and ask clarifying questions when needed

IMPORTANT: Always return valid JSON from tools. If there's an error, return a proper error object with an "error" field.`,
      messages: messages,
      tools: {

        get_token_info: getTokenInfoTool,
        get_trending_pools: getTrendingPoolsTool,
        get_network_trending_pools: getNetworkTrendingPoolsTool,
        search_dex_pairs: searchDexPairsTool,
        get_dex_pair_info: getDexPairInfoTool,
      },
      onFinish: (result) => {
        console.log("Stream finished successfully:", {
          finishReason: result.finishReason,
          usage: result.usage,
        })
      },
      onError: (error) => {
        console.error("Stream error:", error)
      },
      experimental_transform: smoothStream({
      chunking: "word", // streams line by line
      delayInMs: 15, // optional: defaults to 10ms
    }),
    onStepFinish: () => {},
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Route Error:", error)
    
    // Return a proper error response
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
