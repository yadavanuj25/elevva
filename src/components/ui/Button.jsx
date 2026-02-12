import React from "react";
import { PulseLoader } from "react-spinners";

const Button = ({
  text,
  type = "button",
  className = "",
  icon,
  handleClick,
  loading,
  disabled,
}) => {
  const isSubmit = type === "submit";
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={!isSubmit ? handleClick : undefined}
      // className={`
      //   w-max flex items-center gap-2 py-1.5 px-3 font-medium rounded transition-all duration-200 ease-in-out
      //   bg-accent-dark text-white  hover:bg-[#222]
      //   ${loading || disabled ? "opacity-60 cursor-not-allowed" : ""}
      //   ${className}
      // `}
      className="px-4 py-2 bg-accent-dark backdrop-blur-sm text-white  rounded-lg font-semibold hover:bg-accent-light hover:text-accent-dark transition-all flex items-center gap-2"
    >
      {loading ? (
        <p className=" text-center">
          <PulseLoader size={6} />
        </p>
      ) : (
        <>
          {icon} {text}
        </>
      )}
    </button>
  );
};
export default Button;
