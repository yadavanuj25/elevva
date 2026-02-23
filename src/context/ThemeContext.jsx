import { createContext, useContext, useEffect, useState } from "react";
import { colorThemes } from "../contstants/theme/ColorThemes";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [color, setColor] = useState(localStorage.getItem("color") || "light");

  useEffect(() => {
    const html = document.documentElement;
    // html.classList.toggle("dark", theme === "dark");
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    const selectedColor = colorThemes.find((c) => c.value === color);
    if (selectedColor) {
      html.style.setProperty("--accent-dark", selectedColor.dark);
      html.style.setProperty("--accent-light", selectedColor.light);
      html.style.setProperty(
        "--accent-color",
        theme === "dark" ? selectedColor.dark : selectedColor.light,
      );
    }

    localStorage.setItem("theme", theme);
    localStorage.setItem("color", color);
  }, [theme, color]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
