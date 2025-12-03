import React from "react";
import { RefreshCcw } from "lucide-react";
import ToolTip from "../ToolTip";
import Tooltip from "../ToolTip";

const RefreshButton = ({ fetchData }) => {
  return (
    <>
      <button className="flex items-center gap-2" onClick={() => fetchData()}>
        <ToolTip
          title="Refresh"
          placement="top"
          icon={<RefreshCcw size={16} />}
        />
        {/* 
        <Tooltip title="Default tooltip">Default tooltip</Tooltip> */}
      </button>
    </>
  );
};

export default RefreshButton;
