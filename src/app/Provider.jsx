"use client";

import { createContext, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export const ThemeContext = createContext();

export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") === "dark";
      setIsDarkMode(savedTheme);
      setIsThemeLoaded(true);
      document.documentElement.classList.toggle("dark", savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (!isThemeLoaded) {
    return null; // Empêche le rendu tant que le thème n’est pas chargé
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
