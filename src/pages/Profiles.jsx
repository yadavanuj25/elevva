import React from "react";
import ProfileList from "../components/profileMnagement/ProfileList";
import PageTitle from "../hooks/PageTitle";

const Profiles = () => {
  PageTitle("Elevva | Profiles");
  return (
    <div>
      <ProfileList />
    </div>
  );
};

export default Profiles;
