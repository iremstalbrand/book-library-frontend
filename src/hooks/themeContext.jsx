import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(!dark) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
