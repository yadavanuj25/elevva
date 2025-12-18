// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Divider,
//   Chip,
//   Box,
//   Typography,
//   Checkbox,
//   Paper,
// } from "@mui/material";
// import { FileText, Hash, Save, X } from "lucide-react";
// import { getAllUsers } from "../../services/userServices";
// import { assignRequirement } from "../../services/clientServices";
// import Button from "../ui/Button";

// const AssignModal = ({ open, onClose, selectedRequirements }) => {
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [options, setOptions] = useState([]);
//   console.log(selectedRequirements);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers();
//       const activeUsers = res.users.filter((user) => user.status === "active");
//       setOptions(activeUsers);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const resetForm = () => setSelectedOptions([]);

//   const handleAssign = async () => {
//     if (!selectedOptions.length) {
//       alert("Please select at least one user to assign");
//       return;
//     }

//     if (!selectedRequirements?.length) {
//       alert("No requirements selected");
//       return;
//     }

//     const payload = {
//       requirementId: selectedRequirements.map((req) => req._id),
//       assignedTo: selectedOptions,
//     };

//     try {
//       const res = await assignRequirement(payload);
//       console.log("Assigned:", res);

//       resetForm();
//       onClose();
//     } catch (error) {
//       console.error("Assign failed:", error);
//       alert("Failed to assign requirement(s)");
//       resetForm();
//     }
//   };

//   const handleChange = (event) => {
//     const { value } = event.target;
//     setSelectedOptions(typeof value === "string" ? value.split(",") : value);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={() => {
//         resetForm();
//       }}
//       fullWidth
//       maxWidth="sm"
//       PaperProps={{
//         sx: {
//           borderRadius: "20px",
//           overflow: "hidden",
//           boxShadow: "0px 12px 34px rgba(0,0,0,0.15)",
//         },
//       }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           background: "#25499f",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 1.5,
//           fontWeight: 700,
//           py: 2.5,
//         }}
//       >
//         <FileText size={26} />
//         Assign Requirements
//       </DialogTitle>

//       <DialogContent
//         sx={{
//           py: 3,
//           backgroundColor: "#f7f9fc",
//           minHeight: "220px",
//         }}
//       >
//         {/* Selected Requirements */}
//         <Typography
//           variant="subtitle1"
//           sx={{ fontWeight: 700, mb: 1.5, mt: 1.5, color: "#333" }}
//         >
//           Selected Requirements
//         </Typography>

//         <Box
//           sx={{
//             maxHeight: 200,
//             overflowY: "auto",
//             pr: 1,
//             display: "flex",
//             flexDirection: "column",
//             gap: 1.5,
//           }}
//         >
//           {selectedRequirements?.map((req) => (
//             <Paper
//               key={req._id}
//               sx={{
//                 p: 1,
//                 borderRadius: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#fff",
//                 border: "1px solid #e0e0e0",
//                 transition: "0.25s",
//                 "&:hover": {
//                   backgroundColor: "#eef2ff",
//                   borderColor: "#c5cae9",
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   mt: 0.3,
//                   display: "flex",
//                   alignItems: "center",
//                   color: "#555",
//                   fontSize: ".85rem",
//                   gap: 0.7,
//                 }}
//               >
//                 <Hash size={14} />
//                 {req.requirementCode} | {req.client.clientName} |{" "}
//                 {req.techStack}
//               </Box>
//             </Paper>
//           ))}
//         </Box>

//         {/* Assign To */}
//         <Box sx={{ mt: 4 }}>
//           <FormControl fullWidth>
//             <InputLabel>Select Users</InputLabel>

//             <Select
//               multiple
//               value={selectedOptions}
//               onChange={handleChange}
//               label="Select Users"
//               renderValue={(selected) => (
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
//                   {selected.map((id) => {
//                     const user = options.find((u) => u._id === id);
//                     return <Chip key={id} label={user?.fullName} />;
//                   })}
//                 </Box>
//               )}
//               sx={{
//                 borderRadius: 2,
//                 "& .MuiSelect-select": {
//                   py: 1.2,
//                 },
//               }}
//             >
//               {options.map((option) => (
//                 <MenuItem
//                   key={option._id}
//                   value={option._id}
//                   sx={{
//                     py: 0,
//                     gap: 0.3,
//                   }}
//                 >
//                   <Checkbox checked={selectedOptions.includes(option._id)} />
//                   <Typography>{option.fullName}</Typography>
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//       </DialogContent>

//       <Divider />

//       <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#fafafa" }}>
//         <button
//           className="w-max flex items-center gap-2 py-1.5 px-3 rounded text-white bg-red-700 border border-gray-300 dark:border-gray-600 transition"
//           onClick={() => {
//             resetForm();
//             onClose();
//           }}
//         >
//           <X size={18} />
//           Cancel
//         </button>

//         <Button
//           type="button"
//           text="Assign"
//           icon={<Save size={18} />}
//           handleClick={handleAssign}
//         />
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AssignModal;

import React, { useEffect, useState } from "react";
import { FileText, Hash, Save, X } from "lucide-react";
import { getAllUsers } from "../../services/userServices";
import { assignRequirement } from "../../services/clientServices";
import Button from "../ui/Button";

const AssignModal = ({ open, onClose, selectedRequirements }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  /* -------------------- OPEN / CLOSE ANIMATION -------------------- */
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      fetchUsers();
    }
  }, [open]);

  const closeWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1000);
  };

  /* -------------------- DATA -------------------- */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const activeUsers = res.users.filter((u) => u.status === "active");
      setOptions(activeUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setSelectedOptions([]);
  };

  const handleAssign = async () => {
    if (!selectedOptions.length) {
      return;
    }

    const payload = {
      requirementId: selectedRequirements.map((r) => r._id),
      assignedTo: selectedOptions,
    };

    try {
      await assignRequirement(payload);
      closeWithAnimation();
    } catch (err) {}
  };

  const toggleUser = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
        bg-black/90`}
    >
      <div
        className={`bg-white w-full max-w-xl rounded-2xl shadow-xl
          transform transition-all duration-300
          ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-center gap-2 bg-dark text-white py-4 rounded-t-2xl">
          <FileText size={22} />
          <h2 className="text-lg font-semibold">Assign Requirements</h2>

          <button
            onClick={closeWithAnimation}
            className="absolute right-4 top-4 bg-white text-red-600 p-1 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 bg-gray-50 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="font-semibold text-sm">Selected Requirements</p>

          {selectedRequirements.map((req) => (
            <div
              key={req._id}
              className="bg-white border rounded-lg px-3 py-2 text-sm flex gap-2"
            >
              <Hash size={14} />
              {req.requirementCode} | {req.client.clientName} | {req.techStack}
            </div>
          ))}

          <div className="mt-4">
            <p className="font-semibold mb-2 text-sm">Assign To</p>

            <div className="border rounded-lg bg-white max-h-48 overflow-y-auto">
              {options.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(user._id)}
                    onChange={() => toggleUser(user._id)}
                  />
                  {user.fullName}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t bg-white rounded-b-2xl">
          <button
            onClick={closeWithAnimation}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded"
          >
            <X size={16} />
            Cancel
          </button>

          <Button
            text="Assign"
            icon={<Save size={16} />}
            handleClick={handleAssign}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
