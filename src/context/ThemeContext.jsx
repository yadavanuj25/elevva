// import { createContext, useContext, useEffect, useState } from "react";
// import { colorThemes } from "../contstants/ColorThemes";

// const ThemeContext = createContext(null);

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   const [color, setColor] = useState(localStorage.getItem("color") || "orange");

//   useEffect(() => {
//     const html = document.documentElement;

//     // Light / Dark
//     html.classList.toggle("dark", theme === "dark");

//     // Accent Color
//     const selectedColor = colorThemes.find((c) => c.value === color);
//     if (selectedColor) {
//       html.style.setProperty(
//         "--accent-color",
//         theme === "dark" ? selectedColor.dark : selectedColor.light
//       );
//     }

//     localStorage.setItem("theme", theme);
//     localStorage.setItem("color", color);
//   }, [theme, color]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, color, setColor }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
//   return ctx;
// };

// Above is working code

import { createContext, useContext, useEffect, useState } from "react";
import { colorThemes } from "../contstants/ColorThemes";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [color, setColor] = useState(localStorage.getItem("color") || "light");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", theme === "dark");
    const selectedColor = colorThemes.find((c) => c.value === color);
    if (selectedColor) {
      html.style.setProperty("--accent-dark", selectedColor.dark);
      html.style.setProperty("--accent-light", selectedColor.light);
      html.style.setProperty(
        "--accent-color",
        theme === "dark" ? selectedColor.dark : selectedColor.light
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

// import { createContext, useContext, useEffect, useState } from "react";
// import { colorThemes } from "../contstants/ColorThemes";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   const [color, setColor] = useState(localStorage.getItem("color") || "orange");

//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.toggle("dark", theme === "dark");
//     const selectedColor = colorThemes.find((c) => c.value === color);

//     if (selectedColor) {
//       const accent =
//         theme === "dark" ? selectedColor.dark : selectedColor.light;

//       html.style.setProperty("--accent-color", accent);
//     }

//     localStorage.setItem("theme", theme);
//     localStorage.setItem("color", color);
//   }, [theme, color]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, color, setColor }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

//   Old code

// import React, { createContext, useState, useEffect } from "react";

// export const ThemeContext = createContext();

// const colorThemes = [
//   { name: "Light", value: "light", dark: "#25499f", light: "#e3edff" },
//   { name: "Dark", value: "dark", dark: "#25499f", light: "#e3edff" },
//   {
//     name: "Bottle Green",
//     value: "bottelGreen",
//     dark: "#007672",
//     light: "#d3f6f19c",
//   },
//   { name: "Orange", value: "orange", dark: "#fb6506", light: "#fff4e6" },
//   {
//     name: "Midnight Blue Teal",
//     value: "midnight_blue_teal",
//     dark: "#07385D",
//     light: "#badef9",
//   },
//   { name: "Purple", value: "purple", dark: "#800080", light: "#ebd7fa" },
// ];

// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
//   const [color, setColor] = useState(localStorage.getItem("color") || "light");

//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.remove(...colorThemes.map((t) => t.value));
//     html.classList.add(color);
//     const selected =
//       colorThemes.find((t) => t.value === color) || colorThemes[0];
//     if (mode === "light") {
//       html.style.setProperty("--bg-color", selected.light);
//       html.style.setProperty("--text-color", "#000");
//     } else {
//       html.style.setProperty("--bg-color", selected.dark);
//       html.style.setProperty("--text-color", "#fff");
//     }

//     localStorage.setItem("mode", mode);
//     localStorage.setItem("color", color);
//   }, [mode, color]);

//   return (
//     <ThemeContext.Provider
//       value={{
//         mode,
//         setMode,
//         color,
//         setColor,
//         colorThemes,
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };
