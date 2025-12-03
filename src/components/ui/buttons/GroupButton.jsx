import React from "react";

const GroupButton = ({ text }) => {
  return (
    <div>
      <button
        type="button"
        class=" bg-neutral-primary-soft border border-gray-300 dark:border-gray-600 hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft   rounded-l-md text-sm  px-2  py-1 focus:outline-none"
      >
        {text}
      </button>
    </div>
  );
};

export default GroupButton;
