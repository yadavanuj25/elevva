// const CustomTooltip = ({ active, payload }) => {
//   if (!active || !payload || !payload.length) return null;

//   const { name, total } = payload[0].payload;

//   return (
//     <div className="rounded-md bg-white shadow-lg border border-gray-300 dark:border-gray-300 px-3 py-1 text-sm">
//       <p className="font-semibold text-gray-800">{name}</p>
//       <div className=" flex items-center gap-1">
//         <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-800" />
//         <span className="text-gray-600 ">Profiles:</span>
//         <span className="font-medium  text-gray-900">{total}</span>
//       </div>
//     </div>
//   );
// };

// export default CustomTooltip;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const count = data.total ?? data.value;
  const color = payload[0].color || "#3b82f6";

  return (
    <div className="rounded-md bg-white shadow-lg border border-gray-300 dark:border-gray-300 px-3 py-1 text-sm">
      <p className="font-semibold text-gray-800">{data.name}</p>
      <div className="flex items-center gap-1">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-600">Profiles:</span>
        <span className="font-medium text-gray-900">{count}</span>
      </div>
    </div>
  );
};

export default CustomTooltip;
