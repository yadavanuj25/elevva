import React from "react";
import RoleList from "../components/roleManagement/RoleList";
import PageTitle from "../hooks/PageTitle";

const RoleManagement = () => {
  PageTitle("Elevva | Roles");
  return (
    <div>
      <RoleList />
    </div>
  );
};

export default RoleManagement;
