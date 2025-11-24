"use client";
import { useEffect, useState } from "react";

export function NotificationBar() {
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);
  useEffect(() => {
    const handler = (e: any) => {
      setNotification(e.detail);
      setTimeout(() => setNotification(null), 5000);
    };
    window.addEventListener("notify", handler);
    return () => window.removeEventListener("notify", handler);
  }, []);
  if (!notification) return null;
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${notification.type === "success" ? "bg-green-600" : notification.type === "error" ? "bg-red-600" : "bg-blue-600"}`}>
      {notification.message}
    </div>
  );
}