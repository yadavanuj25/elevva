import React from "react";
import { Upload, User } from "lucide-react";
import ToggleButton from "../ui/buttons/ToggleButton";

const UserProfileCard = ({
  profilePreview,
  errors = {},
  status = "active",
  onImageChange,
  onStatusChange,
}) => {
  return (
    <div className="p-6 flex flex-col items-center gap-4 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`border rounded-full p-1 ${
            errors.profileImage
              ? "border-red-500"
              : "border-[#E8E8E9] dark:border-gray-600"
          }`}
        >
          <div className="w-28 h-28 bg-gray-100 rounded-full overflow-hidden border border-[#E8E8E9] dark:border-gray-600 flex items-center justify-center text-gray-400">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} />
            )}
          </div>
        </div>

        {/* Upload Button */}
        <label
          htmlFor="profileImage"
          className="flex gap-2 items-center cursor-pointer bg-accent-dark text-white px-3 py-2 rounded text-sm"
        >
          <Upload size={18} />
          Upload Image
        </label>

        <input
          id="profileImage"
          type="file"
          name="profileImage"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={onImageChange}
        />
      </div>

      <p
        className={`text-center text-sm ${
          errors.profileImage ? "text-red-600" : "text-gray-500"
        }`}
      >
        Allowed *.jpeg, *.jpg, *.png <br />
        Max size 2 MB
      </p>

      {/* Status Toggle */}
      {/* <div className="flex justify-center">
        <div className="flex items-center bg-gray-100 border border-[#E8E8E9] rounded-full p-1">
          <button
            type="button"
            onClick={() => onStatusChange("active")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              status === "active"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-green-100"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => onStatusChange("inactive")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              status === "inactive"
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-red-100"
            }`}
          >
            Inactive
          </button>
        </div>
      </div> */}
      <ToggleButton
        value={status}
        onChange={onStatusChange}
        activeValue="active"
        inactiveValue="inactive"
        activeLabel="Active"
        inactiveLabel="Inactive"
      />
    </div>
  );
};

export default UserProfileCard;
