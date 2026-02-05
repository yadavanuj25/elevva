import React from "react";
import { LogIn, LogOut, Coffee, AlertCircle } from "lucide-react";
import { BsBuildings } from "react-icons/bs";
import { IoFingerPrint } from "react-icons/io5";
import { House } from "lucide-react";
import CircularProgress from "../CircularProgress";
import BreakTimeDisplay from "./BreakTimeDisplay";

const AttendanceCard = ({
  todayAttendance,
  workingTime,
  isBreakActive,
  activeBreak,
  breakTime,
  isPunchingIn,
  isPunchingOut,
  onPunchIn,
  onPunchOut,
  onStartBreak,
  onEndBreak,
  formatTime,
  formatMinutesToHours,
}) => {
  return (
    <div className="rounded-xl p-4 shadow-[0_0_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]">
      <h3 className="text-lg text-center font-semibold">Today's Attendance</h3>
      <div className="text-center p-2">
        <CircularProgress
          workingTime={workingTime}
          shiftStartTime={todayAttendance?.shift?.startTime}
          shiftEndTime={todayAttendance?.shift?.endTime}
          isPunchedIn={
            todayAttendance?.punchIn?.time && !todayAttendance?.punchOut?.time
          }
          workingHours={todayAttendance?.workingHours}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="w-1/2 flex items-center gap-2">
          <IoFingerPrint className="w-8 h-8 text-accent-dark" />
          <div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">Punch In</p>
                <p className="font-bold">
                  {formatTime(todayAttendance?.punchIn?.time)}
                </p>
              </div>
            </div>
            {todayAttendance?.isLate && (
              <span className="inline-flex items-center text-xs text-orange-600 mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                Late by {formatMinutesToHours(todayAttendance.lateBy)} mins
              </span>
            )}
          </div>
        </div>
        {todayAttendance?.workMode && (
          <div
            className={`flex gap-1 items-center px-2 py-1 text-xs font-semibold  border rounded capitalize transition-all duration-300 ${
              todayAttendance?.workMode === "office"
                ? "bg-green-200 border-green-400 text-green-500"
                : "bg-red-200 border-red-400 text-red-500"
            }`}
          >
            {todayAttendance?.workMode === "office" ? (
              <BsBuildings size={14} />
            ) : (
              <House size={14} />
            )}
            {todayAttendance?.workMode}
          </div>
        )}
      </div>
      {isBreakActive && (
        <BreakTimeDisplay activeBreak={activeBreak} breakTime={breakTime} />
      )}
      {!isBreakActive && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={onPunchIn}
            disabled={isPunchingIn || todayAttendance?.punchIn?.time}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              todayAttendance?.punchIn?.time
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span>{isPunchingIn ? "Punching..." : "Punch In"}</span>
          </button>
          <button
            onClick={onPunchOut}
            disabled={
              isPunchingOut ||
              !todayAttendance?.punchIn?.time ||
              todayAttendance?.punchOut?.time
            }
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              !todayAttendance?.punchIn?.time || todayAttendance?.punchOut?.time
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>{isPunchingOut ? "Punching..." : "Punch Out"}</span>
          </button>
        </div>
      )}
      {todayAttendance?.punchIn?.time && !todayAttendance?.punchOut?.time && (
        <button
          onClick={isBreakActive ? onEndBreak : onStartBreak}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            isBreakActive
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          }`}
        >
          <Coffee className="w-5 h-5" />
          <span>{isBreakActive ? "End Break" : "Start Break"}</span>
        </button>
      )}
    </div>
  );
};

export default AttendanceCard;
