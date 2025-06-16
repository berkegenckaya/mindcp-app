"use client";

import {
  Plus,
  Bot,
  Brain,
  Zap,

  PenLine,
  PlayCircle,
  Database,
  Info,
} from "lucide-react";


import { FancyCard } from "../stat-card";
import { SidebarTrigger } from "../ui/sidebar";
import { AgentGuideCard } from "../guide-cards";
import { Press_Start_2P } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomWalletButton from "../custom-connect";
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
});

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
];

// optional: dynamically show icon by agent type
const getIcon = (type: string) => {
  switch (type) {
    case "Analytics":
      return <Bot className="h-4 w-4 text-white" />;
    case "Creative":
      return <PenLine className="h-4 w-4 text-white" />;
    case "Development":
      return <Brain className="h-4 w-4 text-white" />;
    default:
      return <Bot className="h-4 w-4 text-white" />;
  }
};

export function AgentDashboard() {
  return (
    <div className="space-y-8">
      <SidebarTrigger className="absolute top-4 left-4 z-10"/>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-xl  text-black bg-clip-text  ${pressStart2P.className}`}
          >
            MindCP Neural Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI agents and neural networks
          </p>
        </div>
      <CustomWalletButton
              
            />
      </div>

      {/* Stats Cards */}
      <h2 className="text-xl font-semibold ">Your AI Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <FancyCard
        title="Data Analyst Agent"
        description="Processes and analyzes large datasets using AI models. Ideal for reports, dashboards, and analytics."
        icon={<Bot className="h-5 w-5 text-white" />}
        href="/"
      />

      <FancyCard
        title="Creative Content Agent"
        description="Generates unique content using top models. Perfect for blogs, marketing copy, or idea generation."
        icon={<Zap className="h-5 w-5 text-white" />}
        href="/"
      />

      <FancyCard
        title="Code Assistant Agent"
        description="Helps you debug, refactor, and write clean code with AI-driven suggestions."
        icon={<Brain className="h-5 w-5 text-white" />}
        href="/"
      />
      </div>

      {/* Agents Grid */}
      <div>
        <div className=" space-y-4">
      <h2 className="text-xl font-bold">Getting Started with Your AI Agents</h2>

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
      </div>
    </div>
  );
}

//
