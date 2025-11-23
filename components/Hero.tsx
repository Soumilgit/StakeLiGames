"use client";

import { TrendingUp, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="badge-brutal">🏆 AI-Powered Game Staking</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Turn Future Cash Flow Into{" "}
              <span className="text-primary">Instant Liquidity</span>
            </h1>

            <p className="text-xl mb-8 text-gray-700 leading-relaxed">
              Stake on your LinkedIn Games performance using time-based challenges and earn rewards based on real, verified results. 
              Beat the clock, solve flawlessly, and earn up to 35% rewards on Ethereum Sepolia.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#stake" className="btn-brutal text-lg">
                🎯 Get Started
              </a>
              <a href="#how-it-works" className="btn-brutal-secondary text-lg">
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
            <div className="card-brutal bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Protocol Balance</span>
                  <span className="badge-brutal text-xs">LIVE</span>
                </div>
                <div className="text-4xl font-bold">2,408 USDC</div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Your Confidence</div>
                <div className="text-4xl font-bold text-primary">1,808 USDC</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 border-2 border-border">
                  <div className="text-2xl font-bold mb-1">45.00K</div>
                  <div className="text-xs text-gray-600 font-semibold">Active Stakes</div>
                </div>
                <div className="bg-white p-4 border-2 border-border">
                  <div className="text-2xl font-bold mb-1 text-primary">12.30%</div>
                  <div className="text-xs text-gray-600 font-semibold">Success Rate</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border-2 border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary border-2 border-border flex items-center justify-center text-sm">
                      👑
                    </div>
                    <div>
                      <div className="font-bold text-sm">Queens</div>
                      <div className="text-xs text-gray-600">Time: &lt;40 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">+25%</div>
                    <div className="text-xs text-gray-600">Reward</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white border-2 border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary border-2 border-border flex items-center justify-center text-sm">
                      🧗
                    </div>
                    <div>
                      <div className="font-bold text-sm">Crossclimb</div>
                      <div className="text-xs text-gray-600">Time: &lt;50 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-secondary">+25%</div>
                    <div className="text-xs text-gray-600">Reward</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-accent border-2 border-border shadow-brutal flex items-center justify-center text-3xl"
            >
              💎
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
