import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState();

  useEffect(() => {
    const saved = localStorage.getItem('appTheme') || 'system'
    setTheme(saved)
  }, []);

  useEffect(() => {
    if (theme) {
        const root = document.getElementById("root");

        root.classList.remove('light', 'dark', 'system');
        root.classList.add(theme);
        localStorage.setItem('appTheme', theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
