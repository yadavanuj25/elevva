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
      "orange",
      "midnight_blue_teal",
      "purple"
    );
    html.classList.add(theme);

    const themeSettings = {
      light: { light: "#e3edff", dark: "#25499f" },
      dark: { light: "#e3edff", dark: "#25499f" },
      bottelGreen: { light: "#b2f1e89c", dark: "#007672" },
      orange: { light: "#fff4e6", dark: "#fb6506" },
      midnight_blue_teal: { light: "#badef9", dark: "#07385D" },
      purple: { light: "#ebd7fa", dark: "#800080" },
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
          className="w-8 h-8 flex justify-center items-center rounded-full transition-all hover:scale-125"
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </Tippy>
    </>
  );
};

export default LightDarkMode;

// import React, { useContext } from "react";
// import { Moon, Sun } from "lucide-react";
// import Tippy from "@tippyjs/react";
// import { ThemeContext } from "../../context/ThemeContext";

// const LightDarkMode = () => {
//   const { mode, setMode } = useContext(ThemeContext);

//   const toggleMode = () => {
//     setMode(mode === "light" ? "dark" : "light");
//   };

//   return (
//     <Tippy
//       content={mode === "light" ? "Switch to Dark" : "Switch to Light"}
//       placement="top"
//       arrow={false}
//       animation="fade"
//       duration={100}
//       theme="custom"
//     >
//       <button
//         onClick={toggleMode}
//         className="w-8 h-8 flex justify-center items-center rounded-full transition-all hover:scale-125"
//       >
//         {mode === "light" ? <Moon size={15} /> : <Sun size={15} />}
//       </button>
//     </Tippy>
//   );
// };

// export default LightDarkMode;
