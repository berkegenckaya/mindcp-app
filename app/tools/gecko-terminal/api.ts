import type { TokenData, TokenSearchResult } from "./types"

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
      ethereum: { network: "eth", token: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640" }, // ETH/USDC V3 Pool
      eth: { network: "eth", token: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640" }, // ETH/USDC V3 Pool
      bitcoin: { network: "eth", token: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed" }, // WBTC/ETH V3 Pool
      btc: { network: "eth", token: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed" }, // WBTC/ETH V3 Pool
      solana: { network: "solana", token: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2" }, // SOL/USDC Pool
      sol: { network: "solana", token: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2" }, // SOL/USDC Pool
      bnb: { network: "bsc", token: "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16" }, // BNB/BUSD Pool
      "binance-coin": { network: "bsc", token: "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16" }, // BNB/BUSD Pool
      polygon: { network: "polygon_pos", token: "0x45dda9cb7c25131df268515131f647d726f50608" }, // MATIC/USDC Pool
      matic: { network: "polygon_pos", token: "0x45dda9cb7c25131df268515131f647d726f50608" }, // MATIC/USDC Pool
      avalanche: { network: "avalanche", token: "0xf4003f4efbe8691b60249e6afbd307abe7758adb" }, // AVAX/USDC Pool
      avax: { network: "avalanche", token: "0xf4003f4efbe8691b60249e6afbd307abe7758adb" }, // AVAX/USDC Pool
      usdc: { network: "eth", token: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640" }, // ETH/USDC V3 Pool
      usdt: { network: "eth", token: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36" }, // ETH/USDT V3 Pool
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
