import { tool } from "ai"
import { z } from "zod"
import { fetchTokenData, searchToken, getTokenPools as fetchTokenPools } from "./api"


export const getTokenPools = tool({
  description:
    "List all liquidity pools for a given cryptocurrency token and return key metrics such as pool name, DEX, price, 24h volume, and TVL (reserve).",
  parameters: z.object({
    /** İsteğe bağlı: Ağ adı (eth, sol, bsc…). “eth/usdc” benzeri sorgularda gerekmez */
    network: z
      .string()
      .optional()
      .describe('Token network – e.g. "eth", "sol", "bsc".'),
    /** Token sembolü, adresi veya “network/token” biçimi */
    tokenQuery: z
      .string()
      .describe(
        'Token name, symbol, address, or "network/token" (e.g. "eth/usdc", "0xa0b8…").',
      ),
  }),

  execute: async ({ network, tokenQuery }) => {
    try {
      /* 1) tokenQuery’yi ağ + token adresi/simgele çözümlüyoruz */
      let resolvedNetwork = network ?? ""
      let tokenAddressOrSymbol = tokenQuery.trim()

      // "eth/usdc" gibi format geldiyse ağ & token’ı ayır
      if (tokenQuery.includes("/")) {
        const [net, tok] = tokenQuery.split("/")
        resolvedNetwork = net
        tokenAddressOrSymbol = tok
      }

      // Sadece sembol/isim verildiyse searchToken ile çöz
      if (!tokenAddressOrSymbol.startsWith("0x") || tokenAddressOrSymbol.length !== 42) {
        const info = await searchToken(tokenQuery)
        if (!info) {
          return JSON.stringify({
            error: `Could not resolve "${tokenQuery}". Try "eth/usdc", contract address or a well-known symbol.`,
          })
        }
        resolvedNetwork = info.network
        tokenAddressOrSymbol = info.token
      }

      if (!resolvedNetwork) {
        return JSON.stringify({
          error: 'Network could not be determined. Pass "network" param or use "network/token" format.',
        })
      }

      /* 2) Havuzları çek */
      const pools = await fetchTokenPools(resolvedNetwork, tokenAddressOrSymbol)
      if (!pools.length) {
        return JSON.stringify({
          error: `No pools found for ${tokenAddressOrSymbol} on ${resolvedNetwork}.`,
        })
      }

      /* 3) En yüksek TVL’ye sahip ilk 10 havuz */
      const topPools = pools
        .sort((a, b) => b.reserveUsd - a.reserveUsd)
        .slice(0, 10)

      /* 4) Rakam formatlayıcılar */
      const fmtUsd = (n: number) =>
        n >= 1e9
          ? `$${(n / 1e9).toFixed(2)}B`
          : n >= 1e6
          ? `$${(n / 1e6).toFixed(2)}M`
          : n >= 1e3
          ? `$${(n / 1e3).toFixed(2)}K`
          : `$${n.toFixed(2)}`

      /* 5) Sonuç */
      const result = {
        success: true,
        message: `Top ${topPools.length} pools for ${tokenAddressOrSymbol.toUpperCase()} on ${resolvedNetwork.toUpperCase()}:`,
        pools: topPools.map((p) => ({
          id: p.id,
          name: p.name,
          dex: p.dex ?? "unknown",
          token_price_usd: `$${p.tokenPriceUsd.toFixed(6)}`,
          reserve_usd: fmtUsd(p.reserveUsd),
          volume_24h_usd: fmtUsd(p.volume24hUsd),
          price_change_24h: `${p.priceChange24h > 0 ? "+" : ""}${p.priceChange24h.toFixed(2)}%`,
          address: p.address,
        })),
      }

      return JSON.stringify(result)
    } catch (err) {
      console.error("getTokenPools error:", err)
      return JSON.stringify({
        error: `An error occurred while fetching token pools: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      })
    }
  },
})

export const getTokenInfoTool = tool({
  description:
    "Get comprehensive information about a cryptocurrency token including price, market cap, volume, and more",
  parameters: z.object({
    tokenQuery: z
      .string()
      .describe(
        'The token name, symbol, or network/token format. Examples: "ethereum", "btc", "eth/usdc", "solana", "polygon"',
      ),
  }),
  execute: async ({ tokenQuery }) => {
    try {
      console.log("Searching for token:", tokenQuery)

      const tokenInfo = await searchToken(tokenQuery)

      if (!tokenInfo) {
        return JSON.stringify({
          error: `Could not find token information for "${tokenQuery}". Please try a different token or use the format "network/token". Supported tokens include: ETH, BTC, SOL, BNB, MATIC, AVAX, or specify like "eth/usdc".`,
        })
      }

      console.log("Found token info:", tokenInfo)

      const { network, token } = tokenInfo
      const data = await fetchTokenData(network, token)

      if (!data) {
        return JSON.stringify({
          error: `Could not fetch data for ${token} on ${network}. The token may not exist or there might be an API issue. Please try again or check the token symbol.`,
        })
      }

      console.log("Fetched token data:", data)

      // Format the data for better readability
      const formatNumber = (num: number, decimals = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
        if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`
        return `$${num.toFixed(decimals)}`
      }

      const formatSupply = (num: number) => {
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
        return num.toFixed(0)
      }

      const tokenResult = {
        success: true,
        message: `Here's the current information for ${data.name} (${data.symbol.toUpperCase()}):`,
        token_data: {
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          price: data.price >= 1 ? `$${data.price.toFixed(2)}` : `$${data.price.toFixed(6)}`,
          price_change_24h: `${data.price_change_24h > 0 ? "+" : ""}${data.price_change_24h.toFixed(2)}%`,
          price_trend: data.price_change_24h > 0 ? "up" : data.price_change_24h < 0 ? "down" : "stable",
          market_cap: formatNumber(data.market_cap),
          volume_24h: formatNumber(data.total_volume),
          circulating_supply: formatSupply(data.circulating_supply),
          total_supply: formatSupply(data.total_supply),
          max_supply: data.max_supply ? formatSupply(data.max_supply) : "Unlimited",
          contract_address: data.contract_address || "Native token",
          blockchain: data.blockchain ? data.blockchain.toUpperCase() : "UNKNOWN",
        },
      }

      console.log("Token tool response:", tokenResult)

      // Return as JSON string to ensure proper formatting
      return JSON.stringify(tokenResult)
    } catch (error) {
      console.error("Tool execution error:", error)
      return JSON.stringify({
        error: `An error occurred while fetching token information: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    }
  },
})
