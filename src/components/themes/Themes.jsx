import { Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { colorThemes } from "../../contstants/ColorThemes";
import PageTitle from "../../hooks/PageTitle";

const Themes = () => {
  PageTitle("Elevva | Themes");

  const { color, setColor, theme } = useTheme();

  return (
    <div className="p-4 border border-[#E8E8E9] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
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
                  ? "border-accent-dark "
                  : "border-[#E8E8E9] dark:border-gray-600 hover:border-gray-900"
              }`}
            >
              <span
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: preview }}
              />

              <span className="font-semibold">{c.name}</span>

              {color === c.value && (
                <span className="absolute right-3 p-1 rounded-full text-accent-dark border border-accent-dark bg-accent-light">
                  <Check size={14} />
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
