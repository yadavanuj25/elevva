import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageTitle from "../hooks/PageTitle";
import DashboardCard from "../components/cards/DashboardCard";
import DashboardStats from "../components/cards/DashboardStats";
import img1 from "../assets/images/d1.png";
import img2 from "../assets/images/d2.png";
import img3 from "../assets/images/d3.png";
import img4 from "../assets/images/d4.png";

const quotes = [
  "Today is going to be awesome! 🚀",
  "Time to fill some positions! 👥💼",
  "Keep being awesome! ✨",
  "Make sure you get to everything you need to get done! ✅🕒",
  "Great work today! Don't forget to eat dinner! 😴",
];
const Dashboard = () => {
  PageTitle("Elevva | Dashboard");
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
    <div className=" space-y-6">
      {/* Stats Cards */}

      <div className="flex justify-between items-center bg-[#0a0c0c] p-6 rounded-md text-white font-golos">
        <div>
          <h2 className="text-2xl font-[500] mb-1">
            {getGreeting()} , {user?.fullName.split(" ")[0]}
          </h2>
          <p className="opacity-90">{quoteToShow}</p>
        </div>
        <div className="flex gap-2 font-semibold">
          <button
            className="bg-accent-dark text-white px-2 py-1 rounded-md hover:bg-gray-500 transition"
            onClick={() => navigate("/taskboard")}
          >
            To Do List
          </button>
          <button className="bg-white text-black px-2 py-1 rounded-md hover:bg-gray-500 hover:text-white transition">
            All Packages
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard
          title="Total Companies"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img1}
          color="red"
          isPositive={true}
        />
        <DashboardCard
          title="Total Sales"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img2}
          color="green"
          isPositive={false}
        />
        <DashboardCard
          title="Customers"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img3}
          color="purple"
          isPositive={true}
        />
        <DashboardCard
          title="People Online"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img4}
          color="blue"
          isPositive={false}
        />
      </div>
      {/* <div>
        <DashboardStats />
      </div> */}
    </div>
  );
};

export default Dashboard;
