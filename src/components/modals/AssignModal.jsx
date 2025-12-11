import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Box,
  Typography,
  Checkbox,
  Paper,
} from "@mui/material";
import { FileText, Hash, Save, X } from "lucide-react";
import { getAllUsers } from "../../services/userServices";
import { assignRequirement } from "../../services/clientServices";
import Button from "../ui/Button";

const AssignModal = ({ open, onClose, selectedRequirements }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  console.log(selectedRequirements);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const activeUsers = res.users.filter((user) => user.status === "active");
      setOptions(activeUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => setSelectedOptions([]);

  const handleAssign = async () => {
    if (!selectedOptions.length) {
      alert("Please select at least one user to assign");
      return;
    }

    if (!selectedRequirements?.length) {
      alert("No requirements selected");
      return;
    }

    const payload = {
      requirementId: selectedRequirements.map((req) => req._id),
      assignedTo: selectedOptions,
    };

    try {
      const res = await assignRequirement(payload);
      console.log("Assigned:", res);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Assign failed:", error);
      alert("Failed to assign requirement(s)");
      resetForm();
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0px 12px 34px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "#2d7dfa",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          fontWeight: 700,
          py: 2.5,
        }}
      >
        <FileText size={26} />
        Assign Requirements
      </DialogTitle>

      <DialogContent
        sx={{
          py: 3,
          backgroundColor: "#f7f9fc",
          minHeight: "220px",
        }}
      >
        {/* Selected Requirements */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1.5, mt: 1.5, color: "#333" }}
        >
          Selected Requirements
        </Typography>

        <Box
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {selectedRequirements?.map((req) => (
            <Paper
              key={req._id}
              sx={{
                p: 1,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                transition: "0.25s",
                "&:hover": {
                  backgroundColor: "#eef2ff",
                  borderColor: "#c5cae9",
                },
              }}
            >
              <Box
                sx={{
                  mt: 0.3,
                  display: "flex",
                  alignItems: "center",
                  color: "#555",
                  fontSize: ".85rem",
                  gap: 0.7,
                }}
              >
                <Hash size={14} />
                {req.requirementCode} | {req.client.clientName} |{" "}
                {req.techStack}
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Assign To */}
        <Box sx={{ mt: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Select Users</InputLabel>

            <Select
              multiple
              value={selectedOptions}
              onChange={handleChange}
              label="Select Users"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {selected.map((id) => {
                    const user = options.find((u) => u._id === id);
                    return <Chip key={id} label={user?.fullName} />;
                  })}
                </Box>
              )}
              sx={{
                borderRadius: 2,
                "& .MuiSelect-select": {
                  py: 1.2,
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option._id}
                  value={option._id}
                  sx={{
                    py: 0,
                    gap: 0.3,
                  }}
                >
                  <Checkbox checked={selectedOptions.includes(option._id)} />
                  <Typography>{option.fullName}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#fafafa" }}>
        <button
          className="w-max flex items-center gap-2 py-1.5 px-3 rounded text-white bg-red-700 border border-gray-300 dark:border-gray-600 transition"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          <X size={18} />
          Cancel
        </button>

        <Button
          type="button"
          text="Assign"
          icon={<Save size={18} />}
          handleClick={handleAssign}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AssignModal;
