import React from "react";

const Textareafield = ({ name, value, handleChange, label, rows = 2 }) => {
  return (
    <div className="relative w-full">
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={handleChange}
        placeholder=" "
        className="block p-[14px] w-full text-sm bg-transparent rounded-md border  appearance-none focus:outline-none peer transition
          border-gray-300 dark:border-gray-600 focus:border-accent-dark dark:focus:border-white "
      />
      <label
        className={`absolute pointer-events-none font-medium text-sm text-gray-500 duration-300 transform z-10 origin-[0] bg-white dark:bg-darkBg px-2
        ${
          value
            ? "top-2 scale-75 -translate-y-4 text-accent-darkBg dark:text-white "
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2"
        }
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4  peer-focus:font-[700]
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1  peer-focus:text-accent-dark dark:peer-focus:text-white
      `}
      >
        {label}
      </label>
    </div>
  );
};

export default Textareafield;
