"use client"

import { Plus, Bot, Brain, PenLine, PlayCircle, Database, Info, Gift, ArrowRight, Book } from "lucide-react"

import { FancyCard } from "../stat-card"
import { SidebarTrigger } from "../ui/sidebar"
import { AgentGuideCard } from "../guide-cards"
import { Press_Start_2P } from "next/font/google"
import CustomWalletButton from "../custom-connect"
import { ModelGrid } from "../filter/model-grid"


const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
})

const agents = [
  {
    id: 1,
    name: "Data Analyst",
    description: "Processes and analyzes large datasets",
    status: "active",
    type: "Analytics",
    lastActive: "2 minutes ago",
  },
  {
    id: 2,
    name: "Content Creator",
    description: "Generates creative content and copy",
    status: "idle",
    type: "Creative",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Code Assistant",
    description: "Helps with programming and debugging",
    status: "training",
    type: "Development",
    lastActive: "5 minutes ago",
  },
]

// optional: dynamically show icon by agent type
const getIcon = (type: string) => {
  switch (type) {
    case "Analytics":
      return <Bot className="h-4 w-4 text-white" />
    case "Creative":
      return <PenLine className="h-4 w-4 text-white" />
    case "Development":
      return <Brain className="h-4 w-4 text-white" />
    default:
      return <Bot className="h-4 w-4 text-white" />
  }
}

export function AgentDashboard() {
  return (

    
    <div className="space-y-6 h-full  p-4 overflow-y-auto">
{/*       <SidebarTrigger className="absolute top-4 left-4 z-60" />
 */}
      {/* Hero Section */}
      <div className="text-center  space-y-8 py-8 ">
        {/* Promotional Banner */}
        <div className="flex justify-center ">
          <div className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-1 border-[#555555] bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md hover:border-blue-400/50 hover:from-blue-500/15 hover:to-purple-500/15 transition-all duration-300 cursor-pointer">
            <Book className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Learn About Our Neural Network! </span>
            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Decentralized, Peer-to-Peer, Limitless
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with your distributed agents in real time—assign jobs, track performance, and witness seamless collaboration, all within a fully decentralized environment.
          </p>
        </div>
      </div>

      {/* Header */}
      

      {/* Stats Cards */}
      <h3 className="text-xl font-semibold">Your AI Agents</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FancyCard
          title="On-Chain Analyist Agent"
          description="Analyzes blockchain data and provides insights on transactions, trends, and anomalies."
          icon={<Bot className="h-5 w-5 text-white" />}
          href="/chat/1?data=%7B%22id%22%3A1%2C%22name%22%3A%22On-Chain%20Analyst%22%2C%22description%22%3A%22Analyzes%20blockchain%20data%20and%20generates%20reports%20on%20token%20performance%20and%20trends%22%2C%22type%22%3A%22analytics%22%2C%22status%22%3A%22active%22%2C%22tools%22%3A%5B%22coingecko%22%2C%22dexscrenner%22%2C%22mindcp%22%2C%22openai-gpt-4o-mini%22%5D%2C%22capabilities%22%3A%5B%22on-chain%22%2C%22data-analysis%22%2C%22data-visualization%22%5D%7D"
        />
      </div>

     
    {/*   <div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Getting Started with Your AI Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgentGuideCard
              step={1}
              title="Create your first Agent"
              description="Set up a new AI agent with a specific purpose like analysis, writing, or coding assistance."
              icon={<Plus className="w-5 h-5" />}
            />
            <AgentGuideCard
              step={2}
              title="Add Context"
              description="Provide your agent with datasets, instructions, or domain-specific knowledge."
              icon={<Database className="w-5 h-5" />}
            />
            <AgentGuideCard
              step={3}
              title="Run and Observe"
              description="Launch your agent, monitor its behavior, and see real-time responses."
              icon={<PlayCircle className="w-5 h-5" />}
            />
            <AgentGuideCard
              step={4}
              title="Need Help?"
              description="Visit the documentation or community portal to explore use cases and tips."
              icon={<Info className="w-5 h-5" />}
            />
          </div>
        </div>
      </div> */}
      <ModelGrid />
    </div>
  )
}
