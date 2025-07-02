import { Info, Bot, Brain, Zap, Shield, BarChart, Code, Palette } from 'lucide-react'

type ModelCardProps = {
  id: number
  name: string
  description: string
  type: string
  status: "active" | "idle" | "training"
  tools: string[]
  capabilities: string[]
  createdAt: string
  href?: string
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "analytics":
      return <BarChart className="w-5 h-5 text-white" />
    case "creative":
      return <Palette className="w-5 h-5 text-white" />
    case "development":
      return <Code className="w-5 h-5 text-white" />
    case "security":
      return <Shield className="w-5 h-5 text-white" />
    case "automation":
      return <Zap className="w-5 h-5 text-white" />
    default:
      return <Bot className="w-5 h-5 text-white" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "idle":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "training":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function ModelCard({ id, name, description, type, status, tools, capabilities, createdAt, href }: ModelCardProps) {
  const CardContent = () => (
    <div className="relative overflow-hidden group rounded-2xl h-64 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-6">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {status}
        </div>
      </div>

      {/* Type Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:from-white/20 group-hover:to-white/10 group-hover:border-white/30 transition-all duration-300">
          {getTypeIcon(type)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{description}</p>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {capabilities.slice(0, 2).map((capability) => (
            <span
              key={capability}
              className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-white text-xs font-medium border border-white/20"
            >
              {capability}
            </span>
          ))}
          {capabilities.length > 2 && (
            <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-white text-xs font-medium border border-white/20">
              +{capabilities.length - 2}
            </span>
          )}
        </div>

        {/* Tools count */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{tools.length} tools integrated</span>
          <span>Created {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:via-white/3 group-hover:to-white/8 transition-all duration-500" />
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        <CardContent />
      </a>
    )
  }

  return <CardContent />
}
