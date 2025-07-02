"use client"

import { useState } from "react"
import { ModelFilter } from "./model-filter"
import { ModelCard } from "./model-card"

const models = [
  {
    id: 1,
    name: "On-Chain Analyst",
    description: "Analyzes blockchain data and generates reports on token performance and trends",
    type: "analytics",
    status: "active" as const,
    tools: ["coingecko", "dexscreener", "mindcp", "openai-gpt-4o-mini"],
    capabilities: ["on-chain", "data-analysis", "data-visualization"],
    createdAt: "2025-01-20",
  },
  {
    id: 2,
    name: "Content Creator Pro",
    description: "Generates high-quality content, blog posts, and marketing copy with brand consistency",
    type: "creative",
    status: "training" as const,
    tools: ["openai-gpt-4", "claude-3", "dall-e-3", "brand-guidelines"],
    capabilities: ["content-generation", "copywriting", "brand-voice"],
    createdAt: "2025-01-18",
  },
  {
    id: 3,
    name: "Code Assistant",
    description: "Helps with programming, debugging, code reviews, and technical documentation",
    type: "development",
    status: "training" as const,
    tools: ["github-copilot", "openai-codex", "eslint", "prettier"],
    capabilities: ["code-generation", "debugging", "code-review"],
    createdAt: "2025-01-15",
  },
  {
    id: 4,
    name: "Security Auditor",
    description: "Performs security analysis, vulnerability scanning.",
    type: "security",
    status: "training" as const,
    tools: ["nessus", "burp-suite", "openvas", "security-db"],
    capabilities: ["vul-scan", "compliance-check", "threat-analysis"],
    createdAt: "2025-01-12",
  },
 
]

export function ModelGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredModels = models.filter((model) => {
    const matchesCategory = selectedCategory === "all" || model.type === selectedCategory
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">AI Agents</h3>
        <p className="text-gray-300">Explore and interact with various AI agents for different tasks</p>
      </div>

      <ModelFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            id={model.id}
            name={model.name}
            description={model.description}
            type={model.type}
            status={model.status}
            tools={model.tools}
            capabilities={model.capabilities}
            createdAt={model.createdAt}
            href={`/`}
          />
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No agents found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
