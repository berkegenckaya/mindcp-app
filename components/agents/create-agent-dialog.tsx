"use client"

import * as React from "react"
import { Plus, Brain, Zap, Settings, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AgentType {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NewAgent {
  name: string
  description: string
  type: string
  context: string
  tools: string[]
  capabilities: string[]
}

interface CreateAgentDialogProps {
  onCreateAgent: (agent: Omit<NewAgent, "tools" | "capabilities"> & { tools: string[]; capabilities: string[] }) => void
}

const agentTypes: AgentType[] = [
  { value: "analytics", label: "Data Analytics", icon: Brain },
  { value: "creative", label: "Creative Assistant", icon: Zap },
  { value: "development", label: "Code Assistant", icon: Settings },
  { value: "customer", label: "Customer Support", icon: Bot },
]

const toolOptions = [
  "MindCP",
  "OpenAI GPT-4",
  "Plotly",
  "GitHub API",
  "LangChain JS",
  "Shopify Admin API",
  "StableDiffusion v3",
  "Risc Zero",
  "Rust-WASM kernel",
]

const capabilityOptions = [
  "static-analysis",
  "review-comments",
  "open-pull-request",
  "data-analysis",
  "visualization",
  "tone-shift",
  "SEO-optimize",
  "spawn-child-agent",
  "generate-hero-image",
  "publish-listing",
  "threshold-alert",
  "auto-hedge",
]

// Tag Multi Select Component
function TagMultiSelect({
  title,
  accent,
  options,
  selected,
  onToggle,
}: {
  title: string
  accent: "purple" | "cyan"
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>
        {title} <span className="text-xs text-muted-foreground">{`(${selected.length}/3)`}</span>
      </Label>
      <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className={`h-4 w-4 ${accent === "purple" ? "accent-purple-500" : "accent-cyan-500"}`}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

// Neon Button Component
function NeonButton({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  title?: string
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`relative z-10 inline-flex items-center justify-center rounded-lg border border-purple-500 bg-black px-6 py-2 text-sm font-medium text-white shadow-inner transition hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

export function CreateAgentDialog({ onCreateAgent }: CreateAgentDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newAgent, setNewAgent] = React.useState<NewAgent>({
    name: "",
    description: "",
    type: "",
    context: "",
    tools: [],
    capabilities: [],
  })

  const resetForm = () => {
    setNewAgent({
      name: "",
      description: "",
      type: "",
      context: "",
      tools: [],
      capabilities: [],
    })
  }

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.description || !newAgent.type) {
      return
    }

    onCreateAgent({
      name: newAgent.name,
      description: newAgent.description,
      type: newAgent.type,
      context: newAgent.context,
      tools: newAgent.tools,
      capabilities: newAgent.capabilities,
    })

    resetForm()
    setIsOpen(false)
  }

  // Toggle function for multi-select (max 3)
  function toggleMulti<K extends "tools" | "capabilities">(key: K, value: string) {
    setNewAgent((prev) => {
      const has = prev[key].includes(value)
      if (has) return { ...prev, [key]: prev[key].filter((v) => v !== value) }
      if (prev[key].length >= 3) return prev // limit to 3
      return { ...prev, [key]: [...prev[key], value] }
    })
  }

  const isFormValid = newAgent.name && newAgent.description && newAgent.type

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <NeonButton>
          <Plus className="mr-2 h-4 w-4" />
          Create New Agent
        </NeonButton>
      </DialogTrigger>

<DialogContent className="bg-background/95 border-white/10 backdrop-blur-xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Create New AI Agent
          </DialogTitle>
          <DialogDescription>Configure your new AI agent with custom parameters and context</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Agent Name */}
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name *</Label>
            <Input
              id="agent-name"
              placeholder="Enter agent name..."
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              className="bg-background/50 border-white/10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="agent-description">Description *</Label>
            <Textarea
              id="agent-description"
              placeholder="Describe what this agent will do..."
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              className="bg-background/50 border-white/10 min-h-[80px]"
            />
          </div>

          {/* Agent Type */}
          <div className="space-y-2">
            <Label htmlFor="agent-type">Agent Type *</Label>
            <Select value={newAgent.type} onValueChange={(v) => setNewAgent({ ...newAgent, type: v })}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                {agentTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      <t.icon className="h-4 w-4" />
                      {t.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Context */}
          <div className="space-y-2">
            <Label htmlFor="agent-context">Initial Context (one per line)</Label>
            <Textarea
              id="agent-context"
              placeholder={`Add knowledge...\nExample:\nFinancial data analysis\nMarket research\nStatistical modeling`}
              value={newAgent.context}
              onChange={(e) => setNewAgent({ ...newAgent, context: e.target.value })}
              className="bg-background/50 border-white/10 min-h-[80px]"
            />
          </div>

          {/* Tools Selection */}
          <TagMultiSelect
            title="Tools"
            accent="purple"
            options={toolOptions}
            selected={newAgent.tools}
            onToggle={(v) => toggleMulti("tools", v)}
          />

          {/* Capabilities Selection */}
          <TagMultiSelect
            title="Capabilities"
            accent="cyan"
            options={capabilityOptions}
            selected={newAgent.capabilities}
            onToggle={(v) => toggleMulti("capabilities", v)}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <NeonButton onClick={handleCreateAgent} disabled={!isFormValid}>
              Create Agent
            </NeonButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
