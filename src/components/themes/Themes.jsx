import { Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { colorThemes } from "../../contstants/ColorThemes";
import { fontFamilies } from "../../contstants/fonts";
import PageTitle from "../../hooks/PageTitle";
import { useFont } from "../../context/FontContext";

const Themes = () => {
  PageTitle("Elevva | Themes");

  const { color, setColor } = useTheme();
  const { font, setFont } = useFont();

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#E8E8E9] dark:border-gray-600 rounded-xl shadow-md hover:shadow-lg bg-white dark:bg-gray-800">
        <div className="pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 ">
            Appearance
          </p>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Select Theme
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colorThemes.map((c) => {
            const preview = c.dark;

            return (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`relative flex items-center gap-4 p-3 rounded-lg border transition  ${
                  color === c.value
                    ? "border-accent-dark bg-accent-light text-accent-dark"
                    : "border-[#E8E8E9] dark:border-gray-600  hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent-dark shadow-md hover:shadow-lg "
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

      <div className="p-4 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl shadow-md hover:shadow-lg overflow-hidden">
        <div className="pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 ">
            Typography
          </p>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Select Font Family
          </h3>
        </div>

        <div className=" pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {fontFamilies.map((f) => {
              const isActive = font === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFont(f.value)}
                  className={`group relative flex flex-col text-left rounded-xl border overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "border-accent-dark "
                      : "border-[#E8E8E9] dark:border-gray-600  hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent-dark shadow-md hover:shadow-lg "
                  }`}
                >
                  {/* Large font preview area */}
                  <div
                    className={`w-full px-4 pt-4 pb-2 border-b border-graay-300 dark:border-gray-600 transition-colors duration-200 ${
                      isActive
                        ? "bg-accent-light dark:bg-gray-700"
                        : "text-accent-dark group-hover:bg-gray-100 "
                    }`}
                  >
                    <span
                      className="block text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-tight"
                      style={{ fontFamily: f.fontFamily }}
                    >
                      Ag
                    </span>
                    <span
                      className="block text-[11px] text-gray-400 dark:text-gray-500 mt-1 truncate"
                      style={{ fontFamily: f.fontFamily }}
                    >
                      {f.preview}
                    </span>
                  </div>

                  {/* Name row */}
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {f.name}
                    </span>

                    {isActive ? (
                      <span className="w-5 h-5 rounded-full bg-accent-dark flex items-center justify-center shrink-0">
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-600 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;

// import { Check } from "lucide-react";
// import { useTheme } from "../../context/ThemeContext";
// import { colorThemes } from "../../contstants/ColorThemes";
// import { fontFamilies } from "../../contstants/fonts";
// import PageTitle from "../../hooks/PageTitle";
// import { useFont } from "../../context/FontContext";

// const Themes = () => {
//   PageTitle("Elevva | Themes");

//   const { color, setColor } = useTheme();
//   const { font, setFont } = useFont();

//   return (
//     <div className="space-y-6">

//       <div className="bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-2xl overflow-hidden">
//         <div className="px-5 pt-5 pb-3">
//           <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
//             Appearance
//           </p>
//           <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//             Theme Color
//           </h3>
//         </div>

//         <div className="px-5 pb-5">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//             {colorThemes.map((c) => {
//               const isActive = color === c.value;
//               return (
//                 <button
//                   key={c.value}
//                   onClick={() => setColor(c.value)}
//                   className={`group relative flex flex-col items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
//                     isActive
//                       ? "border-accent-dark shadow-sm"
//                       : "border-[#E8E8E9] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
//                   }`}
//                 >

//                   <span
//                     className={`w-10 h-10 rounded-full transition-all duration-200 ${
//                       isActive
//                         ? "ring-2 ring-offset-2 ring-accent-dark dark:ring-offset-gray-800"
//                         : "group-hover:scale-110"
//                     }`}
//                     style={{ backgroundColor: c.dark }}
//                   />

//                   <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight text-center">
//                     {c.name}
//                   </span>

//                   {isActive && (
//                     <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent-dark flex items-center justify-center">
//                       <Check size={9} className="text-white" strokeWidth={3} />
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-2xl overflow-hidden">
//         <div className="px-5 pt-5 pb-3">
//           <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
//             Typography
//           </p>
//           <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//             Font Family
//           </h3>
//         </div>

//         <div className="px-5 pb-5">
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//             {fontFamilies.map((f) => {
//               const isActive = font === f.value;
//               return (
//                 <button
//                   key={f.value}
//                   onClick={() => setFont(f.value)}
//                   className={`group relative flex flex-col text-left rounded-xl border-2 overflow-hidden transition-all duration-200 ${
//                     isActive
//                       ? "border-accent-dark shadow-sm"
//                       : "border-[#E8E8E9] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
//                   }`}
//                 >
//                   {/* Large font preview area */}
//                   <div
//                     className={`w-full px-4 pt-4 pb-2 transition-colors duration-200 ${
//                       isActive
//                         ? "bg-accent-light dark:bg-gray-700"
//                         : "bg-gray-50 dark:bg-gray-750 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
//                     }`}
//                   >
//                     <span
//                       className="block text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-tight"
//                       style={{ fontFamily: f.fontFamily }}
//                     >
//                       Ag
//                     </span>
//                     <span
//                       className="block text-[11px] text-gray-400 dark:text-gray-500 mt-1 truncate"
//                       style={{ fontFamily: f.fontFamily }}
//                     >
//                       {f.preview}
//                     </span>
//                   </div>

//                   {/* Name row */}
//                   <div className="flex items-center justify-between px-4 py-2.5">
//                     <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       {f.name}
//                     </span>

//                     {isActive ? (
//                       <span className="w-5 h-5 rounded-full bg-accent-dark flex items-center justify-center shrink-0">
//                         <Check
//                           size={10}
//                           className="text-white"
//                           strokeWidth={3}
//                         />
//                       </span>
//                     ) : (
//                       <span className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-600 shrink-0" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Themes;
