import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, EyeOff, Save } from "lucide-react";
import {
  getCountries,
  getStatesByCountry,
} from "../../services/commonServices";
import { getRoles } from "../../services/roleServices";
import UserProfileCard from "./UserProfileCard";
import Input from "../ui/Input";
import BasicDatePicker from "../ui/BasicDatePicker";
import SelectField from "../ui/SelectField";
import Textareafield from "../ui/formFields/Textareafield";
import Button from "../ui/Button";
import ToggleButton from "../ui/buttons/ToggleButton";
import { getAllUsers } from "../../services/userServices";
import { getShift } from "../../services/hrmsServices";

const department = [
  {
    value: "Technical / Development",
    label: "Technical / Development",
  },
  {
    value: "HR- Talent acquisition",
    label: "HR- Talent acquisition",
  },
  {
    value: "Finance & Accounts",
    label: "Finance & Accounts",
  },
  {
    value: "Sales & Marketing",
    label: "Sales & Marketing",
  },
  {
    value: "Customer Support",
    label: "Customer Support",
  },
];

const UserForm = ({
  title,
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  activeTab,
  handleChange,
}) => {
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [reportingManager, setReportingManager] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchCountries();
    fetchUsers();
    fetchShifts();
  }, []);

  useEffect(() => {
    if (formData.country) fetchStates();
  }, [formData.country]);

  useEffect(() => {
    if (formData.profileImage && typeof formData.profileImage === "string") {
      setProfilePreview(formData.profileImage);
    }
  }, [formData.profileImage]);

  const fetchUsers = async () => {
    const data = await getAllUsers(1, 50, "active");
    setReportingManager(data?.users || []);
  };
  const fetchRoles = async () => {
    setLoadingRole(true);
    const res = await getRoles();
    setRoles(res?.roles || []);
    setLoadingRole(false);
  };
  const fetchCountries = async () => {
    setLoadingCountries(true);
    const res = await getCountries();
    setCountries(res?.data?.map((c) => c.country) || []);
    setLoadingCountries(false);
  };
  const fetchStates = async () => {
    const res = await getStatesByCountry(formData.country);
    setStates(res?.data?.states?.map((s) => s.name) || []);
  };
  const fetchShifts = async () => {
    const res = await getShift();
    setShifts(res?.data || []);
  };
  const shiftOptions = useMemo(
    () =>
      shifts.map((r) => ({
        label: `${r.name}  :  ${r.startTime} - ${r.endTime}`,
        value: r._id,
      })),
    [shifts],
  );
  const roleOptions = useMemo(
    () =>
      roles.map((r) => ({
        label: r.name,
        value: r._id,
      })),
    [roles],
  );
  const managerOptions = useMemo(
    () => reportingManager.map((r) => ({ label: r.fullName, value: r._id })),
    [reportingManager],
  );

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        profileImage: "Image must be under 2MB",
      }));
      return;
    }

    setErrors((p) => ({ ...p, profileImage: "" }));
    setFormData((p) => ({ ...p, profileImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStatusToggle = (status) => {
    setFormData((p) => ({ ...p, status }));
  };

  const togglePassword = () => setShowPassword((p) => !p);

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    setFormData((p) => ({ ...p, password }));
    setErrors((p) => ({ ...p, password: "" }));
  };

  const handleAttendanceToggle = (value) => {
    setFormData((p) => ({ ...p, attendanceEnabled: value }));
    setErrors((p) => ({ ...p, attendanceEnabled: true }));
  };

  return (
    <>
      {activeTab === "Basic Information" && (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-4 items-stretch">
          <UserProfileCard
            profilePreview={profilePreview}
            errors={errors}
            status={formData.status}
            onImageChange={handleProfileImageChange}
            onStatusChange={handleStatusToggle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="fullName"
              labelName="Full Name"
              value={formData.fullName}
              handleChange={handleChange}
              errors={errors}
            />

            <Input
              name="email"
              labelName="Email"
              value={formData.email}
              handleChange={handleChange}
              errors={errors}
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                labelName="Password"
                value={formData.password}
                handleChange={handleChange}
                errors={errors}
                icon={
                  <span onClick={togglePassword} className="cursor-pointer">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                }
              />
              <button
                type="button"
                onClick={generatePassword}
                className="absolute right-10 top-4 text-xs text-white bg-accent-dark px-0.5 py-0.5 rounded"
              >
                Generate
              </button>
            </div>

            <Input
              type="tel"
              name="phone"
              labelName="Phone"
              value={formData.phone}
              handleChange={handleChange}
              errors={errors}
            />

            <SelectField
              name="role"
              label="Role"
              value={formData.role}
              options={roleOptions}
              handleChange={handleChange}
              loading={loadingRole}
              error={errors.role}
            />

            <BasicDatePicker
              name="dob"
              labelName="DOB"
              value={formData.dob}
              handleChange={handleChange}
              errors={errors}
            />

            <SelectField
              name="country"
              label="Country"
              value={formData.country}
              handleChange={handleChange}
              options={countries}
              loading={loadingCountries}
              error={errors.country}
            />

            <SelectField
              name="state"
              label="State"
              value={formData.state}
              handleChange={handleChange}
              options={states}
              error={errors.state}
            />

            <Input
              name="address"
              labelName="Address"
              value={formData.address}
              handleChange={handleChange}
              errors={errors}
            />

            <Input
              name="zipcode"
              labelName="Zip Code"
              value={formData.zipcode}
              handleChange={handleChange}
              errors={errors}
            />

            <div className="col-span-2">
              <Textareafield
                name="about"
                label="About"
                value={formData.about}
                handleChange={handleChange}
              />
            </div>
            {!id && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sendWelcomeEmail: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 border rounded focus:ring-none cursor-pointer"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  Send Welcome Email
                </label>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "Employee & Work details" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="shift"
              label="Shift"
              value={formData.shift}
              options={shiftOptions}
              handleChange={handleChange}
              loading={loadingRole}
              error={errors.shift}
            />

            <BasicDatePicker
              name="joiningDate"
              labelName="Joining Date"
              value={formData.joiningDate}
              handleChange={handleChange}
              errors={errors}
            />

            <SelectField
              name="department"
              label="Department"
              value={formData.department}
              handleChange={handleChange}
              options={department}
              loading={loadingCountries}
              error={errors.department}
            />

            <Input
              name="designation"
              labelName="Designation"
              value={formData.designation}
              handleChange={handleChange}
              errors={errors}
            />

            <SelectField
              name="reportingManager"
              label="Reporting Manager"
              value={formData.reportingManager}
              handleChange={handleChange}
              options={managerOptions}
              error={errors.reportingManager}
            />

            <ToggleButton
              label="Attendance Enabled"
              value={formData.attendanceEnabled}
              onChange={handleAttendanceToggle}
              activeValue={true}
              inactiveValue={false}
              activeLabel="Yes"
              inactiveLabel="No"
            />
          </div>
        </div>
      )}

      <div
        className={`col-span-2 flex justify-end items-center ${title == "Update" ? "mt-2" : ""}`}
      >
        <Button
          type="submit"
          text={`${title == "Update" ? "Update" : "Submit"}`}
          icon={<Save size={18} />}
          loading={loading}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default UserForm;
