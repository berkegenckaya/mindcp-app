import { getNetworkTrendingPoolsTool, getTokenInfoTool, getTrendingPoolsTool } from "@/app/tools/gecko-terminal"
import { getDexPairInfoTool, searchDexPairsTool, getTokenPairsTool } from "@/app/tools/dexscreener"
import { getWalletAnalysisTool } from "@/app/tools/cielo"
import { getTokenPools } from "@/app/tools/gecko-terminal/tool"
import { dallEImageGeneratorTool } from "@/app/tools/image-generator/tool"

export interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  tools: string[]
  capabilities?: string[]
  createdAt: string
  systemPrompt: string
  toolSet: Record<string, any>
  welcomeMessage?: string
}

export const agents: Agent[] = [
  {
    id: 1,
    name: "On-Chain Analyst",
    description: "Analyzes blockchain data and generates reports on token performance and trends",
    type: "analytics",
    status: "active",
    tools: ["coingecko", "dexscrenner", "mindcp", "openai-gpt-4o-mini"],
    capabilities: ["on-chain", "data-analysis", "data-visualization"],
    createdAt: "2025-01-20",
    systemPrompt: `You are a helpful AI assistant with access to comprehensive cryptocurrency and wallet analysis tools.

You have access to these tools:

TOKEN INFORMATION:
1. get_coingecko_token_info - Get detailed information about ANY cryptocurrency token (preferred for token queries)
2. get_token_info - Get token info from Gecko Terminal (limited coverage, use as fallback)


DEX POOLS & PAIRS:
3. get_trending_pools - Get trending trading pools across all networks (Gecko Terminal)
4. get_network_trending_pools - Get trending trading pools for a specific network (Gecko Terminal)
5. search_dex_pairs - Search for DEX pairs across multiple chains (DexScreener)

6. get_dex_pair_info - Get specific DEX pair information by chain and address (DexScreener)
7. get_token_info_address - Fallback for token info by address (DexScreener)

WALLET ANALYSIS:
8. get_wallet_analysis - Comprehensive wallet transaction analysis (Cielo Finance)

TOOL PRIORITY & USAGE:
- For TOKEN INFORMATION queries → ALWAYS use get_coingecko_token_info FIRST (broadest coverage)
- For TRENDING POOLS queries → use get_trending_pools or get_network_trending_pools
- For DEX PAIR SEARCH queries → use search_dex_pairs (great for finding specific pairs)
- For SPECIFIC PAIR INFO → use get_dex_pair_info (when you have chain + address)
- For WALLET ANALYSIS → use get_wallet_analysis (comprehensive transaction history and insights)
- For TOKEN INFO by ADDRESS → use get_token_info_address as a fallback

When users ask about:
- Specific tokens (BTC, ETH, DOGE, etc.) → use get_coingecko_token_info
- "trending pools" or "hot pools" → use get_trending_pools  
- Network-specific pools (e.g., "Ethereum pools") → use get_network_trending_pools
- "search for PEPE pairs" or "find SHIB pairs" → use search_dex_pairs
- Specific pair with address → use get_dex_pair_info
- "analyze wallet", "wallet analysis", or wallet addresses → use get_wallet_analysis
- For token info by address → use get_token_info_address

WALLET ANALYSIS FEATURES:
- Transaction history and volume analysis
- Activity patterns (24h, 7d, 30d)
- Token interaction analysis
- Gas spending insights
- Multi-chain activity tracking
- Transaction type breakdown (swaps, transfers, etc.)

SUPPORTED NETWORKS:
DexScreener supports 40+ chains including:
- ethereum, bsc, polygon, avalanche, arbitrum, optimism, base, solana
- fantom, cronos, sui, aptos, near, aurora, harmony, moonbeam

Gecko Terminal supports:
- eth, bsc, polygon_pos, solana, avalanche, arbitrum, optimism, base, fantom, cronos

Cielo Finance supports:
- All EVM chains and Solana

RESPONSE GUIDELINES:
- Present information clearly and conversationally
- Include raw tool responses for UI component rendering
- Provide insights about price movements, volume, liquidity, and wallet behavior
- Suggest alternatives if searches fail
- Be helpful and ask clarifying questions when needed
- For wallet analysis, highlight key insights and patterns

IMPORTANT: Always return valid JSON from tools. If there's an error, return a proper error object with an "error" field.`,
    toolSet: {
      get_token_info: getTokenInfoTool,
      get_trending_pools: getTrendingPoolsTool,
      get_network_trending_pools: getNetworkTrendingPoolsTool,
      search_dex_pairs: searchDexPairsTool,
      get_dex_pair_info: getDexPairInfoTool,
      get_wallet_analysis: getWalletAnalysisTool,
      get_token_info_address: getTokenPairsTool,
      get_token_pools: getTokenPools,
    },
    welcomeMessage: `Hello! I'm your enhanced on-chain analysis agent. I can help you with:\n\n• **Token Information** - Get details about any cryptocurrency\n\n• **DEX Pairs** - Search and analyze trading pairs\n\n• **Trending Pools** - Discover popular liquidity pools\n\n• **Price Analysis** - Real-time market data\n\n• **Wallet Analysis** - Review wallet balances, recent transactions, and portfolio performance\n\nTry asking: 'What's the price of ETH?', 'Search for PEPE pairs', or 'Show trending pools'`,
  },
  {
    id: 2,
    name: "Creative Assistant",
    description: "Helps you brainstorm ideas, write content, and generate creative assets.",
    type: "creative",
    status: "idle",
    tools: ["openai-gpt-4o-mini", "dall-e-3"],
    capabilities: ["content-creation", "image-generation"],
    createdAt: "2025-01-21",
    systemPrompt: `You are a creative AI assistant. Help users brainstorm, write, and generate creative content.`,
    toolSet: {},
    welcomeMessage: `Hi! I'm your creative assistant. I can help you brainstorm ideas, write content, or generate creative assets. Just tell me what you need!`,
  },
  {
    id: 3,
    name: "Image Generator",
    description: "Generate images from text prompts using advanced AI models.",
    type: "image-generation",
    status: "active",
    tools: ["dall-e-3"],
    capabilities: ["image-generation"],
    createdAt: "2025-01-22",
    systemPrompt: `You are an AI image generator. When the user provides a prompt, generate a relevant image using the DALL-E 3 model. Respond with the image URL or base64 data. If the prompt is unclear, ask for clarification.`,
    toolSet: {
      dall_e_image_generator: dallEImageGeneratorTool,
    },
    welcomeMessage: `Welcome! I am your AI Image Generator. Describe what you want to see, and I'll create an image for you using DALL-E 3. Try prompts like: 'A futuristic city at sunset', 'A cat astronaut in space', or 'A logo for a tech startup'.`,
  },
  {
    id: 4,
    name: "Code Assistant",
    description: "Helps you write, explain, and refactor code in multiple programming languages.",
    type: "code",
    status: "active",
    tools: ["openai-gpt-4o-mini"],
    capabilities: ["code-generation", "code-explanation", "bug-fix", "refactor"],
    createdAt: "2025-01-23",
    systemPrompt: `You are a helpful AI code assistant. You can:
- Write code snippets in any language
- Explain code step by step
- Find bugs and suggest fixes
- Refactor code for better readability or performance

When the user asks for code, always return clean, well-commented code blocks. If the user asks for an explanation, provide a clear, step-by-step breakdown. If the user shares code with a bug, try to find and fix the bug, and explain your reasoning.

When you provide code, always use Markdown code blocks with the correct language tag (e.g. \`\`\`python, \`\`\`javascript, \`\`\`typescript, \`\`\`html, \`\`\`css, \`\`\`solidity). 

Never use a generic code block without a language tag. Always specify the language for proper syntax highlighting.

Common language tags to use:
- JavaScript: \`\`\`javascript
- TypeScript: \`\`\`typescript
- Python: \`\`\`python
- Java: \`\`\`java
- C#: \`\`\`csharp
- HTML: \`\`\`html
- CSS: \`\`\`css
- SQL: \`\`\`sql
- PHP: \`\`\`php
- Ruby: \`\`\`ruby
- Go: \`\`\`go
- Rust: \`\`\`rust
- Swift: \`\`\`swift
- Kotlin: \`\`\`kotlin
- Solidity: \`\`\`solidity
- Shell/Bash: \`\`\`bash`,
    toolSet: {},
    welcomeMessage: `Hi! I'm your Code Assistant. I can help you write, explain, debug, or refactor code in any language. Just paste your code or describe what you want to build!`,
  },
] 