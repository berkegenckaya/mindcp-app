// Central export for all tools
export { getTokenInfoTool } from "./gecko-terminal/tool"
export { fetchTokenData, searchToken } from "./gecko-terminal/api"
export { searchDexPairsTool, getDexPairInfoTool } from "./dexscreener/tool"
export { getWalletAnalysisTool } from "./cielo/tool"

// Export types
export type { TokenData } from "./gecko-terminal/types"

export type { FormattedDexPair } from "./dexscreener/types"
export type { FormattedWalletSummary } from "./cielo/types"

// Tool registry for easy management
export const availableTools = [
  "gecko-terminal",

  "dexscreener",
  "cielo-finance",
  // Add more tools here as you create them
  // 'weather',
  // 'news',
  // 'social-media',
] as const

export type ToolType = (typeof availableTools)[number]
