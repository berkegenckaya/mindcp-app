// Central export for all tools
export * from "./gecko-terminal";
export * from "./dexscreener";
export * from "./cielo";
export * from "./image-generator";
export * from "./crypto-news";
// export * from "./krystal"; // Currently disabled


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
