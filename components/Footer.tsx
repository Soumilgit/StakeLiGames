"use client";

import Image from "next/image";
import Link from "next/link";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 2.5C7.3 2.5 3.5 6.3 3.5 11c0 3.7 2.4 6.8 5.7 7.9.4.1.5-.2.5-.4v-1.6c-2.3.5-2.8-1.1-2.8-1.1-.3-.9-.8-1.2-.8-1.2-.7-.5.1-.5.1-.5.8.1 1.2.9 1.2.9.7 1.2 1.9.8 2.4.6.1-.5.3-.8.5-1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.2-.3 1.8-.3.6 0 1.2.1 1.8.3 1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.6-3.6 3.9.3.3.5.8.5 1.6v2.3c0 .2.1.5.5.4 3.3-1.1 5.7-4.2 5.7-7.9C20.5 6.3 16.7 2.5 12 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M20.4 4.1L3.7 10.5c-1.1.4-1.1 1.3-.2 1.6l4.3 1.3 1.7 5.2c.2.5.4.7.8.7.4 0 .6-.2.9-.5l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8l2.7-12.8c.3-1.2-.4-1.8-1.6-1.3zM9.4 16.7l-.3-3.2 7.3-6.1-8.9 5.1"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="card-modern border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center bg-background overflow-hidden">
                <Image
                  src="/favicon.jpg"
                  alt="StakeLiGames"
                  width={28}
                  height={28}
                  className="rounded-md object-cover"
                />
              </div>
              <span className="text-xl font-bold">StakeLiGames</span>
            </div>
            <p className="text-sm text-muted">
              Stake on your LinkedIn Games performance and earn real rewards, powered by Ethereum blockchain.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-muted hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-muted hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#stake" className="text-muted hover:text-primary transition-colors">
                  Start Staking
                </Link>
              </li>
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
                href="https://x.com/SoumilMukh6476/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-14 h-14 rounded-lg border border-border bg-card text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all text-sm"
              >
                <i className="fa-brands fa-x-twitter text-2xl" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/Soumilgit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-14 h-14 rounded-lg border border-border bg-card text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all text-sm"
              >
                <GithubIcon className="w-8 h-8" />
              </a>
              <a
                href="https://t.me/soumilmuk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-14 h-14 rounded-lg border border-border bg-card text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all text-sm"
              >
                <TelegramIcon className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted bg-transparent">
          <p>© 2025 StakeLiGames. Built for LinkedIn Games fans on Ethereum blockchain.</p>
          <p className="mt-2">
            Developed by{" "}
            <a href="https://soumilm.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Soumil Mukhopadhyay
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
