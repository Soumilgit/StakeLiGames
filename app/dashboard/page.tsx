"use client";

import StakedGamesDashboard from "@/components/StakedGamesDashboard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationBar } from "@/components/NotificationBar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <StakedGamesDashboard />
      </div>
      <NotificationBar />
      <Footer />
    </main>
  );
}
