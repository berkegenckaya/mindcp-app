// Types for Gecko Terminal API

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

export interface GeckoTerminalResponse {
  data: {
    id: string
    attributes: {
      name: string
      symbol: string
      price_usd: number
      price_change_percentage_24h: number
      market_cap_usd: number
      volume_usd_24h: number
      circulating_supply: number
      total_supply: number
      max_supply: number | null
      description?: string
      address?: string
    }
  }
}

export interface TokenSearchResult {
  network: string
  token: string
}
