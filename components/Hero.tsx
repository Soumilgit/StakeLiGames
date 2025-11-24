"use client";

import { TrendingUp, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="badge-modern">LinkedIn Games Staking</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Turn Future Cash Flow Into{" "}
              <span className="gradient-text">Instant LinkedIn Rewards</span>
            </h1>

            <p className="text-xl mb-8 text-muted leading-relaxed">
              Stake on your LinkedIn Games performance using time-based challenges and earn rewards based on real, verified results. 
              Beat the clock, solve flawlessly, and earn up to 35% rewards on Ethereum Sepolia.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#stake" className="btn-primary text-lg">
                🎯 Get Started
              </a>
              <a href="#how-it-works" className="btn-secondary text-lg">
                📚 Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="card-modern">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-muted">Protocol Balance</span>
                  <span className="badge-modern text-xs">LIVE</span>
                </div>
                <div className="text-4xl font-bold">2,408 USDC</div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-muted mb-2">Your LinkedIn Game Skill</div>
                <div className="text-4xl font-bold gradient-text">1,808 USDC</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card/50 p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold mb-1">45.00K</div>
                  <div className="text-xs text-muted font-medium">Active Stakes</div>
                </div>
                <div className="bg-card/50 p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold mb-1 text-accent">12.30%</div>
                  <div className="text-xs text-muted font-medium">Success Rate</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-sm shadow-glow-sm">
                      👑
                    </div>
                    <div>
                      <div className="font-bold text-sm">Queens</div>
                      <div className="text-xs text-muted">Time: &lt;40 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">+25%</div>
                    <div className="text-xs text-muted">Reward</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center text-sm shadow-glow-accent">
                      🧗
                    </div>
                    <div>
                      <div className="font-bold text-sm">Crossclimb</div>
                      <div className="text-xs text-muted">Time: &lt;50 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-secondary">+25%</div>
                    <div className="text-xs text-muted">Reward</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-accent rounded-xl shadow-glow-lg flex items-center justify-center text-3xl"
            >
              💎
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
