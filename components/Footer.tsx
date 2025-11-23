"use client";

import { Twitter, Github, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary border-2 border-background flex items-center justify-center font-bold text-xl text-foreground">
                🎮
              </div>
              <span className="text-xl font-bold">StakeLiGames</span>
            </div>
            <p className="text-sm text-gray-400">
              The on-chain confidence market powered by Algorand blockchain.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#stake" className="text-gray-400 hover:text-primary transition-colors">Start Staking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://developer.algorand.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">Algorand Docs</a></li>
              <li><a href="https://testnet.algoexplorer.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">Testnet Explorer</a></li>
              <li><a href="https://github.com/algorand" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary border-2 border-background flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                <Twitter className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary border-2 border-background flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                <Github className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary border-2 border-background flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                <Send className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 StakeLiGames. Built with ❤️ on Algorand blockchain.</p>
          <p className="mt-2">
            Powered by{" "}
            <a href="https://firstdollar.money/SoumilMukh6476" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              FirstDollar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
