import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";

const ToolTip = ({ title, icon, badge, placement = "top", isViewRefresh }) => (
  <Tippy
    content={title}
    placement={placement}
    arrow={true}
    animation="shift-away"
    duration={[150, 100]}
    theme="custom-dark"
  >
    <div
      className={`relative flex justify-center items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm ${
        isViewRefresh ? "rounded-md" : "rounded-r-md"
      } cursor-pointer hover:bg-[#222] hover:text-white`}
    >
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
          {badge}
        </span>
      )}
    </div>
  </Tippy>
);

export default ToolTip;
