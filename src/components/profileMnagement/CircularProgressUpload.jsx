import React from "react";
import { CloudUpload } from "lucide-react";

const CircularProgressUpload = ({
  progress = 0,
  size = 180,
  strokeWidth = 8,
  fileName,
  fileSize,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center text-center px-4">
        <CloudUpload className="w-8 h-8 text-gray-600 mb-1" />
        <p className="text-sm font-medium text-gray-600">Uploading...</p>
        {fileName && (
          <p className="text-xs text-gray-500 truncate max-w-[120px]">
            {fileName}
          </p>
        )}
        {fileSize && (
          <p className="text-[11px] text-gray-400 mt-1">{fileSize} MB</p>
        )}
      </div>

      {/* Percentage */}
      <div className="absolute bottom-0 right-3 text-green-500 font-semibold text-sm">
        {progress}%
      </div>
    </div>
  );
};

export default CircularProgressUpload;
