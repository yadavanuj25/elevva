import React, { useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import announcementImg from "../../assets/images/accouncemet.png";
import { Calendar, Plus } from "lucide-react";

const quotes = [
  "Today is going to be awesome! 🚀",
  "Time to fill some positions! 👥💼",
  "Keep being awesome! ✨",
  "Make sure you get to everything you need to get done! ✅🕒",
  "Great work today! Don't forget to eat dinner! 😴",
];

const DashboardBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  const getQuote = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return quotes[0];
    if (hour >= 12 && hour < 15) return quotes[1];
    if (hour >= 15 && hour < 16) return quotes[2];
    if (hour >= 16 && hour < 20) return quotes[3];
    if (hour >= 20 && hour < 24) return quotes[4];
    return quotes[0];
  };

  const quoteToShow = useMemo(() => getQuote(), []);

  return (
    <div className="bg-accent-dark rounded-2xl shadow-lg  px-8 py-4  text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-28 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full -ml-20 -mb-24"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className=" mb-2">
              {getGreeting()} , {user?.fullName.split(" ")[0]}! 👋
            </h2>
            <p className="text-purple-100 mb-3">{quoteToShow}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tasks")}
                className="px-4 py-2 bg-white text-accent-dark rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                To Do List
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </button>
            </div>
          </div>

          <div className="hidden lg:block dashboard-goal-img">
            <img src={announcementImg} alt="Welcome" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBanner;
