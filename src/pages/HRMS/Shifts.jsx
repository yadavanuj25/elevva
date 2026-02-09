import React, { useEffect } from "react";
import ShiftList from "../../components/hrms/shifts/ShiftList";

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
