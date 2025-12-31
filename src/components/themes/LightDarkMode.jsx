import { Moon, Sun } from "lucide-react";
import Tippy from "@tippyjs/react";
import { useTheme } from "../../context/ThemeContext";

const LightDarkMode = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Tippy
      content={theme === "light" ? "Switch to Dark" : "Switch to Light"}
      placement="top"
      arrow={false}
      animation="fade"
      duration={100}
      theme="custom"
    >
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-8 h-8 flex justify-center items-center rounded-full transition-all hover:scale-125"
      >
        {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
      </button>
    </Tippy>
  );
};

export default LightDarkMode;
