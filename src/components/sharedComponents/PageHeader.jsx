import { Plus, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

const PageHeader = ({ title, addLink, onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-accent-darkLight"
        >
          <RefreshCcw size={18} />
        </button>

        {addLink && (
          <Link
            to={addLink}
            className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md"
          >
            <Plus size={18} /> Add New
          </Link>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
