// import { colorThemes } from "../../contstants/ColorThemes";
// import { useTheme } from "../../context/ThemeContext";

// const ColorPicker = () => {
//   const { color, setColor, theme } = useTheme();

//   return (
//     <div className="flex gap-3 flex-wrap">
//       {colorThemes.map((c) => {
//         const previewColor = theme === "dark" ? c.dark : c.light;

//         return (
//           <button
//             key={c.value}
//             onClick={() => setColor(c.value)}
//             className={`w-10 h-10 rounded-full border-2 transition ${
//               color === c.value
//                 ? "border-black dark:border-white"
//                 : "border-transparent"
//             }`}
//             style={{ backgroundColor: previewColor }}
//             title={c.name}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default ColorPicker;

import { colorThemes } from "../../contstants/ColorThemes";
import { useTheme } from "../../context/ThemeContext";

const ColorPicker = () => {
  const { color, setColor, theme } = useTheme();

  return (
    <div className="flex gap-3 flex-wrap">
      {colorThemes.map((c) => {
        const previewColor = c.dark;

        return (
          <button
            key={c.value}
            onClick={() => setColor(c.value)}
            className={`w-10 h-10 rounded-full border-2 transition ${
              color === c.value
                ? "border-black dark:border-white"
                : "border-transparent"
            }`}
            style={{ backgroundColor: previewColor }}
            title={c.name}
          />
        );
      })}
    </div>
  );
};

export default ColorPicker;
