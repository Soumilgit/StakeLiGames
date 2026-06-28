"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "dark" | "light";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("dark");

  // On initial mount, detect cached theme or system theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const override = sessionStorage.getItem("portfolio-theme-override") === "true";
      let initialTheme: Theme = "system";

      if (override) {
        const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
        if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
          initialTheme = savedTheme;
        }
      }

      setTheme(initialTheme);
    }
  }, []);

  // Update DOM classes and listen for live system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    const updateDOM = () => {
      let newEffectiveTheme: "dark" | "light" = "dark";
      if (theme === "system") {
        if (typeof window !== "undefined" && window.matchMedia) {
          const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
          const mqLight = window.matchMedia("(prefers-color-scheme: light)");
          if (mqDark.matches) {
            newEffectiveTheme = "dark";
          } else if (mqLight.matches) {
            newEffectiveTheme = "light";
          } else {
            newEffectiveTheme = "dark"; // Default fallback if no system preference is set
          }
        } else {
          newEffectiveTheme = "dark"; // Default fallback if matchMedia is unsupported
        }
      } else {
        newEffectiveTheme = theme === "dark" ? "dark" : "light";
      }

      setEffectiveTheme(newEffectiveTheme);
      root.classList.remove("light", "dark");
      root.classList.add(newEffectiveTheme);
      root.style.colorScheme = newEffectiveTheme;
    };

    updateDOM();

    // Live system theme switching listener
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        // When system theme changes, automatically update and remove manual override
        sessionStorage.removeItem("portfolio-theme-override");
        setTheme("system");
        updateDOM();
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Wrapper for manual toggle
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-theme", newTheme);
      if (newTheme === "system") {
        sessionStorage.removeItem("portfolio-theme-override");
      } else {
        sessionStorage.setItem("portfolio-theme-override", "true");
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
