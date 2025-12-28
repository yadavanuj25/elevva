import React from "react";

const ViewBlock = ({ title, value }) =>
  value ? (
    <div className="mb-4 mt-4">
      <h4 className="font-semibold mb-1 text-accent-dark dark:text-white">
        {title}
      </h4>
      <div
        // className="text-sm text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: value }}
      >
        {/* {value} */}
      </div>
    </div>
  ) : null;

export default ViewBlock;
