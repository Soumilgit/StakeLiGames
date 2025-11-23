"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Link your Pera or Defly wallet to access the Algorand testnet. Get free test USDC instantly.",
    emoji: "👛",
  },
  {
    number: "02",
    title: "Choose Your Game",
    description: "Select a LinkedIn Game (Queens, Crossword, etc.) and set your target score for staking.",
    emoji: "🎮",
  },
  {
    number: "03",
    title: "Stake Your USDC",
    description: "Lock in your stake amount. The smart contract securely holds your funds until game completion.",
    emoji: "💰",
  },
  {
    number: "04",
    title: "Play & Verify",
    description: "Complete the game and verify your score. If you meet the target, earn 20% APY on your stake!",
    emoji: "🏆",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white border-y-4 border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ready to Transform Your Cash Flow?</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Join thousands of gamers and investors who trust StakeLiGames for their gaming confidence needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="card-brutal h-full">
                <div className="text-6xl mb-4">{step.emoji}</div>
                <div className="text-sm font-bold text-gray-500 mb-2">STEP {step.number}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
