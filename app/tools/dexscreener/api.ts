import type {
  DexScreenerResponse,
  DexScreenerSearchResponse,
  DexScreenerTokenResponse,
  DexScreenerPair,
  FormattedDexPair,
} from "./types"

const DEXSCREENER_BASE_URL = "https://api.dexscreener.com/latest"

export async function fetchDexScreenerPair(chainId: string, pairId: string): Promise<FormattedDexPair | null> {
  try {
    console.log(`Fetching DexScreener pair: ${chainId}/${pairId}`)

    const url = `${DEXSCREENER_BASE_URL}/dex/pairs/${chainId}/${pairId}`
    console.log("DexScreener API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; DexBot/1.0)",
      },
    })

    console.log("DexScreener API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DexScreener API Error:", errorText)
      throw new Error(`Failed to fetch pair data: ${response.status} - ${errorText}`)
    }

    const data: DexScreenerResponse = await response.json()
    console.log("DexScreener raw response:", JSON.stringify(data, null, 2))

    if (!data.pairs || data.pairs.length === 0) {
      console.error("No pairs found in response")
      return null
    }

    const pair = data.pairs[0] // Get the first pair
    return formatDexPair(pair)
  } catch (error) {
    console.error("Error in fetchDexScreenerPair:", error)
    return null
  }
}

export async function searchDexScreenerPairs(query: string): Promise<FormattedDexPair[] | null> {
  try {
    console.log(`Searching DexScreener for: ${query}`)

    const url = `${DEXSCREENER_BASE_URL}/dex/search/?q=${encodeURIComponent(query)}`
    console.log("DexScreener Search URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; DexBot/1.0)",
      },
    })

    console.log("DexScreener Search Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DexScreener Search API Error:", errorText)
      throw new Error(`Failed to search pairs: ${response.status} - ${errorText}`)
    }

    const data: DexScreenerSearchResponse = await response.json()
    console.log("DexScreener search results:", data.pairs?.length || 0, "pairs found")

    if (!data.pairs || data.pairs.length === 0) {
      return null
    }

    // Format and return top 10 results
    return data.pairs
      .slice(0, 10)
      .map(formatDexPair)
      .filter((pair): pair is FormattedDexPair => pair !== null)
  } catch (error) {
    console.error("Error in searchDexScreenerPairs:", error)
    return null
  }
}

// UPDATED FUNCTION: Fetch pairs by token addresses with proper schema handling
export async function fetchDexScreenerTokenPairs(
  chainId: string,
  tokenAddresses: string[],
): Promise<FormattedDexPair[] | null> {
  try {
    console.log(`Fetching DexScreener token pairs for: ${chainId} - ${tokenAddresses.join(", ")}`)

    // Validate input
    if (!tokenAddresses || tokenAddresses.length === 0) {
      throw new Error("Token addresses array cannot be empty")
    }

    if (tokenAddresses.length > 30) {
      throw new Error("Maximum 30 token addresses allowed per request")
    }

    // Join addresses with comma
    const addressesParam = tokenAddresses.join(",")
    const url = `https://api.dexscreener.com/tokens/v1/${chainId}/${addressesParam}`
    console.log("DexScreener Token API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; DexBot/1.0)",
        // Add additional headers to avoid Cloudflare blocking
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    console.log("DexScreener Token API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DexScreener Token API Error:", errorText)
      throw new Error(`Failed to fetch token pairs: ${response.status} - ${errorText}`)
    }

    // Token pairs endpoint returns direct array, not wrapped in object
    const data: DexScreenerTokenResponse = await response.json()
    console.log("DexScreener token pairs raw response:", data)
/*     console.log("DexScreener token pairs results:", data?.length || 0, "pairs found")
 */
    // Check if data is array and has content
    if (!Array.isArray(data) || data.length === 0) {
      console.log("No pairs found in token response")
      return null
    }

    // Format and return results
    return data.map(formatDexPair).filter((pair): pair is FormattedDexPair => pair !== null)
  } catch (error) {
    console.error("Error in fetchDexScreenerTokenPairs:", error)
    return null
  }
}

// NEW FUNCTION: Fetch pairs by token addresses across multiple chains
export async function fetchMultiChainTokenPairs(
  tokenAddress: string,
  chains: string[],
  limit: number,
): Promise<Record<string, any>> {
  const results: Record<string, any> = {}

  for (const chain of chains) {
    try {
      const pairs = await fetchDexScreenerTokenPairs(chain, [tokenAddress])
      const limitedPairs = pairs?.slice(0, limit) || []

      results[chain] = {
        pairs_count: limitedPairs.length,
        pairs: limitedPairs,
      }
    } catch (error) {
      console.error(`Error fetching pairs from ${chain}:`, error)
      results[chain] = {
        pairs_count: 0,
        pairs: [],
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return results
}

// NEW FUNCTION: Search for pools by token ticker across all chains
export async function searchPoolsByTicker(ticker: string, limit: number = 5): Promise<Record<string, any>> {
  try {
    console.log(`Searching pools for ticker: ${ticker}`)
    
    // Use DexScreener search API to find pairs for the ticker
    const pairs = await searchDexScreenerPairs(ticker)
    
    if (!pairs || pairs.length === 0) {
      return {
        error: `No pools found for ticker "${ticker}". Please check the ticker symbol and try again.`,
        ticker: ticker.toUpperCase(),
        total_pools: 0,
        chains: []
      }
    }

    // Group pairs by chain and get top pools for each chain
    const poolsByChain: Record<string, any[]> = {}
    
    pairs.forEach(pair => {
      const chain = pair.chainId
      if (!poolsByChain[chain]) {
        poolsByChain[chain] = []
      }
      poolsByChain[chain].push(pair)
    })

    // Sort pools by liquidity within each chain and limit results
    const formattedResult: Record<string, any> = {}
    const allChains: string[] = []
    let totalPools = 0

    Object.keys(poolsByChain).forEach(chain => {
      // Sort by liquidity (parse the formatted string back to number for sorting)
      const sortedPools = poolsByChain[chain]
        .sort((a, b) => {
          const aLiquidity = parseFormattedNumber(a.liquidity)
          const bLiquidity = parseFormattedNumber(b.liquidity)
          return bLiquidity - aLiquidity
        })
        .slice(0, limit)

      if (sortedPools.length > 0) {
        formattedResult[chain] = {
          chain_name: getChainDisplayName(chain),
          pools_count: sortedPools.length,
          pools: sortedPools.map(pool => ({
            name: pool.name,
            dex: pool.dexId,
            price: pool.price,
            price_change_24h: pool.price_change_24h,
            price_trend: pool.price_trend,
            volume_24h: pool.volume_24h,
            liquidity: pool.liquidity,
            pair_address: pool.pairAddress,
            base_token: pool.baseToken,
            quote_token: pool.quoteToken,
            url: pool.url,
            image_url: pool.image_url // Add image_url field
          }))
        }
        allChains.push(chain)
        totalPools += sortedPools.length
      }
    })

    return {
      success: true,
      message: `Found ${totalPools} pools for ${ticker.toUpperCase()} across ${allChains.length} chains:`,
      ticker: ticker.toUpperCase(),
      total_pools: totalPools,
      chains: allChains,
      pools_by_chain: formattedResult
    }

  } catch (error) {
    console.error("Error searching pools by ticker:", error)
    return {
      error: `An error occurred while searching for pools: ${error instanceof Error ? error.message : "Unknown error"}`,
      ticker: ticker.toUpperCase(),
      total_pools: 0,
      chains: []
    }
  }
}

// UPDATED FORMAT FUNCTION: Handle dynamic properties properly
function formatDexPair(pair: DexScreenerPair): FormattedDexPair | null {
  try {
    // Format numbers
    const formatNumber = (num: number, decimals = 2) => {
      if (!num || isNaN(num)) return "N/A"
      if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
      if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
      if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
      return `$${num.toFixed(decimals)}`
    }

    const formatSupply = (num: number, decimals = 2) => {
      if (!num || isNaN(num)) return "N/A"
      if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`
      if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`
      if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`
      return num.toFixed(0)
    }

    // Safely extract values from dynamic objects
    const getValueFromDynamicObject = (obj: Record<string, any>, key: string, defaultValue: any = 0) => {
      return obj && obj[key] !== undefined ? obj[key] : defaultValue
    }

    // Extract price changes
    const priceChange24h = getValueFromDynamicObject(pair.priceChange, "h24", 0)
    const priceChange6h = getValueFromDynamicObject(pair.priceChange, "h6", 0)
    const priceChange1h = getValueFromDynamicObject(pair.priceChange, "h1", 0)
    const priceChange5m = getValueFromDynamicObject(pair.priceChange, "m5", 0)

    // Extract volumes
    const volume24h = getValueFromDynamicObject(pair.volume, "h24", 0)
    const volume6h = getValueFromDynamicObject(pair.volume, "h6", 0)
    const volume1h = getValueFromDynamicObject(pair.volume, "h1", 0)
    const volume5m = getValueFromDynamicObject(pair.volume, "m5", 0)

    // Extract transactions
    const txns24h = getValueFromDynamicObject(pair.txns, "h24", { buys: 0, sells: 0 })
    const txns6h = getValueFromDynamicObject(pair.txns, "h6", { buys: 0, sells: 0 })
    const txns1h = getValueFromDynamicObject(pair.txns, "h1", { buys: 0, sells: 0 })
    const txns5m = getValueFromDynamicObject(pair.txns, "m5", { buys: 0, sells: 0 })

    const price = Number(pair.priceUsd) || Number(pair.priceNative) || 0
    const liquidity = pair.liquidity?.usd || 0
    const liquidityBase = pair.liquidity?.base || 0
    const liquidityQuote = pair.liquidity?.quote || 0
    const marketCap = pair.marketCap || 0
    const fdv = pair.fdv || 0

    // Format creation date
    const pairCreatedAt = pair.pairCreatedAt
      ? new Date(pair.pairCreatedAt * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined

    return {
      id: `${pair.chainId}-${pair.pairAddress}`,
      name: `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
      chainId: pair.chainId,
      dexId: pair.dexId,
      pairAddress: pair.pairAddress,
      labels: pair.labels,
      baseToken: {
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        address: pair.baseToken.address,
      },
      quoteToken: {
        name: pair.quoteToken.name,
        symbol: pair.quoteToken.symbol,
        address: pair.quoteToken.address,
      },
      price: price >= 1 ? `$${price.toFixed(4)}` : `$${price.toFixed(8)}`,
      priceNative: pair.priceNative,
      price_change_24h: `${priceChange24h > 0 ? "+" : ""}${priceChange24h.toFixed(2)}%`,
      price_trend: priceChange24h > 0 ? "up" : priceChange24h < 0 ? "down" : "stable",
      volume_24h: formatNumber(volume24h),
      volume_6h: formatNumber(volume6h),
      volume_1h: formatNumber(volume1h),
      volume_5m: formatNumber(volume5m),
      liquidity: formatNumber(liquidity),
      liquidityBase: formatSupply(liquidityBase),
      liquidityQuote: formatSupply(liquidityQuote, 4),
      market_cap: formatNumber(marketCap),
      fdv: formatNumber(fdv),
      transactions: {
        h24: {
          buys: txns24h.buys || 0,
          sells: txns24h.sells || 0,
          total: (txns24h.buys || 0) + (txns24h.sells || 0),
        },
        h6: {
          buys: txns6h.buys || 0,
          sells: txns6h.sells || 0,
          total: (txns6h.buys || 0) + (txns6h.sells || 0),
        },
        h1: {
          buys: txns1h.buys || 0,
          sells: txns1h.sells || 0,
          total: (txns1h.buys || 0) + (txns1h.sells || 0),
        },
        m5: {
          buys: txns5m.buys || 0,
          sells: txns5m.sells || 0,
          total: (txns5m.buys || 0) + (txns5m.sells || 0),
        },
      },
      priceChanges: {
        m5: priceChange5m,
        h1: priceChange1h,
        h6: priceChange6h,
        h24: priceChange24h,
      },
      pairCreatedAt,
      url: pair.url,
      image_url: pair.info?.imageUrl,
      websites: pair.info?.websites,
      socials: pair.info?.socials,
      boosts: pair.boosts?.active,
    }
  } catch (error) {
    console.error("Error formatting DexScreener pair:", error)
    return null
  }
}

// Helper function to get supported chain IDs
export function getSupportedChains(): Array<{ id: string; name: string }> {
  return [
    { id: "ethereum", name: "Ethereum" },
    { id: "bsc", name: "BSC" },
    { id: "polygon", name: "Polygon" },
    { id: "avalanche", name: "Avalanche" },
    { id: "fantom", name: "Fantom" },
    { id: "cronos", name: "Cronos" },
    { id: "arbitrum", name: "Arbitrum" },
    { id: "optimism", name: "Optimism" },
    { id: "base", name: "Base" },
    { id: "solana", name: "Solana" },
  ]
}

// Helper function to normalize chain names
export function normalizeChainName(chain: string): string | null {
  const chainMap: Record<string, string> = {
    eth: "ethereum",
    ethereum: "ethereum",
    mainnet: "ethereum",
    bsc: "bsc",
    binance: "bsc",
    "binance-smart-chain": "bsc",
    bnb: "bsc",
    polygon: "polygon",
    matic: "polygon",
    avalanche: "avalanche",
    avax: "avalanche",
    fantom: "fantom",
    ftm: "fantom",
    cronos: "cronos",
    cro: "cronos",
    arbitrum: "arbitrum",
    arb: "arbitrum",
    optimism: "optimism",
    op: "optimism",
    base: "base",
    solana: "solana",
    sol: "solana",
  }

  const normalized = chain.toLowerCase().trim()
  const supportedChains = getSupportedChains().map((c) => c.id)
  return chainMap[normalized] || (supportedChains.includes(normalized) ? normalized : null)
}

// Helper function to validate token addresses
export function validateTokenAddress(address: string, chainId: string): boolean {
  if (!address || address.trim().length === 0) {
    return false
  }

  const trimmedAddress = address.trim()

  // Solana addresses are base58 encoded and typically 32-44 characters
  if (chainId === "solana") {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmedAddress)
  }

  // EVM chains use hex addresses starting with 0x
  return /^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)
}

// Rate Limiter
export const rateLimiter = {
  requests: [] as number[],
  window: 60000, // 1 minute
  maxRequests: 5,

  canMakeRequest() {
    this.clearOldRequests()
    return this.requests.length < this.maxRequests
  },

  recordRequest() {
    this.clearOldRequests()
    this.requests.push(Date.now())
  },

  clearOldRequests() {
    const now = Date.now()
    this.requests = this.requests.filter((reqTime) => now - reqTime < this.window)
  },
}

// Helper function to parse formatted numbers back to actual numbers for sorting
function parseFormattedNumber(formattedStr: string): number {
  if (!formattedStr || formattedStr === "N/A") return 0
  
  const cleanStr = formattedStr.replace(/[$,]/g, '')
  const multiplier = cleanStr.includes('B') ? 1e9 : 
                    cleanStr.includes('M') ? 1e6 : 
                    cleanStr.includes('K') ? 1e3 : 1
  
  const numStr = cleanStr.replace(/[BMK]/g, '')
  return parseFloat(numStr) * multiplier || 0
}

// Helper function to get chain display names
function getChainDisplayName(chainId: string): string {
  const chainNames: Record<string, string> = {
    ethereum: "Ethereum",
    bsc: "BSC",
    polygon: "Polygon",
    avalanche: "Avalanche",
    fantom: "Fantom",
    cronos: "Cronos",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
    base: "Base",
    solana: "Solana",
  }
  return chainNames[chainId] || chainId.toUpperCase()
}
