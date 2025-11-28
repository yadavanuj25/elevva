import React from "react";
import { useAuth } from "../auth/AuthContext";
import DashboardCard from "../components/cards/DashboardCard";
import img1 from "../assets/images/d1.png";
import img2 from "../assets/images/d2.png";
import img3 from "../assets/images/d3.png";
import img4 from "../assets/images/d4.png";
import DashboardStats from "../components/cards/DashboardStats";
import PageTitle from "../hooks/PageTitle";

const SuperDashboard = () => {
  PageTitle("Elevva | Super-Dashboard");
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <h2 className="text-2xl font-semibold  mb-1">Dashboard</h2>
      <div className="flex justify-between items-center bg-[#31415f] p-6 rounded-md text-white font-golos">
        <div>
          <h2 className="text-2xl font-semibold mb-1">
            Welcome Back , {user?.fullName}
          </h2>
          <p>14 New Companies Subscribed Today !!!</p>
        </div>
        <div className="flex gap-2 font-semibold">
          <button className="bg-dark text-white px-2 py-1 rounded-md">
            Companies
          </button>
          <button className="bg-white text-black px-2 py-1 rounded-md">
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
      <DashboardStats />
    </div>
  );
};

export default SuperDashboard;
