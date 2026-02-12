import React, { useState } from "react";
import Themes from "../components/themes/Themes";
import EmailSettings from "../modules/settings/EmailSettings";
import GeneralSettings from "../modules/settings/GeneralSettings";
import PageTitle from "../hooks/PageTitle";

const Settings = () => {
  PageTitle("Elevva | Settings-General");
  const [activeTab, setActiveTab] = useState("Themes");
  const tabs = ["General", "Themes", "Email"];

  return (
    <div className=" ">
      <h2 className=" mb-4">Settings</h2>
      {/* Tabs */}
      <div className="mb-6 border-b border-[#E8E8E9] dark:border-gray-600 flex gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2  whitespace-nowrap ${
              activeTab === tab
                ? "text-accent-dark font-bold border-b-2 border-accent-dark"
                : "text-gray-500 hover:text-accent-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="">
        {activeTab === "General" && <GeneralSettings />}

        {activeTab === "Themes" && <Themes />}

        {activeTab === "Email" && <EmailSettings />}
      </div>
    </div>
  );
};

export default Settings;
