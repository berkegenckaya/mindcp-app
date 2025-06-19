import type { DexScreenerResponse, DexScreenerSearchResponse, DexScreenerPair, FormattedDexPair } from "./types"

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

    const priceChange24h = pair.priceChange?.h24 || 0
    const price = Number(pair.priceUsd) || Number(pair.priceNative) || 0
    const volume24h = pair.volume?.h24 || 0
    const volume6h = pair.volume?.h6 || 0
    const volume1h = pair.volume?.h1 || 0
    const volume5m = pair.volume?.m5 || 0
    const liquidity = pair.liquidity?.usd || 0
    const liquidityBase = pair.liquidity?.base || 0
    const liquidityQuote = pair.liquidity?.quote || 0
    const marketCap = pair.marketCap || 0
    const fdv = pair.fdv || 0

    // Format creation date
    const pairCreatedAt = pair.pairCreatedAt
      ? new Date(pair.pairCreatedAt).toLocaleDateString("en-US", {
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
          buys: pair.txns?.h24?.buys || 0,
          sells: pair.txns?.h24?.sells || 0,
          total: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
        },
        h6: {
          buys: pair.txns?.h6?.buys || 0,
          sells: pair.txns?.h6?.sells || 0,
          total: (pair.txns?.h6?.buys || 0) + (pair.txns?.h6?.sells || 0),
        },
        h1: {
          buys: pair.txns?.h1?.buys || 0,
          sells: pair.txns?.h1?.sells || 0,
          total: (pair.txns?.h1?.buys || 0) + (pair.txns?.h1?.sells || 0),
        },
        m5: {
          buys: pair.txns?.m5?.buys || 0,
          sells: pair.txns?.m5?.sells || 0,
          total: (pair.txns?.m5?.buys || 0) + (pair.txns?.m5?.sells || 0),
        },
      },
      priceChanges: {
        m5: pair.priceChange?.m5 || 0,
        h1: pair.priceChange?.h1 || 0,
        h6: pair.priceChange?.h6 || 0,
        h24: pair.priceChange?.h24 || 0,
      },
      pairCreatedAt,
      url: pair.url,
      image_url: pair.info?.imageUrl,
      header_url: pair.info?.header,
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
export function getSupportedChains(): string[] {
  return [
    "ethereum",
    "bsc",
    "polygon",
    "avalanche",
    "fantom",
    "cronos",
    "arbitrum",
    "optimism",
    "base",
    "solana",
    "sui",
    "aptos",
    "near",
    "aurora",
    "harmony",
    "moonbeam",
    "moonriver",
    "celo",
    "fuse",
    "okc",
    "heco",
    "kcc",
    "velas",
    "oasis",
    "metis",
    "syscoin",
    "milkomeda",
    "evmos",
    "dogechain",
    "kava",
    "step",
    "godwoken",
    "callisto",
    "wanchain",
    "elastos",
    "kardiachain",
    "telos",
    "thundercore",
    "tomochain",
    "smartbch",
    "rsk",
    "liquidchain",
    "hoo",
    "energi",
    "astar",
    "shiden",
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
  return chainMap[normalized] || (getSupportedChains().includes(normalized) ? normalized : null)
}
