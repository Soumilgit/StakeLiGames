"use client";

import { Twitter, Github, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="card-modern border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-2xl shadow-glow">
                🎮
              </div>
              <span className="text-xl font-bold gradient-text">StakeLiGames</span>
            </div>
            <p className="text-sm text-muted">
              The on-chain confidence market powered by Ethereum blockchain.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-muted hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#stake" className="text-muted hover:text-primary transition-colors">Start Staking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://ethereum.org/en/developers/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">Ethereum Docs</a></li>
              <li><a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">Sepolia Explorer</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center hover:shadow-glow hover:scale-110 transition-all"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center hover:shadow-glow-accent hover:scale-110 transition-all"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center hover:shadow-glow hover:scale-110 transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted bg-transparent">
          <p>© 2025 StakeLiGames. Built with ❤️ on Ethereum blockchain.</p>
          <p className="mt-2">
            Developed by{" "}
            <a href="https://github.com/Soumilgit" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Soumil Mukhopadhyay
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
