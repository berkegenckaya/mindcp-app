"use client";

import * as React from "react";
import {
  Plus,
  Bot,
  Upload,
  FileText,
  Trash2,
  Edit,
  X,
  Brain,
  Zap,
  Settings,
  PenToolIcon as Tool,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NeonButton } from "../neon-button";
import { Press_Start_2P } from "next/font/google";
import { SidebarTrigger } from "../ui/sidebar";
import { TagMultiSelect } from "../tag-multi-select";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
});

/* ---------- Types & mock data ---------- */
interface Agent {
  id: number;
  name: string;
  description: string;
  type: string;
  status: "active" | "idle" | "training";
  context: string[];
  tools: string[];
  capabilities?: string[];
  createdAt: string;
}

const agentTypes = [
  { value: "analytics", label: "Data Analytics", icon: Brain },
  { value: "creative", label: "Creative Assistant", icon: Zap },
  { value: "development", label: "Code Assistant", icon: Settings },
  { value: "customer", label: "Customer Support", icon: Bot },
];

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
];

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
];

/* ---------- Component ---------- */
export default function AgentsPage() {
  const [agents, setAgents] = React.useState<Agent[]>([
    {
      id: 1,
      name: "Data Analyst Pro",
      description: "Advanced data processing and visualization agent",
      type: "analytics",
      status: "active",
      context: [
        "Financial data analysis",
        "Market trends",
        "Statistical modeling",
      ],
      tools: ["pandas", "Plotly", "MindCP"],
      capabilities: ["aggregate-query", "timeseries-chart", "email-report"],
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      name: "Creative Writer",
      description: "Content creation and copy-writing specialist",
      type: "creative",
      status: "idle",
      context: ["Brand guidelines", "Content strategy", "SEO optimization"],
      tools: ["OpenAI GPT-4", "Hemingway-Lint", "MindCP"],
      capabilities: ["tone-shift", "SEO-optimize", "multilingual-draft"],
      createdAt: "2025-01-10",
    },
    /* ---------- NEW EXAMPLES ---------- */
    {
      id: 3,
      name: "DevOps Coder",
      description: "Automates code review and opens GitHub pull-requests",
      type: "development",
      status: "training",
      context: ["Repo: github.com/org/app", "CI rules", "Coding standards v2"],
      tools: ["GitHub API", "ESLint", "MindCP"],
      capabilities: [
        "static-analysis",
        "review-comments",
        "open-pull-request",
        "trigger-CI",
      ],
      createdAt: "2025-02-05",
    },
    {
      id: 4,
      name: "Chain-Runner",
      description: "Meta-agent that decomposes tasks into sub-agents",
      type: "orchestrator",
      status: "active",
      context: ["Available sub-agents registry", "Task queue"],
      tools: ["MindCP", "LangChain JS"],
      capabilities: [
        "plan-task-graph",
        "spawn-child-agent",
        "aggregate-results",
      ],
      createdAt: "2025-03-18",
    },
    {
      id: 5,
      name: "E-Commerce Curator",
      description: "Finds trending products, writes copy, publishes to shop",
      type: "commerce",
      status: "idle",
      context: ["Supplier APIs", "CMS credentials", "SEO keywords"],
      tools: ["Amazon PA-API", "StableDiffusion v3", "Shopify Admin API"],
      capabilities: [
        "scrape-product-data",
        "generate-hero-image",
        "publish-listing",
        "schedule-social-post",
      ],
      createdAt: "2025-04-02",
    },
    {
      id: 6,
      name: "Realtime Sentinel",
      description: "Monitors L0 market feeds and executes policy actions",
      type: "trading",
      status: "active",
      context: ["Kraken-WS", "Binance-depth", "Risk policy v1.4"],
      tools: ["WebSocketFeed", "MindCP.Signal", "Rust-WASM kernel"],
      capabilities: ["threshold-alert", "auto-hedge", "webhook-notify"],
      createdAt: "2025-04-20",
    },
  ]);

  const [isCreating, setIsCreating] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<number | null>(null);
  const [newAgent, setNewAgent] = React.useState({
    name: "",
    description: "",
    type: "",
    context: "",
    tools: [] as string[],
    capabilities: [] as string[],
  });

  /* ----- CRUD helpers ----- */
  const resetForm = () =>
    setNewAgent({
      name: "",
      description: "",
      type: "",
      context: "",
      tools: [],
      capabilities: [],
    });

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.description || !newAgent.type) return;
    const agent: Agent = {
      id: Date.now(),
      name: newAgent.name,
      description: newAgent.description,
      type: newAgent.type,
      tools: newAgent.tools,
      capabilities: newAgent.capabilities,
      status: "training",
      context: newAgent.context
        ? newAgent.context.split("\n").filter((c) => c.trim())
        : [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAgents([...agents, agent]);
    resetForm();
    setIsCreating(false);
  };
  const addContextToAgent = (id: number, ctx: string) =>
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, context: [...a.context, ctx] } : a
      )
    );

  /* ----- toggle-checkbox (max 3) ----- */
  function toggleMulti<K extends "tools" | "capabilities">(
    key: K,
    value: string
  ) {
    setNewAgent((prev) => {
      const has = prev[key].includes(value);
      if (has) return { ...prev, [key]: prev[key].filter((v) => v !== value) };
      if (prev[key].length >= 3) return prev; // limit
      return { ...prev, [key]: [...prev[key], value] };
    });
  }
  const handleDeleteAgent = (id: number) =>
    setAgents(agents.filter((a) => a.id !== id));

  const removeContextFromAgent = (id: number, idx: number) =>
    setAgents(
      agents.map((a) =>
        a.id === id
          ? { ...a, context: a.context.filter((_, i) => i !== idx) }
          : a
      )
    );

  const { isConnected } = useAccount();
  if (!isConnected)
    return (
      <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-16">
        {/* ==== soft neon glows ==== */}

        {/* ==== glass card ==== */}
        <div
          className="
        relative z-10 w-full max-w-md
        rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md
        p-10 text-center
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_6px_24px_rgba(0,0,0,0.18)]
        before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]
       
        before:opacity-0 before:transition before:duration-300
        hover:before:opacity-60 hover:before:blur-lg
      "
        >
          {/* icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 text-white shadow-inner">
            <Bot className="h-7 w-7" />
          </div>

          <h2 className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-2xl font-bold text-transparent">
            Connect your Wallet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
            Link a wallet to create, train&nbsp;and run neural agents on-chain.
          </p>

          {/* RainbowKit button */}
          <div className="mt-8 flex justify-center">
            <ConnectButton
              chainStatus="icon" /* tiny chain logo */
              accountStatus="address" /* hide ENS / balance here */
              showBalance={false}
            />
          </div>
        </div>
      </section>
    );
  /* ---------- JSX ---------- */
  return (
    <div className="space-y-8">
      {/* Header */}
      <SidebarTrigger className="absolute left-4 top-4 z-10" />
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`bg-clip-text text-xl  text-black ${pressStart2P.className}`}
          >
            Neural Agents
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your intelligent agents
          </p>
        </div>

        {/* Create Agent button + dialog */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="relative z-10 inline-flex items-center justify-center rounded-lg border border-purple-500 bg-black px-6 py-2 text-sm font-medium text-white shadow-inner transition hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]">
              <Plus className="mr-2 h-4 w-4" />
              Create New Agent
            </Button>
          </DialogTrigger>

          {/* --- create dialog content --- */}
          <DialogContent className="bg-background/95 border-white/10 backdrop-blur-xl sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Create New AI Agent
              </DialogTitle>
              <DialogDescription>
                Configure your new AI agent with custom parameters and context
              </DialogDescription>
            </DialogHeader>

            {/* dialog form */}
            <div className="space-y-4 py-4">
              {/* name */}
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="Enter agent name..."
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  className="bg-background/50 border-white/10"
                />
              </div>
              {/* description */}
              <div className="space-y-2">
                <Label htmlFor="agent-description">Description</Label>
                <Textarea
                  id="agent-description"
                  placeholder="Describe what this agent will do..."
                  value={newAgent.description}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, description: e.target.value })
                  }
                  className="bg-background/50 border-white/10 min-h-[80px]"
                />
              </div>
              {/* type */}
              <div className="space-y-2">
                <Label htmlFor="agent-type">Agent Type</Label>
                <Select
                  value={newAgent.type}
                  onValueChange={(v) => setNewAgent({ ...newAgent, type: v })}
                >
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
              {/* context */}
              <div className="space-y-2">
                <Label htmlFor="agent-context">
                  Initial Context (one per line)
                </Label>
                <Textarea
                  id="agent-context"
                  placeholder={`Add knowledge...\nExample:\nFinancial data analysis\nMarket research\nStatistical modeling`}
                  value={newAgent.context}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, context: e.target.value })
                  }
                  className="bg-background/50 border-white/10 min-h-[80px]"
                />
              </div>

              {/* tools */}
              <TagMultiSelect
                title="Tools"
                accent="purple"
                options={toolOptions}
                selected={newAgent.tools}
                onToggle={(v) => toggleMulti("tools", v)}
              />

              <TagMultiSelect
                title="Capabilities"
                accent="cyan"
                options={capabilityOptions}
                selected={newAgent.capabilities}
                onToggle={(v) => toggleMulti("capabilities", v)}
              />
              {/* create / cancel */}
              <div className="flex justify-end gap-2 pt-4">
                <NeonButton title="Cancel" onClick={() => setIsCreating(false)}>
                  Cancel
                </NeonButton>
                <NeonButton
                  title="Create Agent"
                  onClick={handleCreateAgent}
                ></NeonButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ---------- Agents Grid ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="
              relative group rounded-2xl p-5
              border border-white/35
              bg-white/18 backdrop-blur-md
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]
              transition-all duration-300
              hover:scale-[1.02] hover:bg-white/26
              hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_28px_rgba(0,0,0,0.2)]
            "
          >
            {/* ----- Card header ----- */}
            <CardHeader>
              <div className="flex items-start justify-between">
                {/* icon + title */}
                <div className="flex items-center gap-3">
                  {/* icon badge */}
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 scale-95 rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] blur-md opacity-90 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                    <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner" />
                  </div>
                  {/* name + status */}
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          agent.status === "active"
                            ? "default"
                            : agent.status === "idle"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {agent.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {agentTypes.find((t) => t.value === agent.type)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* edit / delete */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditingAgent(
                        editingAgent === agent.id ? null : agent.id
                      )
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardDescription>{agent.description}</CardDescription>

              {/* Tools Section */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Tool className="h-4 w-4 text-purple-400" />
                  <Label className="text-sm font-medium">Tools</Label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.length ? (
                    agent.tools.map((tool) => (
                      <Badge
                        key={tool}
                        variant="outline"
                        className="bg-purple-50/10 text-xs"
                      >
                        {tool}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No tools defined
                    </span>
                  )}
                </div>
              </div>

              {/* Capabilities Section */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <Label className="text-sm font-medium">Capabilities</Label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities?.length ? (
                    agent.capabilities.map((cap) => (
                      <Badge
                        key={cap}
                        className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-xs"
                      >
                        {cap}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No capabilities defined
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* ----- Card content ----- */}
            <CardContent>
              <Tabs defaultValue="context" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background">
                  <TabsTrigger value="context">Context</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* ---- Context tab ---- */}
                <TabsContent value="context" className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Knowledge Base
                    </Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7">
                          <Plus className="mr-1 h-3 w-3" />
                          Add Context
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-background/95 border-white/10 backdrop-blur-xl">
                        <DialogHeader>
                          <DialogTitle>Add Context to {agent.name}</DialogTitle>
                          <DialogDescription>
                            Add new knowledge or context to enhance your
                            agent&apos;s capabilities
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <Textarea
                            placeholder="Enter new context..."
                            id={`context-${agent.id}`}
                            className="min-h-[100px] bg-background/50 border-white/10"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload File
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                const ta = document.getElementById(
                                  `context-${agent.id}`
                                ) as HTMLTextAreaElement;
                                if (ta.value.trim()) {
                                  addContextToAgent(agent.id, ta.value.trim());
                                  ta.value = "";
                                }
                              }}
                              className="bg-gradient-to-r from-purple-500 to-cyan-500"
                            >
                              Add Context
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* context list */}
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {agent.context.length ? (
                      agent.context.map((ctx, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-white/5 bg-background/30 p-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate text-sm">{ctx}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeContextFromAgent(agent.id, idx)
                            }
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No context added yet.
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* ---- Settings tab ---- */}
                <TabsContent value="settings" className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Created</Label>
                    <p className="text-sm text-muted-foreground">
                      {agent.createdAt}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Performance</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-background/30">
                        <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30" />
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Advanced Settings
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------- Empty state ---------- */}
      {agents.length === 0 && (
        <Card className="py-12 text-center border border-white/35 bg-white/18 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.14)]">
          <CardContent>
            <Bot className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No agents created yet
            </h3>
            <p className="mb-4 text-muted-foreground">
              Create your first AI agent to get started with neural processing
            </p>
            <NeonButton onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </NeonButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MultiSelectGrid({
  title,
  options,
  selected,
  toggle,
  accent,
}: {
  title: string;
  options: string[];
  selected: string[];
  toggle: (v: string) => void;
  accent: "purple" | "cyan";
}) {
  return (
    <div className="space-y-2">
      <Label>
        {title}{" "}
        <span className="text-xs text-muted-foreground">{`(${selected.length}/3)`}</span>
      </Label>
      <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className={`h-4 w-4 accent-${accent}-500`}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
