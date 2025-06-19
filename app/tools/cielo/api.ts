import type { CieloFeedResponse, CieloFeedParams, FormattedWalletSummary, CieloTransaction } from "./types"

const CIELO_BASE_URL = "https://feed-api.cielo.finance/api/v1"

export async function fetchWalletFeed(params: CieloFeedParams): Promise<CieloFeedResponse | null> {
  try {
    console.log("Fetching wallet feed from Cielo:", params)

    // Development mode'da mock data kullan
   /*  if (process.env.NODE_ENV === "development" && process.env.USE_MOCK_DATA === "true") {
      console.log("Using mock data for development")
      return mockWalletData
    } */

    // Build query parameters
    const queryParams = new URLSearchParams()

    if (params.wallet_address) queryParams.append("wallet", params.wallet_address)
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.chains) queryParams.append("chains", params.chains.join(","))
    if (params.transaction_types) queryParams.append("transaction_types", params.transaction_types.join(","))
    if (params.tokens) queryParams.append("tokens", params.tokens.join(","))
    if (params.min_usd_value) queryParams.append("min_usd_value", params.min_usd_value.toString())
    if (params.max_usd_value) queryParams.append("max_usd_value", params.max_usd_value.toString())
    if (params.starting_point) queryParams.append("starting_point", params.starting_point)
    if (params.new_trades !== undefined) queryParams.append("new_trades", params.new_trades.toString())

    const url = `${CIELO_BASE_URL}/feed?${queryParams.toString()}&chains=ethereum`
    console.log("Cielo API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.CIELO_API_KEY || "a7725cd3-5aa5-45f9-886a-0cf51bd39aa1",
        "User-Agent": "Mozilla/5.0 (compatible; WalletBot/1.0)",
      },
    })

    console.log("Cielo API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cielo API Error:", errorText)

      // API hatası durumunda mock data döndür
      /* if (process.env.NODE_ENV === "development") {
        console.log("API failed, falling back to mock data")
        return mockWalletData
      } */

      throw new Error(`Failed to fetch wallet feed: ${response.status} - ${errorText}`)
    }

    const data: CieloFeedResponse = await response.json()
    console.log("Cielo raw response:", JSON.stringify(data, null, 2))

    return data
  } catch (error) {
    console.error("Error in fetchWalletFeed:", error)

    // Development mode'da hata durumunda mock data döndür
    /* if (process.env.NODE_ENV === "development") {
      console.log("Error occurred, falling back to mock data")
      return mockWalletData
    } */

    return null
  }
}

export function analyzeWalletTransactions(
  transactions: CieloTransaction[],
  walletAddress: string,
): FormattedWalletSummary {
  console.log("Analyzing wallet transactions:", transactions.length)

  // Calculate time periods
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Initialize counters
  const chainCounts: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}
  const tokenCounts: Record<string, { count: number; total_value: number; name: string }> = {}

  let totalVolumeUsd = 0
  let totalGasUsd = 0
  let activity24h = 0
  let activity7d = 0
  let activity30d = 0

  const recentActivity: Array<{
    hash: string
    timestamp: string
    type: string
    value_usd: number
    chain: string
    description: string
  }> = []

  // Process each transaction
  transactions.forEach((tx) => {
    // Convert timestamp to Date (Cielo returns Unix timestamp)
    const txDate = new Date(tx.timestamp * 1000)

    // Count by chain
    chainCounts[tx.chain] = (chainCounts[tx.chain] || 0) + 1

    // Count by type
    typeCounts[tx.tx_type] = (typeCounts[tx.tx_type] || 0) + 1

    // Calculate transaction value
    let txValueUsd = 0
    if (tx.tx_type === "swap") {
      txValueUsd = tx.token0_amount_usd || tx.token1_amount_usd || 0
    } else if (tx.tx_type === "transfer") {
      txValueUsd = tx.amount_usd || 0
    } else if (tx.tx_type === "bridge") {
      txValueUsd = tx.amount_usd || 0
    }

    totalVolumeUsd += txValueUsd

    // Estimate gas costs (simplified)
    if (tx.chain === "ethereum") {
      totalGasUsd += 15 // Rough estimate for ETH gas
    } else if (tx.chain === "base") {
      totalGasUsd += 0.5 // Lower gas on L2
    } else {
      totalGasUsd += 1 // Other chains
    }

    // Count activity by time period
    if (txDate >= last24h) activity24h++
    if (txDate >= last7d) activity7d++
    if (txDate >= last30d) activity30d++

    // Process tokens
    if (tx.tx_type === "swap") {
      // Process both tokens in swap
      if (tx.token0_symbol) {
        const symbol = tx.token0_symbol
        if (!tokenCounts[symbol]) {
          tokenCounts[symbol] = { count: 0, total_value: 0, name: tx.token0_name || symbol }
        }
        tokenCounts[symbol].count++
        tokenCounts[symbol].total_value += tx.token0_amount_usd || 0
      }
      if (tx.token1_symbol) {
        const symbol = tx.token1_symbol
        if (!tokenCounts[symbol]) {
          tokenCounts[symbol] = { count: 0, total_value: 0, name: tx.token1_name || symbol }
        }
        tokenCounts[symbol].count++
        tokenCounts[symbol].total_value += tx.token1_amount_usd || 0
      }
    } else if (tx.tx_type === "transfer" && tx.symbol) {
      const symbol = tx.symbol
      if (!tokenCounts[symbol]) {
        tokenCounts[symbol] = { count: 0, total_value: 0, name: tx.name || symbol }
      }
      tokenCounts[symbol].count++
      tokenCounts[symbol].total_value += tx.amount_usd || 0
    }

    // Add to recent activity (first 10)
    if (recentActivity.length < 10) {
      recentActivity.push({
        hash: tx.tx_hash,
        timestamp: txDate.toISOString(),
        type: tx.tx_type,
        value_usd: txValueUsd,
        chain: tx.chain,
        description: generateTransactionDescription(tx),
      })
    }
  })

  // Get most active chain
  const mostActiveChain =
    Object.entries(chainCounts).reduce((a, b) => (chainCounts[a[0]] > chainCounts[b[0]] ? a : b))?.[0] || "Unknown"

  // Get top tokens
  const topTokens = Object.entries(tokenCounts)
    .map(([symbol, data]) => ({
      symbol,
      name: data.name,
      count: data.count,
      total_value_usd: data.total_value,
    }))
    .sort((a, b) => b.total_value_usd - a.total_value_usd)
    .slice(0, 5)

  return {
    wallet_address: walletAddress,
    total_transactions: transactions.length,
    chains_active: Object.keys(chainCounts),
    total_volume_usd: totalVolumeUsd,
    transaction_types: typeCounts,
    top_tokens: topTokens,
    recent_activity: recentActivity,
    activity_summary: {
      last_24h: activity24h,
      last_7d: activity7d,
      last_30d: activity30d,
    },
    gas_spent_usd: totalGasUsd,
    most_active_chain: mostActiveChain,
  }
}

function generateTransactionDescription(tx: CieloTransaction): string {
  const type = tx.tx_type.toLowerCase()

  switch (type) {
    case "swap":
      const fromToken = tx.token0_symbol || "Unknown"
      const toToken = tx.token1_symbol || "Unknown"
      const value = tx.token0_amount_usd || tx.token1_amount_usd || 0
      return `Swapped ${fromToken} → ${toToken} ($${value.toFixed(2)})`

    case "transfer":
      const symbol = tx.symbol || "Unknown"
      const amount = tx.amount_usd || 0
      return `Transferred ${symbol} ($${amount.toFixed(2)})`

    case "bridge":
      const bridgeValue = tx.amount_usd || 0
      const fromChain = tx.from_chain || tx.chain
      const toChain = tx.to_chain || "Unknown"
      return `Bridged from ${fromChain} to ${toChain} ($${bridgeValue.toFixed(2)})`

    case "nft_transfer":
      const nftName = tx.nft_name || "NFT"
      return `Transferred ${nftName}`

    default:
      const defaultValue = tx.amount_usd || tx.token0_amount_usd || 0
      return `${type} transaction ($${defaultValue.toFixed(2)})`
  }
}

export function validateWalletAddress(address: string): boolean {
  // Basic validation for Ethereum-style addresses
  const ethRegex = /^0x[a-fA-F0-9]{40}$/

  // Basic validation for Solana addresses
  const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

  return ethRegex.test(address) || solRegex.test(address)
}

export function formatWalletAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
