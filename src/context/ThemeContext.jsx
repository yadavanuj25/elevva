// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const colorThemes = [
  { name: "Light", value: "light", dark: "#25499f", light: "#e3edff" },
  { name: "Dark", value: "dark", dark: "#25499f", light: "#e3edff" },
  {
    name: "Bottle Green",
    value: "bottelGreen",
    dark: "#007672",
    light: "#b2f1e89c",
  },
  { name: "Orange", value: "orange", dark: "#fb6506", light: "#fff4e6" },
  {
    name: "Midnight Blue Teal",
    value: "midnight_blue_teal",
    dark: "#07385D",
    light: "#badef9",
  },
  { name: "Purple", value: "purple", dark: "#800080", light: "#ebd7fa" },
];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light"); // light/dark
  const [color, setColor] = useState(localStorage.getItem("color") || "light"); // theme color

  useEffect(() => {
    const html = document.documentElement;

    // remove all color classes
    html.classList.remove(...colorThemes.map((t) => t.value));
    html.classList.add(color); // color class

    // set CSS vars based on mode and color
    const selected =
      colorThemes.find((t) => t.value === color) || colorThemes[0];
    if (mode === "light") {
      html.style.setProperty("--bg-color", selected.light);
      html.style.setProperty("--text-color", "#000");
    } else {
      html.style.setProperty("--bg-color", selected.dark);
      html.style.setProperty("--text-color", "#fff");
    }

    localStorage.setItem("mode", mode);
    localStorage.setItem("color", color);
  }, [mode, color]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        color,
        setColor,
        colorThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
