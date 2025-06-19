"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BasicAgentsGrid } from "./basic-agents-grid"


interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  tools: string[]
  capabilities?: string[]
  createdAt: string
}

export default function BasicAgentsPage() {
  const router = useRouter()

  const [agents] = React.useState<Agent[]>([
    {
      id: 1,
      name: "Data Analyst Pro",
      description:
        "Advanced data processing and visualization agent that can analyze complex datasets and create insightful reports",
      type: "analytics",
      status: "active",
      tools: ["pandas", "Plotly", "MindCP", "NumPy", "Matplotlib"],
      capabilities: ["aggregate-query", "timeseries-chart", "email-report", "data-visualization"],
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      name: "Creative Writer",
      description: "Content creation and copy-writing specialist for marketing materials and blog posts",
      type: "creative",
      status: "idle",
      tools: ["OpenAI GPT-4", "Hemingway-Lint", "MindCP"],
      capabilities: ["tone-shift", "SEO-optimize", "multilingual-draft"],
      createdAt: "2025-01-10",
    },
    {
      id: 3,
      name: "DevOps Coder",
      description: "Automates code review and opens GitHub pull-requests with intelligent suggestions",
      type: "development",
      status: "training",
      tools: ["GitHub API", "ESLint", "MindCP", "Docker", "Kubernetes"],
      capabilities: ["static-analysis", "review-comments", "open-pull-request", "trigger-CI", "deploy-staging"],
      createdAt: "2025-02-05",
    },
    {
      id: 4,
      name: "Customer Support Bot",
      description: "24/7 customer support agent with natural language understanding",
      type: "customer",
      status: "active",
      tools: ["OpenAI GPT-4", "Zendesk API", "MindCP"],
      capabilities: ["ticket-routing", "sentiment-analysis", "auto-response"],
      createdAt: "2025-01-20",
    },
    {
      id: 5,
      name: "Research Assistant",
      description: "Academic research and literature review specialist",
      type: "analytics",
      status: "active",
      tools: ["Semantic Scholar API", "ArXiv API", "MindCP"],
      capabilities: ["literature-search", "citation-analysis", "summary-generation"],
      createdAt: "2025-02-01",
    },
    {
      id: 6,
      name: "Social Media Manager",
      description: "Creates and schedules social media content across platforms",
      type: "creative",
      status: "idle",
      tools: ["Twitter API", "Instagram API", "StableDiffusion v3"],
      capabilities: ["content-generation", "hashtag-optimization", "schedule-posts"],
      createdAt: "2025-01-25",
    },
  ])

  const handleAgentClick = (agentId: number) => {
    // Navigate to chat screen with the selected agent
    router.push(`/chat/${agentId}`)
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Your AI Agent</h1>
          <p className="mt-2 text-gray-600">Select an agent to start a conversation</p>
        </div>

        {/* Agents Grid */}
        <BasicAgentsGrid agents={agents} onAgentClick={handleAgentClick} />
      </div>
    </div>
  )
}
