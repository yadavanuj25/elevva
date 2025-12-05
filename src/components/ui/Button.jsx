import React from "react";

const Button = ({
  text,
  type = "button",
  className = "",
  icon,
  handleClick,
  loading,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={handleClick}
      className={`
        w-max flex items-center gap-2 py-1.5 px-3 rounded transition 
        bg-[var(--dark)] text-white
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

// import React from "react";

// const Button = ({
//   text,
//   type = "button",
//   className = "",
//   icon,
//   handleClick,
//   loading,
// }) => {
//   return (
//     <button
//       type={type}
//       onClick={!loading && handleClick ? handleClick : undefined}
//       disabled={loading}
//       className={`w-max flex items-center gap-2 py-1.5 px-3 rounded transition
//         ${className}
//         ${loading ? "opacity-60 cursor-not-allowed" : ""}
//       `}
//       style={{
//         backgroundColor: "var(--dark)",
//         color: "#fff",
//       }}
//     >
//       {loading ? (
//         <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
//       ) : (
//         icon
//       )}

//       {loading ? "Loading..." : text}
//     </button>
//   );
// };

// export default Button;
