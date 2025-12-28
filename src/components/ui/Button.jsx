import React from "react";

const Button = ({
  text,
  type = "button",
  className = "",
  icon,
  handleClick,
  loading,
}) => {
  const isSubmit = type === "submit";
  return (
    <button
      type={type}
      disabled={loading}
      onClick={!isSubmit ? handleClick : undefined}
      // onClick={handleClick}
      className={`
        w-max flex items-center gap-2 py-1.5 px-3 rounded transition-all duration-200 ease-in-out
        bg-accent-dark text-white  hover:bg-[#222]
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {icon} {text}
        </>
      )}
    </button>
  );
};
export default Button;
