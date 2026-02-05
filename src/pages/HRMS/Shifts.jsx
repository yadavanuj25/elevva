import React, { useEffect } from "react";
import AddShift from "../../components/hrms/AddShift";
import ShiftList from "../../components/hrms/ShiftList";

const Shifts = () => {
  useEffect(() => {
    document.title = "Elevva | Shifts";
  }, []);
  return (
    <div>
      <ShiftList />
    </div>
  );
};

export default Shifts;
