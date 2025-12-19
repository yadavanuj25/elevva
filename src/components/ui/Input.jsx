import React from "react";
const Input = ({
  type = "text",
  value,
  name,
  handleChange,
  errors = {},
  labelName,
  className = "",
  icon = null,
}) => {
  const hasError = errors[name];

  return (
    <div className={className}>
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder=" "
          className={`block w-full text-sm bg-transparent rounded-md appearance-none focus:outline-none peer transition border p-[14px] 
            ${icon ? "pr-10" : ""}  
            ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                : "border-gray-300 dark:border-gray-600 focus:border-dark focus:ring-1 focus:ring-light"
            }
            dark:text-white `}
        />

        <label
          className={`absolute pointer-events-none text-[15px] text-gray-500 dark:text-gray-400
    duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]
    bg-white dark:bg-darkBg px-2

    peer-placeholder-shown:scale-100
    peer-placeholder-shown:-translate-y-1/2
    peer-placeholder-shown:top-1/2
    peer-placeholder-shown:font-normal

    peer-focus:top-2
    peer-focus:scale-75
    peer-focus:-translate-y-4
    peer-focus:font-[700]

    peer-[&:not(:placeholder-shown)]:font-[700]

    ${hasError ? "peer-focus:text-red-500" : ""}

    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
        >
          {labelName}
        </label>

        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {icon}
          </span>
        )}
      </div>

      {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
    </div>
  );
};

export default Input;
