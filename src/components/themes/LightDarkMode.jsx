import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Tippy from "@tippyjs/react";
import ToolTip from "../ui/ToolTip";

const LightDarkMode = ({ onToggle }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      "light",
      "dark",
      "bottelGreen",
      "blue",
      "red",
      "purple"
    );
    html.classList.add(theme);

    const themeSettings = {
      light: { light: "#e3edff", dark: "#2d7dfa" },
      dark: { light: "#fff4e6", dark: "#2b4acb" },
      bottelGreen: { light: "#b2f1e89c", dark: "#007672" },
      blue: { light: "#d2e0fa", dark: "#2b4acb" },
      red: { light: "#fff4e6", dark: "#ff0008" },
      purple: { light: "#ebd7fa", dark: "#642ab5" },
    };

    const selected = themeSettings[theme] || themeSettings.light;
    html.style.setProperty("--light", selected.light);
    html.style.setProperty("--dark", selected.dark);

    localStorage.setItem("theme", theme);
    if (onToggle) onToggle(theme);
  }, [theme, onToggle]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Tippy
        content={theme === "light" ? "Switch to Dark" : "Switch to Light"}
        placement="top"
        arrow={false}
        animation="fade"
        duration={100}
        theme="custom"
      >
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex justify-center items-center rounded-full transition "
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </Tippy>
    </>
  );
};

export default LightDarkMode;
