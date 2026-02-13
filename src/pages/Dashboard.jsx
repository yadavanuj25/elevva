import React from "react";

import PageTitle from "../hooks/PageTitle";

import img1 from "../assets/images/d1.png";
import img2 from "../assets/images/d2.png";
import img3 from "../assets/images/d3.png";
import img4 from "../assets/images/d4.png";
import DashboardBanner from "../components/banners/DashboardBanner";
import DemoCard from "../components/banners/DemoCard";

const Dashboard = () => {
  PageTitle("Elevva | Dashboard");

  return (
    <div className=" space-y-6">
      {/* <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30 p-8 mb-8 text-white relative overflow-hidden"> */}
      <DashboardBanner />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DemoCard
          title="Total Companies"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img1}
          color="red"
          isPositive={true}
        />
        <DemoCard
          title="Total Sales"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img2}
          color="green"
          isPositive={false}
        />
        <DemoCard
          title="Customers"
          value="5468"
          ratio="5.62%"
          ratioText="from last month"
          img={img3}
          color="purple"
          isPositive={true}
        />
        <DemoCard
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
