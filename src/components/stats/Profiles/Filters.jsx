import { Search, RefreshCw } from "lucide-react";
import BasicDatePicker from "../../ui/BasicDatePicker";
import SearchableSelect from "../../ui/SearchableSelect";

const Filters = ({ users, filters, setFilters, onSearch }) => {
  return (
    <div className="bg-white dark:bg-darkBg border rounded-lg p-4">
      <div className="grid md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <SearchableSelect
            value={filters.userId}
            onChange={(val) => setFilters((prev) => ({ ...prev, userId: val }))}
            options={[
              { value: "", label: "All Users" },
              ...users.map((u) => ({
                value: u._id,
                label: u.fullName,
              })),
            ]}
          />
        </div>

        <div className="md:col-span-3">
          <BasicDatePicker
            name="startDate"
            labelName="Start Date"
            value={filters.startDate}
            handleChange={(e) =>
              setFilters((p) => ({ ...p, startDate: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-3">
          <BasicDatePicker
            name="endDate"
            labelName="End Date"
            value={filters.endDate}
            handleChange={(e) =>
              setFilters((p) => ({ ...p, endDate: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            onClick={onSearch}
            className="p-2 bg-blue-600 text-white rounded-md"
          >
            <Search size={20} />
          </button>

          <button
            onClick={() =>
              setFilters({ userId: "", startDate: "", endDate: "" })
            }
            className="p-2 bg-gray-200 rounded-md"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
