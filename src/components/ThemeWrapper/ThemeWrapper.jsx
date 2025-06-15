"use client";

import { useEffect } from "react";

export default function ThemeWrapper({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  return <>{children}</>;
}
