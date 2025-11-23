"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: "dark" | "light" | "system"; icon: typeof Moon; label: string }> = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-md transition-all ${
            theme === value
              ? "bg-gradient-primary text-white shadow-glow-sm"
              : "text-muted hover:text-foreground hover:bg-card/50"
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
