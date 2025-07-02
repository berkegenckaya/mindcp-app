import type { TokenData, TokenSearchResult,TokenPool } from "./types"

export async function fetchTokenData(network: string, token: string): Promise<TokenData | null> {
  try {
    console.log(`Fetching token data for ${token} on ${network}`)

    const url = `https://api.geckoterminal.com/api/v2/networks/${network}/pools/${token}`
    console.log("API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; TokenInfoBot/1.0)",
      },
    })

    console.log("API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error response:", errorText)
      throw new Error(`Failed to fetch token data: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Raw API response:", JSON.stringify(data, null, 2))

    // Check if we have the expected data structure
    if (!data.data || !data.data.attributes) {
      console.error("Unexpected API response structure:", data)
      throw new Error("Invalid API response structure")
    }

    const tokenData = data.data.attributes

    return {
      id: data.data.id,
      name: tokenData.name || "Unknown",
      symbol: tokenData.symbol || "Unknown",
      price: Number(tokenData.price_usd) || 0,
      price_change_24h: Number(tokenData.price_change_percentage_24h) || 0,
      market_cap: Number(tokenData.market_cap_usd) || 0,
      total_volume: Number(tokenData.volume_usd_24h) || 0,
      circulating_supply: Number(tokenData.circulating_supply) || 0,
      total_supply: Number(tokenData.total_supply) || 0,
      max_supply: tokenData.max_supply ? Number(tokenData.max_supply) : null,
      description: tokenData.description,
      contract_address: tokenData.address,
      blockchain: network,
    }
  } catch (error) {
    console.error("Error in fetchTokenData:", error)
    return null
  }
}

export async function getTokenPools(
  network: string,
  tokenAddress: string
): Promise<TokenPool[]> {
  try {
    const url = `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${tokenAddress}/pools`
    console.log('[GET]', url)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TokenInfoBot/1.0)',
      },
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`GT API ${response.status}: ${err}`)
    }

    const json = await response.json()

    // Beklenen: { data: [ { id, type, attributes, relationships }, ... ] }
    if (!Array.isArray(json?.data)) {
      throw new Error('Unexpected API schema: "data" is not an array')
    }

    const pools: TokenPool[] = json.data.map((pool: any) => {
      const attr = pool.attributes ?? {}
      const rel  = pool.relationships ?? {}

      return {
        id: pool.id,
        address: attr.address ?? '0x0',
        name: attr.name ?? 'Unnamed pool',
        dex:
          rel.dex?.data?.id ??
          null,

        baseTokenId: rel.base_token?.data?.id ?? null,
        quoteTokenId:
          // bazı Curve havuzlarında quote_tokens listesi var
          rel.quote_token?.data?.id ??
          rel.quote_tokens?.data?.[0]?.id ??
          null,

        tokenPriceUsd: Number(attr.token_price_usd) || 0,
        baseTokenPriceUsd: Number(attr.base_token_price_usd) || 0,
        quoteTokenPriceUsd: Number(attr.quote_token_price_usd) || 0,
        reserveUsd: Number(attr.reserve_in_usd) || 0,
        volume24hUsd: Number(attr.volume_usd?.h24) || 0,
        priceChange24h: Number(attr.price_change_percentage?.h24) || 0,
      }
    })

    /** İstersen en likit havuzlar en başta olsun: */
    pools.sort((a, b) => b.reserveUsd - a.reserveUsd)

    return pools
  } catch (err) {
    console.error('getTokenPools error:', err)
    return []
  }
}

export async function searchToken(query: string): Promise<TokenSearchResult | null> {
  try {
    console.log("Searching for token:", query)

    // Clean the query
    const cleanQuery = query.toLowerCase().trim()

    // Handle network/token format
    const parts = cleanQuery.split("/")
    if (parts.length === 2) {
      const result = {
        network: parts[0],
        token: parts[1],
      }
      console.log("Found network/token format:", result)
      return result
    }

    // Common token mappings
    const commonTokens: Record<string, TokenSearchResult> = {
      ethereum: { network: "eth", token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
      eth: { network: "eth", token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
      bitcoin: { network: "btc", token: "btc" },
      btc: { network: "btc", token: "btc" },
      solana: { network: "solana", token: "sol" },
      sol: { network: "solana", token: "sol" },
      bnb: { network: "bsc", token: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" },
      "binance-coin": { network: "bsc", token: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" },
      polygon: { network: "polygon_pos", token: "0x0000000000000000000000000000000000001010" },
      matic: { network: "polygon_pos", token: "0x0000000000000000000000000000000000001010" },
      avalanche: { network: "avalanche", token: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" },
      avax: { network: "avalanche", token: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" },
      usdc: { network: "eth", token: "0xa0b86a33e6441b8c18d904c9c0b0b8b8b8b8b8b8" },
      usdt: { network: "eth", token: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
    }

    const result = commonTokens[cleanQuery]
    if (result) {
      console.log("Found common token:", result)
      return result
    }

    console.log("Token not found in common tokens")
    return null
  } catch (error) {
    console.error("Error in searchToken:", error)
    return null
  }
}
