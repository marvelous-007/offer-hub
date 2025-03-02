"use client";

import { useThemeStore } from "@/core/store/theme/store";
import { useEffect } from "react";
import { LuMoonStar } from "react-icons/lu";
import { MdOutlineLightMode } from "react-icons/md";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button onClick={() => toggleTheme()}>
      {theme === "dark" ? (
        <MdOutlineLightMode className="text-yellow-700" size={30} />
      ) : (
        <LuMoonStar className="text-gray-700" size={30} />
      )}
    </button>
  );
};

export default ThemeToggle;
