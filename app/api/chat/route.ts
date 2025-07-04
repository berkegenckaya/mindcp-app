import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getNetworkTrendingPoolsTool, getTokenInfoTool, getTrendingPoolsTool } from "@/app/tools/gecko-terminal"
import { getDexPairInfoTool, searchDexPairsTool,getTokenPairsTool  } from "@/app/tools/dexscreener"
import { getWalletAnalysisTool } from "@/app/tools/cielo"
import { getTokenPools } from "@/app/tools/gecko-terminal/tool"
import { agents } from "@/lib/agents"


export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, agentId } = await req.json()

    console.log("Received messages:", messages)

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format")
    }
    if (typeof agentId !== "number") {
      throw new Error("Missing or invalid agentId")
    }
    const agent = agents.find(a => a.id === agentId)
    if (!agent) {
      throw new Error("Agent not found")
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: agent.systemPrompt,
      messages: messages,
      tools: agent.toolSet,
      onFinish: (result) => {
        console.log("Stream finished successfully:", {
          finishReason: result.finishReason,
          usage: result.usage,
        })
      },
      onError: (error) => {
        console.error("Stream error:", error)
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Route Error:", error)

    // Return a proper error response
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
