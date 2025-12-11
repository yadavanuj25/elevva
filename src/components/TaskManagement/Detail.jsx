import React from "react";

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-medium text-gray-900 mt-0.5">{value || "-"}</p>
  </div>
);

export default Detail;
