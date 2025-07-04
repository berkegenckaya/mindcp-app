import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { agents } from "@/lib/agents"

export interface InterAgentRequest {
  targetAgentId: number
  message: string
  context?: string
}

export interface InterAgentResponse {
  success: boolean
  response?: string
  error?: string
  agentName?: string
  timestamp: string
}

export async function callAgent(request: InterAgentRequest): Promise<InterAgentResponse> {
  try {
    const { targetAgentId, message, context } = request
    
    // Find the target agent
    const targetAgent = agents.find(agent => agent.id === targetAgentId)
    if (!targetAgent) {
      return {
        success: false,
        error: `Agent with ID ${targetAgentId} not found`,
        timestamp: new Date().toISOString()
      }
    }

    // Prepare the messages for the target agent
    const messages = [
      {
        role: "user" as const,
        content: context ? `Context: ${context}\n\nRequest: ${message}` : message
      }
    ]

    // Call the target agent
    const result = await generateText({
      model: openai("gpt-4o"),
      system: targetAgent.systemPrompt,
      messages: messages,
      tools: targetAgent.toolSet,
      maxTokens: 2000, // Limit response size for inter-agent calls
    })

    return {
      success: true,
      response: result.text,
      agentName: targetAgent.name,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error("Inter-agent call error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString()
    }
  }
}

export async function getAvailableAgents(): Promise<Array<{id: number, name: string, description: string, type: string}>> {
  return agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    type: agent.type
  }))
} 