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
  const hasError = errors?.[name];
  return (
    <div className={className}>
      <div className="relative w-full">
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder=" "
          className={`block w-full text-sm bg-transparent rounded-md appearance-none focus:outline-none peer  border p-[14px] 
            ${icon ? "pr-10" : ""}  
            ${
              hasError
                ? "border-red-500 "
                : "border-gray-300 dark:border-gray-600 focus:border-accent-dark dark:focus:border-white"
            }
            dark:text-white `}
        />

        <label
          className={`absolute pointer-events-none text-[15px] text-gray-500 dark:text-gray-400
  transform origin-[0]
  transition-all duration-300 ease-in-out
  -translate-y-4 scale-75 top-2 z-10
  bg-white dark:bg-darkBg px-2 start-1
  peer-placeholder-shown:scale-100
  peer-placeholder-shown:-translate-y-1/2
  peer-placeholder-shown:top-1/2
  peer-placeholder-shown:font-normal
  peer-focus:top-2
  peer-focus:scale-75
  peer-focus:-translate-y-4
  peer-focus:font-[700]
  peer-[&:not(:placeholder-shown)]:font-[700]
  ${
    hasError
      ? "text-red-500 dark:text-red-500"
      : "peer-focus:text-accent-dark dark:peer-focus:text-white"
  }
  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
`}
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
