import React from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ errorMsg }) => {
  return (
    <>
      {errorMsg && (
        <div
          className={`mb-4 flex items-center justify-center font-semibold gap-2 p-3 rounded-xl  
                    bg-[#fecbcb] text-red-700  transform transition-all duration-1000
                    opacity-100 translate-y-0`}
        >
          <MdErrorOutline size={18} />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}
    </>
  );
};

export default ErrorMessage;
