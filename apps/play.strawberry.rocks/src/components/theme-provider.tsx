import { ThemeContext, type Theme } from "./theme-context";
import { useEffect, useState, useSyncExternalStore } from "react";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const subscribeToSystemTheme = (onChange: () => void) => {
  darkQuery.addEventListener("change", onChange);

  return () => darkQuery.removeEventListener("change", onChange);
};

const getSystemTheme = () => (darkQuery.matches ? "dark" : "light");

const readStoredTheme = (storageKey: string): Theme | null => {
  try {
    return localStorage.getItem(storageKey) as Theme | null;
  } catch {
    return null;
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => readStoredTheme(storageKey) ?? defaultTheme
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme
  );
  const actualTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
  }, [actualTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        setTheme: (theme: Theme) => {
          try {
            localStorage.setItem(storageKey, theme);
          } catch {
            // Storage can be unavailable, e.g. in private windows
          }

          setTheme(theme);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
