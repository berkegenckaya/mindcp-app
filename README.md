# MindCP — Neural Agents Network

A decentralized, peer-to-peer neural agents network where autonomous AI agents collaborate in a mesh to complete complex tasks. Built on Next.js 15 with Vercel AI SDK, Web3 wallet integration, and multi-chain DeFi tooling.

---

## Overview

MindCP is an AI agent platform where specialized agents can be invoked individually or work together through inter-agent communication. Each agent has a dedicated toolset and system prompt, enabling them to perform tasks ranging from on-chain blockchain analysis to content creation and code assistance.

The platform is designed toward a fully decentralized vision where:
- Agent interactions are signed on-chain with cryptographic proofs
- Node operators and developers earn ETH/MCP tokens as agents run
- Data privacy is preserved through decentralized execution
- Agents form a mesh network capable of autonomous collaboration

---

## Agents

| Agent | Type | Capabilities |
|-------|------|-------------|
| On-Chain Analyst | `analytics` | Token analysis, DEX pairs, wallet profiling, trending pools across 40+ chains |
| Content Creator | `content-creation` | Social media posts, blogs, marketing copy, real-time crypto news integration |
| Code Assistant | `code` | Code generation, debugging, refactoring, Solidity + multi-language support |
| Image Generator | `image-generation` | DALL-E 3 text-to-image *(disabled)* |

Agents can call each other via the inter-agent communication tool, enabling orchestrated workflows (e.g., On-Chain Analyst feeds data to Content Creator for an automated market report).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.2.4 (App Router), React 19, TypeScript 5 |
| AI / LLM | Vercel AI SDK 4.3, OpenAI GPT-4o |
| Web3 | Wagmi 2, Viem 2, RainbowKit 2 |
| UI | Tailwind CSS 3, Radix UI (25+ primitives), Lucide React |
| State | TanStack React Query 5, React Hook Form 7 |
| Charts | Recharts 2 |
| Backend | Supabase |

---

## External Integrations

| Integration | Purpose |
|------------|---------|
| OpenAI GPT-4o | LLM backbone for all agents |
| DALL-E 3 | Image generation |
| Gecko Terminal | Token info and trending pools |
| DexScreener | DEX pair search across 40+ chains |
| Cielo Finance | Wallet analysis — transactions, gas, activity patterns |
| CryptoPanic | Crypto news feeds with sentiment filtering |

**Supported chains include:** Ethereum, BSC, Polygon, Solana, Avalanche, Arbitrum, Optimism, Base, Fantom, Cronos, and 30+ more.

---

## Project Structure

```
mindcp-app/
├── app/
│   ├── api/chat/         # Streaming chat API endpoint (GPT-4o + tools)
│   ├── chat/[agentId]/   # Dynamic chat page per agent
│   ├── agents/           # Agents listing page
│   ├── neural/           # Neural network layer (coming soon)
│   ├── revenue/          # Revenue & staking (coming soon)
│   ├── profile/          # User profile with wallet integration
│   └── tools/            # Tool implementations
│       ├── gecko-terminal/
│       ├── dexscreener/
│       ├── cielo/
│       ├── crypto-news/
│       ├── inter-agent/
│       └── image-generator/
├── components/           # React UI components
├── lib/
│   ├── agents.ts         # Agent definitions and system prompts
│   └── tools-config.ts   # Tool registry
└── hooks/                # Custom React hooks
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenAI API key
- Supabase project (optional for current features)

### Installation

```bash
git clone https://github.com/berkegenckaya/mindcp-app.git
cd mindcp-app
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Roadmap

- [x] Dashboard with agent cards
- [x] Streaming chat interface per agent
- [x] On-chain analysis tools (DeFi, tokens, wallets)
- [x] Content creation with live crypto news
- [x] Code assistance (multi-language + Solidity)
- [x] Wallet connection (Wagmi + RainbowKit)
- [x] Inter-agent communication
- [ ] Neural network mesh layer (agent-to-agent P2P)
- [ ] Revenue sharing and MCP token staking
- [ ] On-chain verifiable outputs and cryptographic proofs
- [ ] Decentralized node operator rewards

---

## License

MIT
