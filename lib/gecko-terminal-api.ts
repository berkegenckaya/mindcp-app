// Gecko Terminal API client

export interface TokenData {
  id: string
  name: string
  symbol: string
  price: number
  price_change_24h: number
  market_cap: number
  total_volume: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  description?: string
  contract_address?: string
  blockchain?: string
}

export async function fetchTokenData(network: string, token: string): Promise<TokenData | null> {
  try {
    const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${token}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch token data: ${response.status}`)
    }

    const data = await response.json()

    // Extract and format the relevant data from the API response
    const tokenData = data.data.attributes

    return {
      id: data.data.id,
      name: tokenData.name,
      symbol: tokenData.symbol,
      price: tokenData.price_usd || 0,
      price_change_24h: tokenData.price_change_percentage_24h || 0,
      market_cap: tokenData.market_cap_usd || 0,
      total_volume: tokenData.volume_usd_24h || 0,
      circulating_supply: tokenData.circulating_supply || 0,
      total_supply: tokenData.total_supply || 0,
      max_supply: tokenData.max_supply,
      description: tokenData.description,
      contract_address: tokenData.address,
      blockchain: network,
    }
  } catch (error) {
    console.error("Error fetching token data:", error)
    return null
  }
}

export async function searchToken(query: string): Promise<{ network: string; token: string } | null> {
  // This is a simplified implementation
  // In a real app, you would implement a proper search against the Gecko Terminal API

  // For now, we'll assume the query is in the format "network/token"
  const parts = query.split("/")
  if (parts.length === 2) {
    return {
      network: parts[0].toLowerCase(),
      token: parts[1].toLowerCase(),
    }
  }

  // For common tokens, we could have some defaults
  if (query.toLowerCase() === "ethereum" || query.toLowerCase() === "eth") {
    return {
      network: "eth",
      token: "eth",
    }
  }

  if (query.toLowerCase() === "bitcoin" || query.toLowerCase() === "btc") {
    return {
      network: "btc",
      token: "btc",
    }
  }

  return null
}
