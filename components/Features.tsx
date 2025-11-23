"use client";

import { Shield, Zap, TrendingUp, Lock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "AI-Powered Risk Assessment",
    description: "Advanced algorithms evaluate your gaming performance and calculate optimal stake amounts for maximum returns.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Instant Liquidity",
    description: "Get immediate access to funds based on your future game performance. No waiting, no intermediaries.",
    color: "bg-secondary",
  },
  {
    icon: TrendingUp,
    title: "Global Asset Network",
    description: "Stake on LinkedIn Games scores with verified, on-chain results. Transparency guaranteed by blockchain.",
    color: "bg-accent",
  },
  {
    icon: Lock,
    title: "Real-Time Analytics",
    description: "Track your stakes, earnings, and performance metrics in real-time with our comprehensive dashboard.",
    color: "bg-primary",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Choose StakeLiGames?</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Built on cutting-edge blockchain technology with AI-powered risk assessment and instant liquidity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-brutal group hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all duration-200"
            >
              <div className={`w-16 h-16 ${feature.color} border-2 border-border flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
