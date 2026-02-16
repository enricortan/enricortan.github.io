import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then default to dark mode
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return saved === "true";
    }
    // Default to dark mode instead of system preference
    return true;
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem("darkMode", isDarkMode.toString());
    
    // Update document class for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
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