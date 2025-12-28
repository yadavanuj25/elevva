import React from "react";
import NoFoundImg from "../../assets/images/no-data.svg";

const NoData = ({ title, description }) => {
  return (
    <>
      <div className=" w-full flex flex-col items-center justify-center min-h-[300px] text-center">
        <img src={NoFoundImg} alt="No Data" className="w-32 h-32  mb-4" />
        <h3 className="text-lg font-semibold text-accent-dark dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </>
  );
};

export default NoData;
