"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Link your MetaMask wallet to access the Ethereum Sepolia testnet. Get free test ETH and USDC instantly.",
    emoji: "👛",
  },
  {
    number: "02",
    title: "Choose Your LinkedIn Game",
    description: "Select a LinkedIn Game (Queens, Crossclimb, etc.) and set your target time for staking.",
    emoji: "🎮",
  },
  {
    number: "03",
    title: "Stake Your USDC",
    description: "Lock in your stake amount. The smart contract securely holds your funds until your LinkedIn Game is complete.",
    emoji: "💰",
  },
  {
    number: "04",
    title: "Play & Verify",
    description: "Complete your LinkedIn Game and verify your time. If you meet the target, earn up to 35% rewards on your stake!",
    emoji: "🏆",
  },
];

import { useEffect, useState } from "react";

export function HowItWorks() {
  const [bg, setBg] = useState('white');
  useEffect(() => {
    const html = document.documentElement;
    const updateBg = () => {
      setBg(html.classList.contains('dark') ? '#0a0a0f' : 'white');
    };
    updateBg();
    const observer = new MutationObserver(updateBg);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="how-it-works"
      className="py-20 border-y border-border"
      style={{ backgroundColor: bg, color: 'inherit' }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ready to Transform Your Cash Flow?</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Join the LinkedIn Games community and stake on your skills for real rewards.
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
              <div className="card-modern bg-white h-full hover:shadow-glow transition-all">
                <div className="text-6xl mb-4">{step.emoji}</div>
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-bold text-primary mb-3">
                  STEP {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-2xl text-primary">
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
