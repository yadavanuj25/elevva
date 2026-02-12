import React from "react";

const ViewSection = ({ title, icon, children }) => (
  <section className=" rounded-lg p-4 bg-white dark:bg-gray-800 transition">
    <div className="flex items-center gap-2 pb-2 dark:text-white border-b border-[#E8E8E9] dark:border-gray-600 ">
      <p>{icon && <span className=" dark:text-white">{icon}</span>}</p>
      <h3 className="text-lg font-semibold   ">{title}</h3>
    </div>
    {children}
  </section>
);
export default ViewSection;
