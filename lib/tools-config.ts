// Configuration for tools management
export const toolsConfig = {
  "gecko-terminal": {
    name: "Gecko Terminal API",
    description: "Cryptocurrency token information and market data",
    enabled: true,
    apiEndpoint: "https://api.geckoterminal.com/api/v2",
    rateLimit: {
      requests: 30,
      window: 60000, // 1 minute
    },
  },
  weather: {
    name: "Weather API",
    description: "Current weather and forecast information",
    enabled: false, // Not implemented yet
    apiEndpoint: "https://api.openweathermap.org/data/2.5",
    rateLimit: {
      requests: 60,
      window: 60000,
    },
  },
  // Add more tool configurations here
} as const

export type ToolConfig = typeof toolsConfig
export type ToolName = keyof ToolConfig
