"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWallet } from "./WalletProvider";

type Step = "connect" | "wallet" | "get-started" | "stake" | "dashboard" | "submit" | "play" | "score" | "submit-score" | "result" | "analytics" | "done";
const KEY = "stakeligames-journey-step";
const messages: Record<Step, string> = {
  connect: "Connect your wallet to create a stake and submit game results.",
  wallet: "Finish the connection in your wallet provider. We will continue when it is connected.",
  "get-started": "Choose a game, set your stake and target, and create your challenge.",
  stake: "Choose your game, enter a stake and target, then create your stake. Confirm any approval or transaction prompts in your wallet.",
  dashboard: "Your stake is set. Open the dashboard to find it and submit a result after playing.",
  submit: "Open Submit Result for your pending stake.",
  play: "Play Now opens the game in a new tab. Return here when you have your score.",
  score: "Enter the score or time from your completed game, then submit it for verification.",
  "submit-score": "Submit this score for verification. Confirm the transaction in your wallet if prompted.",
  result: "Your result is back on the dashboard. Check whether it was marked Won or Lost.",
  analytics: "The chart summarizes results across your staked games.",
  done: "",
};

function currentStep(): Step {
  return (localStorage.getItem(KEY) as Step) || "connect";
}

export function advanceJourney(step: Step, result?: string, gameId?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, step);
  if (result) localStorage.setItem("stakeligames-last-result", result);
  if (gameId) localStorage.setItem("stakeligames-last-game", gameId);
  window.dispatchEvent(new Event("stakeligames-journey"));
}

export function JourneyGuide() {
  const pathname = usePathname();
  const { account } = useWallet();
  const [step, setStep] = useState<Step>("connect");
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const sync = () => setStep(currentStep());
    sync();
    window.addEventListener("stakeligames-journey", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("stakeligames-journey", sync); window.removeEventListener("storage", sync); };
  }, []);

  useEffect(() => {
    if (account && (step === "connect" || step === "wallet")) advanceJourney("get-started");
  }, [account, step]);

  const target = step === "connect" || step === "wallet" ? "wallet-connect"
    : step === "get-started" ? "get-started"
    : step === "stake" ? "stake-submit"
    : step === "dashboard" ? "open-dashboard"
    : step === "submit" ? "submit-result"
    : step === "play" ? "game-play"
    : step === "score" ? "game-score"
    : step === "submit-score" ? "game-submit"
    : step === "result" ? "result-status"
    : step === "analytics" ? "results-chart" : "";

  const reposition = useCallback(() => {
    setViewport({ width: window.innerWidth, height: window.innerHeight });
    const node = target ? Array.from(document.querySelectorAll<HTMLElement>(`[data-tour-id="${target}"]`)).find((item) => item.getClientRects().length > 0 && getComputedStyle(item).visibility !== "hidden") : null;
    if (!node || !node.getClientRects().length) { setRect(null); return; }
    const box = node.getBoundingClientRect();
    setRect(box);
    if (box.top < 12 || box.bottom > window.innerHeight - 12) {
      node.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }
  }, [target]);

  useEffect(() => {
    if (!target || step === "done") { setRect(null); return; }
    const frame = requestAnimationFrame(reposition);
    const observer = new MutationObserver(reposition);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); };
  }, [target, step, pathname, reposition]);

  useEffect(() => {
    if (step !== "submit" || pathname !== "/dashboard") return;
    const timer = window.setTimeout(reposition, 700);
    return () => window.clearTimeout(timer);
  }, [step, pathname, reposition]);

  useEffect(() => {
    if (step !== "result" || pathname !== "/dashboard") return;
    const timer = window.setTimeout(() => advanceJourney("analytics"), 4500);
    return () => window.clearTimeout(timer);
  }, [step, pathname]);

  useEffect(() => {
    const capture = (event: MouseEvent) => {
      const node = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-tour-id]");
      if (!node || node.dataset.tourId !== target) return;
      if (step === "connect") advanceJourney("wallet");
      else if (step === "get-started") advanceJourney("stake");
      else if (step === "dashboard") advanceJourney("submit");
      else if (step === "submit") advanceJourney("play");
      else if (step === "play") advanceJourney("score");
    };
    document.addEventListener("click", capture, true);
    const scoreEntered = (event: Event) => {
      const node = event.target as HTMLElement | null;
      if (step === "score" && node?.dataset.tourId === "game-score" && (node as HTMLInputElement).value) advanceJourney("submit-score");
    };
    document.addEventListener("input", scoreEntered, true);
    return () => { document.removeEventListener("click", capture, true); document.removeEventListener("input", scoreEntered, true); };
  }, [step, target]);

  if (!target || !rect || step === "done" || !viewport.width) return null;
  const cardWidth = Math.min(300, viewport.width - 24);
  const left = Math.max(12, Math.min(rect.left + rect.width / 2 - cardWidth / 2, viewport.width - cardWidth - 12));
  const below = rect.bottom + 140 < viewport.height;
  const top = below ? rect.bottom + 12 : Math.max(12, rect.top - 132);
  return <>
    <div aria-hidden="true" className="journey-dimmer" style={{ maskImage: `radial-gradient(ellipse ${rect.width / 2 + 10}px ${rect.height / 2 + 10}px at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent 98%, black 102%)` }} />
    <div role="status" aria-live="polite" className="journey-card" style={{ left, top, width: cardWidth }}>
      <p>{messages[step]}</p>
      <button type="button" onClick={() => advanceJourney("done")} aria-label="Dismiss onboarding guide">Dismiss</button>
    </div>
  </>;
}
