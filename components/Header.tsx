"use client";

import { useWallet } from "./WalletProvider";
import { Wallet } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { account, connect, disconnect, isConnecting, chainId, switchToSepolia } = useWallet();

  return (
    <header className="sticky top-0 z-50 navbar">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
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

          {/* Responsive wallet controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <ThemeToggle />
            {/* Network display and switch */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded bg-card border border-border"
                style={{ color: 'white', backgroundColor: '#222', borderColor: '#444' }}
              >
                Network: {chainId === "11155111" ? "Sepolia" : chainId === "1" ? "Ethereum" : chainId ? `Chain ${chainId}` : "Unknown"}
              </span>
              {chainId !== "11155111" && (
                <button
                  onClick={switchToSepolia}
                  className="btn-secondary text-xs px-2 py-1 ml-2"
                  style={{ color: 'white', backgroundColor: '#222', borderColor: '#444' }}
                >
                  Switch to Sepolia
                </button>
              )}
            </div>
            {account ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 card-modern border border-border rounded-lg w-full sm:w-auto justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm truncate max-w-[120px] sm:max-w-none">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <button onClick={disconnect} className="btn-secondary w-full sm:w-auto">
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                onClick={connect} 
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
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
