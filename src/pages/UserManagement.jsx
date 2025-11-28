import React from "react";
import UserList from "../components/userManagement/UserList";
import PageTitle from "../hooks/PageTitle";
const UserManagement = () => {
  PageTitle("Elevva | Users");
  return (
    <div>
      <UserList />
    </div>
  );
};

export default UserManagement;
