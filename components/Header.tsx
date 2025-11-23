"use client";

import { useWallet } from "./WalletProvider";
import { Wallet } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { account, connect, disconnect, isConnecting } = useWallet();

  return (
    <header className="sticky top-0 z-50 navbar">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-2xl shadow-glow">
              🎮
            </div>
            <span className="text-2xl font-bold gradient-text">StakeLiGames</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#stake" className="font-medium hover:text-primary transition-colors">
              Stake Now
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {account ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 card-modern border border-border rounded-lg">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <button onClick={disconnect} className="btn-secondary">
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                onClick={connect} 
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
