// import { useEffect, useState } from "react";
// import BasicDatePicker from "../ui/BasicDatePicker";
// import SelectField from "../ui/SelectField";
// import { getAllUsers } from "../../services/userServices";

// const monthOptions = [
//   { label: "Current Month", value: "current" },
//   { label: "Last Month", value: "last" },
//   { label: "Custom Range", value: "custom" },
// ];

// const AttendanceFilters = ({ filters, setFilters, onApply, isAdmin }) => {
//   const [employees, setEmployees] = useState([]);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       setLoadingEmployees(true);
//       try {
//         const res = await getAllUsers();
//         const mappedEmployees = res.users.map((u) => ({
//           label: `${u.fullName} (${u._id.slice(0, 6)})`,
//           value: u._id,
//         }));
//         setEmployees(mappedEmployees);
//       } catch (error) {
//         console.log("Error fetching employees:", error);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };

//     if (isAdmin) fetchEmployees();
//   }, [isAdmin]);

//   return (
//     <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 p-4 rounded-lg space-y-4 mb-4">
//       <div className="flex justify-between  items-center">
//         <div className="flex  items-center gap-4">
//           <SelectField
//             label="Month"
//             name="monthType"
//             value={filters.monthType}
//             handleChange={(e) =>
//               setFilters({ ...filters, monthType: e.target.value })
//             }
//             options={monthOptions}
//           />

//           {/* Custom Dates */}
//           {filters.monthType === "custom" && (
//             <>
//               <BasicDatePicker
//                 name="startDate"
//                 value={filters.startDate}
//                 labelName="Start Date"
//                 handleChange={(e) =>
//                   setFilters({ ...filters, startDate: e.target.value })
//                 }
//               />
//               <BasicDatePicker
//                 name="endDate"
//                 value={filters.endDate}
//                 labelName="End Date"
//                 handleChange={(e) =>
//                   setFilters({ ...filters, endDate: e.target.value })
//                 }
//               />
//             </>
//           )}

//           {/* Employee Filter - Admin only */}
//           {isAdmin && (
//             <SelectField
//               label="Employee"
//               name="employee"
//               value={filters.employee}
//               handleChange={(e) =>
//                 setFilters({ ...filters, employee: e.target.value })
//               }
//               options={employees}
//               loading={loadingEmployees}
//             />
//           )}
//         </div>
//         <div className="flex justify-end">
//           <button
//             onClick={onApply}
//             className="bg-accent-dark text-white px-6 py-2 rounded-md hover:opacity-80"
//           >
//             Show History
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceFilters;

import { useEffect, useState } from "react";
import BasicDatePicker from "../ui/BasicDatePicker";
import SelectField from "../ui/SelectField";
import { getAllUsers } from "../../services/userServices";
import { Save } from "lucide-react";
import Button from "../ui/Button";

const monthOptions = [
  { label: "Current Month", value: "current" },
  { label: "Last Month", value: "last" },
  { label: "Custom Range", value: "custom" },
];

const AttendanceFilters = ({ filters, setFilters, onApply, isAdmin }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const res = await getAllUsers();
        const mappedEmployees = res.users.map((u) => ({
          label: `${u.fullName} - (${u.role?.name})`,
          value: u._id,
        }));
        setEmployees(mappedEmployees);
      } catch (error) {
        console.log("Error fetching employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (isAdmin) fetchEmployees();
  }, [isAdmin]);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 p-4 rounded-lg mb-4">
      <div className="flex items-stretch gap-4">
        {/* LEFT SIDE */}
        <div
          className={`flex-1 grid gap-4 ${
            filters.monthType === "custom"
              ? "grid-cols-1 sm:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          <SelectField
            label="Month"
            name="monthType"
            value={filters.monthType}
            handleChange={(e) =>
              setFilters({ ...filters, monthType: e.target.value })
            }
            options={monthOptions}
          />

          {filters.monthType === "custom" && (
            <>
              <BasicDatePicker
                name="startDate"
                value={filters.startDate}
                labelName="Start Date"
                handleChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              <BasicDatePicker
                name="endDate"
                value={filters.endDate}
                labelName="End Date"
                handleChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </>
          )}

          {isAdmin && (
            <SelectField
              label="Employee"
              name="employee"
              value={filters.employee}
              handleChange={(e) =>
                setFilters({ ...filters, employee: e.target.value })
              }
              options={employees}
              loading={loadingEmployees}
            />
          )}
        </div>

        <Button
          type="button"
          text="Show History"
          handleClick={onApply}
          icon={<Save size={18} />}
        />
      </div>
    </div>
  );
};

export default AttendanceFilters;
