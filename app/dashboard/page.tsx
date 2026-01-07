"use client";

import StakedGamesDashboard from "@/components/StakedGamesDashboard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationBar } from "@/components/NotificationBar";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="border-b border-transparent bg-transparent">
        <div className="container mx-auto px-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-600 text-sm font-medium text-black dark:text-white hover:bg-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-200" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <StakedGamesDashboard />
      </div>
      <NotificationBar />
      <Footer />
    </main>
  );
}
