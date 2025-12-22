import React from "react";
import moment from "moment";

const DateDisplay = ({ date }) => {
  if (!date) return <span>-</span>;
  return <span>{moment(date).fromNow()}</span>;
};

export default DateDisplay;
