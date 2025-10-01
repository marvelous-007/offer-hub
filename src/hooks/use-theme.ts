"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "offer-hub-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  // Update theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const setLightTheme = () => {
    setTheme("light");
    localStorage.setItem(THEME_KEY, "light");
    document.documentElement.classList.remove("dark");
  };

  const setDarkTheme = () => {
    setTheme("dark");
    localStorage.setItem(THEME_KEY, "dark");
    document.documentElement.classList.add("dark");
  };

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    mounted,
  };
}
