"use client"

import type * as React from "react"
import { Plus, Bot, Upload, FileText, Trash2, Edit, X, Settings, PenToolIcon as Tool, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Agent {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  context: string[]
  tools: string[]
  capabilities?: string[]
  createdAt: string
}

interface AgentType {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface AgentCardProps {
  agent: Agent
  agentTypes: AgentType[]
  editingAgent: number | null
  onEdit: (id: number | null) => void
  onDelete: (id: number) => void
  onAddContext: (id: number, context: string) => void
  onRemoveContext: (id: number, index: number) => void
}

export function AgentCard({
  agent,
  agentTypes,
  editingAgent,
  onEdit,
  onDelete,
  onAddContext,
  onRemoveContext,
}: AgentCardProps) {
  return (
    <Card
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
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a9ff] to-[#ffcf9f] shadow-inner">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>
            {/* name + status */}
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={agent.status === "active" ? "default" : agent.status === "idle" ? "secondary" : "outline"}
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
              onClick={() => onEdit(editingAgent === agent.id ? null : agent.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(agent.id)}
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
                <Badge key={tool} variant="outline" className="bg-purple-50/10 text-xs">
                  {tool}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No tools defined</span>
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
                <Badge key={cap} className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-xs">
                  {cap}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No capabilities defined</span>
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
              <Label className="text-sm font-medium">Knowledge Base</Label>
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
                      Add new knowledge or context to enhance your agent&apos;s capabilities
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
                          const ta = document.getElementById(`context-${agent.id}`) as HTMLTextAreaElement
                          if (ta.value.trim()) {
                            onAddContext(agent.id, ta.value.trim())
                            ta.value = ""
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
                      onClick={() => onRemoveContext(agent.id, idx)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No context added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* ---- Settings tab ---- */}
          <TabsContent value="settings" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Created</Label>
              <p className="text-sm text-muted-foreground">{agent.createdAt}</p>
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
  )
}
