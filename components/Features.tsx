"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Smart Risk Assessment",
    description:
      "Smart algorithms analyze your LinkedIn Games performance and help you stake for the best possible rewards.",
  },
  {
    title: "Instant Rewards",
    description:
      "Get instant rewards based on your LinkedIn Games results. No waiting, no intermediaries.",
  },
  {
    title: "Global Asset Network",
    description:
      "Stake on LinkedIn Games scores with verified, on-chain results. Transparency and fairness guaranteed by blockchain.",
  },
  {
    title: "Real-Time Analytics",
    description:
      "Track your LinkedIn Games stakes, earnings, and performance metrics in real-time with our comprehensive dashboard.",
  },
];

export function Features() {
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
      id="features"
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: bg, color: 'inherit' }}
    >
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Stake on LinkedIn Games?</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Built for LinkedIn Games fans, with secure blockchain technology and instant rewards for your best performances.
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
              className="card-modern bg-white group hover:scale-105 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-primary/40 bg-primary/5 text-primary font-semibold text-xl">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
