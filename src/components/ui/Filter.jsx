import { useState } from "react";
import { ChevronDown, X, Funnel } from "lucide-react";
const Filter = ({ clients }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    customers: [],
    status: [],
  });

  const [search, setSearch] = useState({
    customers: "",
    status: "",
  });
  const filterConfig = [
    {
      key: "customers",
      label: "Clients",
      list: clients.map((c) => ({
        label: c.label,
        value: c.value,
      })),
    },
    {
      key: "status",
      label: "Status",
      list: [
        { label: "Open", value: "Open" },
        { label: "On Hold", value: "On Hold" },
        { label: "Filled", value: "Filled" },
        { label: "Closed", value: "Closed" },
      ],
    },
  ];
  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const resetFilters = () => {
    setFilters({
      customers: [],
      status: [],
    });
    setSearch({
      customers: "",
      status: "",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 border border-[#E8E8E9] dark:border-gray-600 rounded-md flex items-center gap-2"
      >
        <Funnel size={16} />
        <span>Filter</span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white  rounded-md border p-4 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E8E9] dark:border-gray-600 pb-3 mb-3">
            <div className="flex gap-2 items-center">
              <Funnel size={16} />
              <h2 className="font-semibold text-lg">Filter</h2>
            </div>
            {/* <button
              className=" p-1 flex justify-center items-center rounded-full bg-red-300"
              onClick={() => setOpen(false)}
            >
              <X className="text-red-600" size={18} />
            </button> */}
            <Close handleClose={() => setOpen(false)} />
          </div>

          {/* Filter Sections */}
          {filterConfig.map((menu) => {
            const filteredList = menu.list.filter((item) =>
              item.toLowerCase().includes(search[menu.key].toLowerCase()),
            );

            return (
              <details key={menu.key} className="mb-3">
                <summary className="cursor-pointer font-semibold">
                  {menu.label}
                </summary>

                <div className="mt-3 space-y-2 border rounded-lg p-3 bg-gray-50">
                  {/* Search input */}
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full px-2 py-1 border rounded-md text-sm focus:"
                    value={search[menu.key]}
                    onChange={(e) =>
                      setSearch((prev) => ({
                        ...prev,
                        [menu.key]: e.target.value,
                      }))
                    }
                  />

                  {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="accent-red-500"
                          checked={filters[menu.key].includes(item)}
                          onChange={() => toggleFilter(menu.key, item)}
                        />
                        {item}
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No results found</p>
                  )}
                </div>
              </details>
            );
          })}

          {/* Footer */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={resetFilters}
              className="border border-[#E8E8E9] dark:border-gray-600 px-4 py-1 rounded-md"
            >
              Reset
            </button>
            <button className="bg-red-600 text-white px-4 py-1 rounded-md">
              Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
