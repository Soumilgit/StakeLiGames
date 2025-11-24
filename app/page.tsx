"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { StakingInterface } from "@/components/StakingInterface";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { NotificationBar } from "@/components/NotificationBar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <StakingInterface />
      <div className="flex justify-center mt-4">
        <Link href="/dashboard">
          <button className="btn-primary">Open Dashboard</button>
        </Link>
      </div>
      <NotificationBar />
      <Footer />
    </main>
  );
}