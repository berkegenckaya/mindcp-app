import { tool } from "ai"
import { z } from "zod"
import { callAgent, getAvailableAgents } from "./api"

export const callAgentTool = tool({
  description: "Call another AI agent to get specialized assistance. Use this when you need expertise from a different agent type (e.g., Content Creator for news/content, On-Chain Analyst for crypto data, Code Assistant for programming help).",
  parameters: z.object({
    targetAgentId: z.number().describe("The ID of the target agent to call. Use get_available_agents first to see available agents."),
    message: z.string().describe("The message/request to send to the target agent. Be specific about what you need."),
    context: z.string().optional().describe("Additional context to provide to the target agent about your current task or user's needs."),
  }),
  execute: async ({ targetAgentId, message, context }) => {
    const result = await callAgent({
      targetAgentId,
      message,
      context,
    })
    
    return {
      success: result.success,
      response: result.response,
      error: result.error,
      agentName: result.agentName,
      timestamp: result.timestamp,
    }
  },
})

export const getAvailableAgentsTool = tool({
  description: "Get a list of all available AI agents that can be called for specialized tasks. Use this to discover what agents are available before calling them.",
  parameters: z.object({}),
  execute: async () => {
    const agents = await getAvailableAgents()
    return {
      available_agents: agents,
      count: agents.length,
    }
  },
})

// Specific helper tools for common inter-agent scenarios
export const getContentFromContentCreatorTool = tool({
  description: "Get content creation assistance from the Content Creator agent. This agent can create social media posts, articles, marketing copy, and has access to crypto news.",
  parameters: z.object({
    contentType: z.string().describe("Type of content needed (e.g., 'social media post', 'article', 'marketing copy', 'crypto news summary')"),
    topic: z.string().describe("The topic or subject for the content"),
    requirements: z.string().optional().describe("Specific requirements, tone, length, or style preferences"),
  }),
  execute: async ({ contentType, topic, requirements }) => {
    const message = `Create ${contentType} about ${topic}${requirements ? `. Requirements: ${requirements}` : ''}`
    const context = "This is a request from another AI agent for content creation assistance."
    
    const result = await callAgent({
      targetAgentId: 2, // Content Creator agent ID
      message,
      context,
    })
    
    return result
  },
})

export const getCryptoAnalysisFromAnalystTool = tool({
  description: "Get crypto analysis from the On-Chain Analyst agent. This agent can analyze tokens, DEX pairs, trending pools, and wallet data.",
  parameters: z.object({
    analysisType: z.string().describe("Type of analysis needed (e.g., 'token analysis', 'trending pools', 'wallet analysis', 'DEX pair info')"),
    target: z.string().describe("The target to analyze (e.g., token symbol, wallet address, pair address)"),
    requirements: z.string().optional().describe("Specific requirements or additional context for the analysis"),
  }),
  execute: async ({ analysisType, target, requirements }) => {
    const message = `Perform ${analysisType} for ${target}${requirements ? `. Requirements: ${requirements}` : ''}`
    const context = "This is a request from another AI agent for crypto analysis."
    
    const result = await callAgent({
      targetAgentId: 1, // On-Chain Analyst agent ID
      message,
      context,
    })
    
    return result
  },
})

export const getCodeHelpFromCodeAssistantTool = tool({
  description: "Get coding assistance from the Code Assistant agent. This agent can write, explain, debug, and refactor code in any programming language.",
  parameters: z.object({
    taskType: z.string().describe("Type of coding task (e.g., 'write function', 'debug code', 'explain code', 'refactor code')"),
    language: z.string().describe("Programming language (e.g., 'JavaScript', 'Python', 'TypeScript', 'Solidity')"),
    description: z.string().describe("Detailed description of what code assistance is needed"),
    existingCode: z.string().optional().describe("Existing code to work with (for debugging or refactoring)"),
  }),
  execute: async ({ taskType, language, description, existingCode }) => {
    const message = `${taskType} in ${language}: ${description}${existingCode ? `\n\nExisting code:\n${existingCode}` : ''}`
    const context = "This is a request from another AI agent for coding assistance."
    
    const result = await callAgent({
      targetAgentId: 4, // Code Assistant agent ID
      message,
      context,
    })
    
    return result
  },
}) 