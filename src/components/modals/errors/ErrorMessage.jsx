import React from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ errorMsg }) => {
  return (
    <>
      {errorMsg && (
        <div
          className={`mb-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-red-400
                    bg-[#fea99e] text-white shadow-sm transform transition-all duration-1000
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
