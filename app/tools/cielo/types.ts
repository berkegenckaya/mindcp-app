// Cielo Finance API Types - Updated for real API response
export interface CieloTransaction {
  wallet: string
  tx_hash: string
  tx_type: string
  chain: string
  index: number
  timestamp: number
  block: number
  dex?: string
  from: string
  to: string
  from_label?: string
  to_label?: string

  // For swap transactions
  token0_address?: string
  token0_amount?: number
  token0_amount_usd?: number
  token0_price_usd?: number
  token0_name?: string
  token0_symbol?: string
  token0_icon_link?: string
  token1_address?: string
  token1_amount?: number
  token1_amount_usd?: number
  token1_price_usd?: number
  token1_name?: string
  token1_symbol?: string
  token1_icon_link?: string
  first_interaction?: boolean
  is_sell?: boolean

  // For transfer transactions
  amount?: number
  amount_usd?: number
  contract_address?: string
  name?: string
  symbol?: string
  token_price_usd?: number
  type?: string
  token_icon_link?: string

  // For NFT transactions
  thumbnail?: string
  image?: string
  contract_type?: string
  fee?: number
  nft_name?: string
  nft_symbol?: string
  nft_token_id?: string
  value?: number

  // For bridge transactions
  token_address?: string
  token_name?: string
  token_symbol?: string
  from_chain?: string
  to_chain?: string
  platform?: string
  price?: number
}

export interface CieloFeedResponse {
  status: string
  data: {
    items: CieloTransaction[]
    paging: {
      total_rows_in_page: number
      has_next_page: boolean
      next_cursor?: string
    }
  }
}

export interface CieloFeedParams {
  wallet_address?: string
  limit?: number
  chains?: string[]
  transaction_types?: string[]
  tokens?: string[]
  min_usd_value?: number
  max_usd_value?: number
  starting_point?: string
  new_trades?: boolean
}

export interface FormattedWalletSummary {
  wallet_address: string
  total_transactions: number
  chains_active: string[]
  total_volume_usd: number
  transaction_types: Record<string, number>
  top_tokens: Array<{
    symbol: string
    name: string
    count: number
    total_value_usd: number
  }>
  recent_activity: Array<{
    hash: string
    timestamp: string
    type: string
    value_usd: number
    chain: string
    description: string
  }>
  activity_summary: {
    last_24h: number
    last_7d: number
    last_30d: number
  }
  gas_spent_usd: number
  most_active_chain: string
}
