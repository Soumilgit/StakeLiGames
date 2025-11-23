"use client";

import { useWallet } from "./WalletProvider";
import { Wallet } from "lucide-react";

export function Header() {
  const { account, connect, disconnect, isConnecting } = useWallet();

  return (
    <header className="sticky top-0 z-50 bg-background border-b-4 border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary border-2 border-border flex items-center justify-center font-bold text-xl">
              🎮
            </div>
            <span className="text-2xl font-bold">StakeLiGames</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-semibold hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-semibold hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#stake" className="font-semibold hover:text-primary transition-colors">
              Stake Now
            </a>
          </nav>

          {account ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border-2 border-border shadow-brutal-sm">
                <Wallet className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              <button onClick={disconnect} className="btn-brutal-secondary">
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connect} 
              disabled={isConnecting}
              className="btn-brutal flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
