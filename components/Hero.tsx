"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Subtle radial highlight using brand blue */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-40" />
      
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

            <div className="flex flex-wrap gap-4 items-center">
              <a href="#stake" className="btn-primary text-lg">
                Get Started
              </a>

              <a href="#how-it-works" className="btn-secondary text-lg">
                Learn More
              </a>

              {/* Product Hunt featured badge - placed inline with Learn More */}
              <a
                href="https://www.producthunt.com/products/stakeligames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-stakeligames"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block ml-2"
                aria-label="StakeLiGames on Product Hunt"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044696&theme=neutral&t=1764664965863"
                  alt="StakeLiGames - Product Hunt"
                  width={250}
                  height={54}
                  style={{ width: 250, height: 54 }}
                />
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
                  <span className="text-sm font-semibold text-muted">Total Value Staked</span>
                  <span className="badge-modern text-xs bg-primary/10 text-primary border-primary/30">
                    LIVE
                  </span>
                </div>
                <div className="text-4xl font-bold text-primary">24,080 USDC</div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-muted mb-2">Your Active Stakes</div>
                <div className="text-4xl font-bold">3,250 USDC</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card/50 p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold mb-1">62</div>
                  <div className="text-xs text-muted font-medium">Games currently live</div>
                </div>
                <div className="bg-card/50 p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold mb-1 text-primary">94.2%</div>
                  <div className="text-xs text-muted font-medium">Verified win payouts</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center">
                      <Image
                        src="/queens.jpg"
                        alt="Queens"
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Queens</div>
                      <div className="text-xs text-muted">Time: &lt;40 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">3,600 USDC</div>
                    <div className="text-xs text-muted">Total pool</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center">
                      <Image
                        src="/crossclimb.jpg"
                        alt="Crossclimb"
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Crossclimb</div>
                      <div className="text-xs text-muted">Time: &lt;50 sec</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">2,140 USDC</div>
                    <div className="text-xs text-muted">Total pool</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
