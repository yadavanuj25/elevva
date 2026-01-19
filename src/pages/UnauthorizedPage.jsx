import React from "react";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 backdrop-blur-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600  rounded-3xl p-10 max-w-lg text-center animate-fadeIn">
        <div className="flex items-center justify-center mb-6">
          <div className="w-28 h-28 rounded-full bg-accent-light border border-purple-400/40 flex items-center justify-center  animate-float">
            <ShieldAlert size={70} className="text-accent-dark" />
          </div>
        </div>
        <h1 className="text-4xl font-bold  tracking-tight mb-3">
          Unauthorized Access
        </h1>
        <p className=" mb-8">
          You don’t have permission to view this page. Please login again or go
          back to the dashboard.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="px-5 py-3 rounded-xl font-semibold text-white bg-accent-dark hover:opacity-80 transition "
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
