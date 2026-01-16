// export const attendanceFilters = (data, filters, role, loggedInUserId) => {
//   let result = [...data];

//   // USER restriction
//   if (role !== "ADMIN") {
//     result = result.filter((r) => r.userId === loggedInUserId);
//   }

//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth();

//   let start, end;

//   if (filters.monthType === "current") {
//     start = new Date(year, month, 1);
//     end = new Date(year, month + 1, 0);
//   }

//   if (filters.monthType === "last") {
//     start = new Date(year, month - 1, 1);
//     end = new Date(year, month, 0);
//   }

//   if (filters.monthType === "custom") {
//     start = new Date(filters.startDate);
//     end = new Date(filters.endDate);
//   }

//   if (start && end) {
//     result = result.filter((r) => {
//       const d = new Date(`${r.date}T00:00:00`);

//       return d >= start && d <= end;
//     });
//   }

//   if (filters.employee && role === "ADMIN") {
//     result = result.filter((r) =>
//       r.name.toLowerCase().includes(filters.employee.toLowerCase())
//     );
//   }

//   return result;
// };

export const attendanceFilters = (data, filters, role, loggedInUserId) => {
  let result = [...data];

  // USER restriction
  if (role !== "ADMIN") {
    result = result.filter((r) => r.userId === loggedInUserId);
  }

  // 🔥 NEW: Show all records
  if (filters.monthType === "all") {
    return result;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let start, end;

  if (filters.monthType === "current") {
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 0);
  }

  if (filters.monthType === "last") {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 0);
  }

  if (filters.monthType === "custom") {
    start = new Date(filters.startDate);
    end = new Date(filters.endDate);
  }

  if (start && end) {
    result = result.filter((r) => {
      const d = new Date(`${r.date}T00:00:00`);
      return d >= start && d <= end;
    });
  }

  if (filters.employee && role === "ADMIN") {
    result = result.filter((r) =>
      r.name.toLowerCase().includes(filters.employee.toLowerCase())
    );
  }

  return result;
};
