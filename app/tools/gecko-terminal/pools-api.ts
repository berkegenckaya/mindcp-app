// Gecko Terminal Pools API functions

export interface PoolData {
  id: string
  name: string
  address: string
  network: string
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
  price_usd: number
  price_change_24h: number
  volume_24h: number
  liquidity_usd: number
  fdv_usd: number
  market_cap_usd: number
  reserve_in_usd: number
}

export interface TrendingPoolsResponse {
  data: Array<{
    id: string
    type: string
    attributes: {
      name: string
      address: string
      base_token_price_usd: string
      base_token_price_native_currency: string
      quote_token_price_usd: string
      quote_token_price_native_currency: string
      base_token_price_quote_token: string
      quote_token_price_base_token: string
      pool_created_at: string
      reserve_in_usd: string
      fdv_usd: string
      market_cap_usd: string
      price_change_percentage: {
        h1: string
        h6: string
        h24: string
      }
      transactions: {
        h1: {
          buys: number
          sells: number
        }
        h6: {
          buys: number
          sells: number
        }
        h24: {
          buys: number
          sells: number
        }
      }
      volume_usd: {
        h1: string
        h6: string
        h24: string
      }
    }
    relationships: {
      base_token: {
        data: {
          id: string
          type: string
        }
      }
      quote_token: {
        data: {
          id: string
          type: string
        }
      }
      network?: {
        data?: {
          id: string
          type: string
        }
      }
    }
  }>
  included?: Array<{
    id: string
    type: string
    attributes: {
      name: string
      symbol?: string
      address?: string
      decimals?: number
      total_supply?: string
      coingecko_coin_id?: string | null
      price_usd?: string
      fdv_usd?: string
      total_reserve_in_usd?: string
      volume_usd?: {
        h24: string
      }
      market_cap_usd?: string | null
    }
  }>
}

export async function fetchTrendingPools(
  network?: string,
  include?: string,
  page?: number,
): Promise<PoolData[] | null> {
  try {
    console.log(`Fetching trending pools${network ? ` for ${network}` : " across all networks"}`)

    // Build URL with parameters
    const baseUrl = network
      ? `https://api.geckoterminal.com/api/v2/networks/${network}/trending_pools`
      : `https://api.geckoterminal.com/api/v2/networks/trending_pools`

    const params = new URLSearchParams()
    if (include) params.append("include", include)
    if (page) params.append("page", page.toString())

    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
    console.log("API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; PoolsBot/1.0)",
      },
    })

    console.log("API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error response:", errorText)
      throw new Error(`Failed to fetch trending pools: ${response.status} - ${errorText}`)
    }

    const data: TrendingPoolsResponse = await response.json()
    console.log("Raw API response:", JSON.stringify(data, null, 2))

    // Check if we have the expected data structure
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data)
      throw new Error("Invalid API response structure")
    }

    // Create a map of included tokens and networks for easy lookup
    const tokensMap = new Map()
    const networksMap = new Map()

    if (data.included) {
      data.included.forEach((item) => {
        if (item.type === "token") {
          tokensMap.set(item.id, item.attributes)
        } else if (item.type === "network") {
          networksMap.set(item.id, item.attributes)
        }
      })
    }

    // Transform the data with safe property access
    const pools: PoolData[] = data.data
      .map((pool) => {
        try {
          const attrs = pool.attributes

          // Safely extract relationship IDs with fallbacks
          const baseTokenId = pool.relationships?.base_token?.data?.id
          const quoteTokenId = pool.relationships?.quote_token?.data?.id
          const networkId = pool.relationships?.network?.data?.id

          if (!baseTokenId || !quoteTokenId) {
            console.warn("Missing required token relationships for pool:", pool.id)
            return null
          }

          const baseToken = tokensMap.get(baseTokenId) || {}
          const quoteToken = tokensMap.get(quoteTokenId) || {}
          const networkData = networkId ? networksMap.get(networkId) : null

          // Determine network name with fallbacks
          let networkName = network || "unknown"
          if (networkData?.name) {
            networkName = networkData.name
          } else if (networkId) {
            networkName = networkId
          }

          return {
            id: pool.id,
            name: attrs.name || `${baseToken.symbol || "Unknown"}/${quoteToken.symbol || "Unknown"}`,
            address: attrs.address || "",
            network: networkName,
            base_token: {
              name: baseToken.name || "Unknown",
              symbol: baseToken.symbol || "Unknown",
              address: baseToken.address || "",
            },
            quote_token: {
              name: quoteToken.name || "Unknown",
              symbol: quoteToken.symbol || "Unknown",
              address: quoteToken.address || "",
            },
            price_usd: Number(attrs.base_token_price_usd) || 0,
            price_change_24h: Number(attrs.price_change_percentage?.h24) || 0,
            volume_24h: Number(attrs.volume_usd?.h24) || 0,
            liquidity_usd: Number(attrs.reserve_in_usd) || 0,
            fdv_usd: Number(attrs.fdv_usd) || 0,
            market_cap_usd: Number(attrs.market_cap_usd) || 0,
            reserve_in_usd: Number(attrs.reserve_in_usd) || 0,
          }
        } catch (poolError) {
          console.error("Error processing pool:", pool.id, poolError)
          return null
        }
      })
      .filter((pool): pool is PoolData => pool !== null) // Remove null entries

    console.log(`Successfully processed ${pools.length} pools`)
    return pools
  } catch (error) {
    console.error("Error in fetchTrendingPools:", error)
    return null
  }
}

export async function fetchNetworkTrendingPools(network: string): Promise<PoolData[] | null> {
  return fetchTrendingPools(network, "base_token,quote_token,network")
}

export async function fetchAllNetworksTrendingPools(): Promise<PoolData[] | null> {
  return fetchTrendingPools(undefined, "base_token,quote_token,network")
}
