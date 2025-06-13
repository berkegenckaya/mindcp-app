"use client"
import { Brain, Zap, Shield, Rocket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "Neural Architecture",
    description: "Advanced AI models trained on cutting-edge neural networks for superior performance and accuracy.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Deploy your AI agents instantly with our quantum-powered infrastructure and real-time scaling.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with end-to-end encryption and decentralized data processing.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Limitless Scale",
    description: "Scale from prototype to production with our adaptive neural network infrastructure.",
    gradient: "from-orange-500 to-red-500",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of AI with our revolutionary neural platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-background/50 backdrop-blur-sm border-white/10 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <CardHeader className="text-center relative">
                <div
                  className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Three Simple Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Agent", description: "Design your AI agent with our intuitive interface" },
              { step: "02", title: "Add Context", description: "Train your agent with domain-specific knowledge" },
              { step: "03", title: "Deploy & Scale", description: "Launch your agent and watch it evolve" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50"></div>
                  )}
                </div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
