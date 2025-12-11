import React from "react";
const SelectField = ({
  name,
  label,
  value,
  options = [],
  handleChange,
  loading = false,
  error = "",
}) => {
  return (
    <div className="col-span-2 md:col-span-1">
      <div className="relative w-full">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition 
            ${
              error
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-black"
            } dark:text-white`}
        >
          <option value="" disabled hidden>
            --- Select ---
          </option>

          {loading ? (
            <option disabled>Loading...</option>
          ) : (
            <>
              {options.map((opt, i) => (
                <option key={i} value={opt} className="text-darkBg">
                  {opt}
                </option>
              ))}
            </>
          )}
        </select>

        <label
          className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              error
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
        >
          {label}
        </label>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SelectField;
