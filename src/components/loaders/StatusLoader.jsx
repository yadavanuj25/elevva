import React from "react";

const StatusLoader = ({ color = "#fff", size = 6 }) => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="rounded-full animate-[pulseGlow_0.9s_ease-in-out_infinite]"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${i * 0.12}s`,
          }}
        ></span>
      ))}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default StatusLoader;
