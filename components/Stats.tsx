"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Total Value Locked", value: "$2.4M" },
  { label: "Active Stakers", value: "45.00K" },
  { label: "Average APY", value: "12.30%" },
  { label: "Games Completed", value: "128K" },
];

export function Stats() {
  return (
    <section className="py-16 bg-white border-y-4 border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-brutal text-center"
            >
              <div className="w-12 h-12 border-2 border-primary/40 bg-primary/5 flex items-center justify-center mx-auto mb-4 text-primary font-semibold text-sm">
                KPI
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
