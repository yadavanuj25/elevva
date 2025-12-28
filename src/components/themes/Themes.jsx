// import { useState, useEffect, useRef } from "react";
// import { Check } from "lucide-react";
// import PageTitle from "../../hooks/PageTitle";
// const colorThemes = [
//   { name: "Default", value: "light", dark: "#25499f", light: "#e3edff" },
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

// const Themes = () => {
//   PageTitle("Elevva | Settings-Themes");
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.remove(
//       "light",
//       "dark",
//       "bottelGreen",
//       "orange",
//       "midnight_blue_teal",
//       "purple"
//     );
//     html.classList.add(theme);

//     const selected = colorThemes.find((t) => t.value === theme);
//     if (selected) {
//       html.style.setProperty("--light", selected.light);
//       html.style.setProperty("--dark", selected.dark);
//     }

//     localStorage.setItem("theme", theme);
//     window.dispatchEvent(new Event("storage"));
//   }, [theme]);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const storedTheme = localStorage.getItem("theme");
//       if (storedTheme && storedTheme !== theme) {
//         setTheme(storedTheme);
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [theme]);

//   const handleTheme = (themeValue) => {
//     setTheme(themeValue);
//     localStorage.setItem("theme", themeValue);
//     window.dispatchEvent(new Event("storage"));
//   };

//   return (
//     <div className="relative bg-white dark:bg-gray-800" ref={dropdownRef}>
//       <div className="right-0 mt-3 border border-gray-300 dark:border-gray-600 rounded-xl z-50 overflow-hidden">
//         <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
//           <h3 className="text-sm font-semibold">Select Theme</h3>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//             Choose a color scheme for your dashboard.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
//           {colorThemes.map((c) => (
//             <button
//               key={c.value}
//               onClick={() => handleTheme(c.value)}
//               className={`relative group flex items-center gap-4 p-2 rounded-lg border transition ${
//                 theme === c.value
//                   ? "border-[var(--dark)] bg-[var(--light)]"
//                   : "border-gray-200 dark:border-gray-700 hover:border-[var(--dark)] hover:bg-gray-50 dark:hover:bg-gray-800"
//               }`}
//             >
//               <span
//                 className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
//                 style={{
//                   backgroundColor: c.value === "dark" ? "black" : c.dark,
//                 }}
//               ></span>
//               <span className="text-md font-semibold text-accent-darkGray dark:text-[#808080]">
//                 {c.name}
//               </span>

//               {theme === c.value && (
//                 <span className="absolute right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow">
//                   <Check size={14} className="text-[var(--dark)]" />
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Themes;

// import React, { useContext } from "react";
// import { Check } from "lucide-react";
// import { ThemeContext } from "../../context/ThemeContext";
// import PageTitle from "../../hooks/PageTitle";

// const Themes = () => {
//   PageTitle("Elevva | Settings-Themes");
//   const { color, setColor, colorThemes } = useContext(ThemeContext);

//   return (
//     <div className="p-6 bg-white dark:bg-gray-800">
//       <h3 className="text-lg font-semibold mb-3">Select Theme Color</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {colorThemes.map((c) => (
//           <button
//             key={c.value}
//             onClick={() => setColor(c.value)}
//             className={`relative flex items-center gap-4 p-3 rounded-lg border transition ${
//               color === c.value
//                 ? "border-[var(--text-color)] bg-[var(--bg-color)]"
//                 : "border-gray-200 hover:border-[var(--text-color)] hover:bg-gray-50 dark:hover:bg-gray-800"
//             }`}
//           >
//             <span
//               className="w-8 h-8 rounded-full border"
//               style={{ backgroundColor: c.dark }}
//             />
//             <span className="font-semibold">{c.name}</span>
//             {color === c.value && (
//               <span className="absolute right-2">
//                 <Check size={16} className="text-[var(--text-color)]" />
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Themes;

import { Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { colorThemes } from "../../contstants/ColorThemes";
import PageTitle from "../../hooks/PageTitle";

const Themes = () => {
  PageTitle("Elevva | Settings-Themes");

  const { color, setColor, theme } = useTheme();

  return (
    <div className="p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-3">Select Theme Color</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colorThemes.map((c) => {
          const preview = c.dark;

          return (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`relative flex items-center gap-4 p-3 rounded-lg border transition ${
                color === c.value
                  ? "border-gray-900 dark:border-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: preview }}
              />

              <span className="font-semibold">{c.name}</span>

              {color === c.value && (
                <span className="absolute right-3">
                  <Check size={16} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Themes;
