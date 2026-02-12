import React from "react";
import BackButton from "../ui/buttons/BackButton";

const PageHeader = ({ title, onBack, rightContent = null }) => {
  return (
    <div className="mb-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E8E8E9] dark:border-gray-600">
      <h2>{title}</h2>

      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        {rightContent}
        {onBack && <BackButton onClick={onBack} />}
      </div>
    </div>
  );
};

export default PageHeader;
