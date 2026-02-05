import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

const LocationHeader = ({
  location,
  address,
  currentTime,
  timeParts,
  seconds,
  ampm,
}) => {
  return (
    <div className="flex justify-between items-center border border-accent-dark bg-white rounded-xl p-2 mb-2 text-accent-dark">
      <div className="flex items-center gap-2">
        <MapPin size={18} />
        {location ? (
          <div className="flex items-center gap-2 max-w-xs">
            <p className="text-sm truncate" title={address}>
              {address || "Detecting location..."}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm">Location unavailable</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Clock size={18} />
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="rounded-lg px-4 py-1">
          <div className="flex text-lg font-semibold items-center gap-1">
            <span>{timeParts[0]}:</span>
            <span>{timeParts[1]}:</span>

            <div className="relative h-[1.5em] w-[2ch] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={seconds}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute left-0"
                >
                  {seconds}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="ml-1">{ampm}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationHeader;
