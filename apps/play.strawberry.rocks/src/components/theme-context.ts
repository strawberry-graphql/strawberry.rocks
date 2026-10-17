import { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeContextValue = {
  theme: Theme;
  actualTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
