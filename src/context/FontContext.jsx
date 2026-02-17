import { createContext, useContext, useEffect, useState } from "react";
import { fontFamilies } from "../contstants/fonts";

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [font, setFontState] = useState(
    () => localStorage.getItem("elevva-font") || "golos",
  );

  const setFont = (value) => {
    setFontState(value);
    localStorage.setItem("elevva-font", value);
  };

  useEffect(() => {
    const selected = fontFamilies.find((f) => f.value === font);
    if (selected) {
      document.documentElement.style.setProperty(
        "--font-family",
        selected.fontFamily,
      );
    }
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
