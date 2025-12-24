import React from "react";
import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Glass Card */}
      <div className="relative z-10 backdrop-blur-xl  rounded-3xl p-10 max-w-lg text-center animate-fadeIn">
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-28 h-28 rounded-full bg-light border border-purple-400/40 flex items-center justify-center animate-float">
            <Ghost size={70} className="text-dark" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold tracking-tight mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>

        <p className="text-sm opacity-80 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-dark hover:opacity-80 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
