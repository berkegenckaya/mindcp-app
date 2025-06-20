// DexScreener API Types
export interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  labels?: string[]
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd?: string
  txns: {
    m5: {
      buys: number
      sells: number
    }
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
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd?: number
    base: number
    quote: number
  }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    header?: string
    openGraph?: string
    websites?: Array<{
      url: string
    }>
    socials?: Array<{
      platform: string
      handle: string
    }>
  }
  boosts?: {
    active: number
  }
}

export interface DexScreenerResponse {
  schemaVersion: string
  pairs: DexScreenerPair[]
  pair?: DexScreenerPair
}

export interface DexScreenerSearchResponse {
  schemaVersion: string
  pairs: DexScreenerPair[]
}

// New interface for token pairs endpoint
export interface DexScreenerTokenResponse {
  schemaVersion: string
  pairs: DexScreenerPair[]
}


export interface FormattedDexPair {
id: string
  name: string
  chainId: string
  dexId: string
  pairAddress: string
  labels?: string[]
  baseToken: {
    name: string
    symbol: string
    address: string
  }
  quoteToken: {
    name: string
    symbol: string
    address: string
  }
  price: string
  priceNative: string
  price_change_24h: string
  price_trend: "up" | "down" | "stable"
  volume_24h: string
  volume_6h: string
  volume_1h: string
  volume_5m: string
  liquidity: string
  liquidityBase: string
  liquidityQuote: string
  market_cap: string
  fdv: string
  transactions: {
    h24: { buys: number; sells: number; total: number }
    h6: { buys: number; sells: number; total: number }
    h1: { buys: number; sells: number; total: number }
    m5: { buys: number; sells: number; total: number }
  }
  priceChanges: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  pairCreatedAt?: string
  url: string
  image_url?: string
  websites?: Array<{
    url: string
  }>
  socials?: Array<{
    platform: string
    handle: string
  }>
  boosts?: number
}

