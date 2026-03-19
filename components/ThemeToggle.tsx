"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: "dark" | "light" | "system"; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
      {themes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-md transition-all ${
            theme === value
              ? "bg-primary text-white shadow-glow-sm"
              : "text-muted hover:text-foreground hover:bg-card/50"
          }`}
          title={label}
        >
          <span className="text-xs font-semibold">{label}</span>
        </button>
      ))}
    </div>
  );
}
