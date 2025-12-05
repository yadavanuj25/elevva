import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = ({ email }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-lg mx-auto text-center py-10 px-6">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Verify Your Email
      </h1>

      <p className="text-gray-600 mt-3 leading-relaxed">
        We've sent a link to your email{" "}
        <span className="font-semibold text-gray-900">{email}</span>. Please
        follow the link inside to continue.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg "
      >
        Skip Now
      </button>
    </div>
  );
};

export default SuccessPage;
