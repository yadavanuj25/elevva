import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import * as yup from "yup";
import { ArrowLeft, Upload, Save, Eye, EyeOff, User } from "lucide-react";
import Spinner from "../loaders/Spinner";
import { createUser } from "../../services/userServices";
import { useMessage } from "../../auth/MessageContext";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().required("Role is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .required("Phone is required"),
  zipcode: yup
    .string()
    .matches(/^\d+$/, "Zip Code must contain only numbers")
    .required("Zip Code is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  profileImage: yup
    .mixed()
    .test(
      "fileType",
      "Allowed formats: jpeg, jpg, png",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
    )
    .test(
      "fileSize",
      "Max size is 1 MB",
      (value) => !value || (value && value.size <= 1024 * 1024)
    ),
});
export default function UserManagement() {
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    address: "",
    country: "India",
    state: "",
    zipcode: "",
    role: "",
    about: "",
    profileImage: null,
    status: "active",
    sendWelcomeEmail: "true",
  });
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [fullCountryData, setFullCountryData] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    getAllStates();
  }, [formData.country, fullCountryData]);

  // Fetch all roles
  const getAllRoles = async () => {
    try {
      setLoadingRole(true);
      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/roles",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data.roles)) {
        setAllRoles(data.roles);
        setRoles(data.roles.map((role) => role._id));
      } else {
        console.error("Unexpected roles response:", data);
      }
    } catch (err) {
      console.error("Error fetching Roles:", err);
    } finally {
      setLoadingRole(false);
    }
  };
  // Fetch all countries
  const getAllCountries = async () => {
    try {
      setLoadingCountries(true);
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await res.json();
      if (data.data) {
        setFullCountryData(data.data);
        setCountries(data.data.map((c) => c.country));
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };
  // Fetch states when country changes
  const getAllStates = async () => {
    if (!formData.country) {
      setStates([]);
      setFormData((prev) => ({ ...prev, state: "" }));
      return;
    }
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country }),
        }
      );
      const data = await res.json();
      if (data.data?.states?.length) {
        setStates(data.data.states.map((s) => s.name));
        setFormData((prev) => ({ ...prev, state: "" }));
      } else {
        setStates([]);
        setFormData((prev) => ({ ...prev, state: "" }));
      }
    } catch (err) {
      console.error(err);
      setStates([]);
    }
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "zipcode") {
      const digits = value.replace(/\D/g, "");
      if (value !== digits) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only numbers are allowed",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: digits }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  //handle image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Allowed formats: jpeg, jpg, png",
        }));
        return;
      } else if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Max file size is 2 MB",
        }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  // Handle Status toggle
  const handleStatusToggle = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrors({});
    showError("");
    showSuccess("");
    try {
      await schema.validate(formData, { abortEarly: false });
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        dob: formData.dob,
        country: formData.country,
        state: formData.state,
        address: formData.address,
        zipcode: formData.zipcode,
        status: formData.status,
        about: formData.about,
        sendWelcomeEmail: formData.sendWelcomeEmail,
      };
      const res = await createUser(payload);
      if (res?.success) {
        showSuccess("User registered successfully!");
      } else {
        showError(res.message);
      }
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        address: "",
        country: "",
        state: "",
        zipcode: "",
        role: "",
        about: "",
        profileImage: null,
        status: "active",
        sendWelcomeEmail: true,
      });
      setProfilePreview(null);
      setStates([]);
      navigate("/admin/usermanagement/users");
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        showError(err.message);
      }
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const randomPass = Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    setFormData({ ...formData, password: randomPass });
    setShowPassword(true);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Create User</h2>
        <button
          onClick={() => navigate("/admin/usermanagement/users")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
        >
          <span className="text-red-600 font-semibold">⚠ </span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <form
        onSubmit={handleCreateUser}
        autoComplete="off"
        className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
      >
        {/* User Profile */}
        <div className="p-6 flex flex-col items-center gap-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center  rounded-md space-y-2 col-span-2">
            <div
              className={`border rounded-full p-1 ${
                errors.profileImage
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div
                className={`w-28 h-28 bg-gray-100 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400`}
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="User Profile Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
            </div>

            <label
              htmlFor="profileImage"
              className="flex gap-2 items-center cursor-pointer bg-dark text-white px-2 py-2 rounded text-sm"
            >
              <Upload size={18} />
              Upload Image
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>
          <p
            className={`text-center  ${
              errors.profileImage ? "text-red-600" : "text-[#605e5e]"
            } mb-2`}
          >
            Allowed *.jpeg, *.jpg, *.png, <br /> max size of 1 Mb{" "}
          </p>
          {/* Status Toggle */}
          <div className="flex justify-center">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full p-1">
              <button
                type="button"
                onClick={() => handleStatusToggle("active")}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  formData.status === "active"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-green-50"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => handleStatusToggle("inactive")}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  formData.status === "inactive"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-red-50"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
        {/* User Form */}
        <div className=" rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              // id="user_name"
              type="text"
              name="fullName"
              value={formData.fullName}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Full Name"
            />
            <Input
              // id="user_email"
              type="text"
              name="email"
              value={formData.email}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Email"
            />

            <div className="relative w-full">
              <Input
                // id="user_password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                handleChange={handleChange}
                errors={errors}
                labelName="Password"
                icon={
                  <span
                    onClick={togglePassword}
                    className="cursor-pointer   z-20 relative"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                }
              />

              <button
                type="button"
                onClick={generatePassword}
                className="absolute right-10 top-4 bg-light text-xs font-medium text-dark py-[2px] px-[6px] rounded whitespace-nowrap z-10"
              >
                Generate
              </button>
            </div>

            <Input
              // id="user_phone"
              type="tel"
              name="phone"
              value={formData.phone}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Phone"
            />
            <div className="relative w-full">
              <select
                id="user_role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition 
      ${
        errors.role
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600 focus:border-black"
      }`}
              >
                <option value="" disabled hidden>
                  Select role
                </option>

                {loadingRole ? (
                  <option disabled>
                    {" "}
                    <Spinner size={20} />{" "}
                  </option>
                ) : (
                  allRoles.map((role) => (
                    <option
                      key={role._id}
                      value={role._id}
                      className="text-darkBg"
                    >
                      {role.name}
                    </option>
                  ))
                )}
              </select>

              <label
                htmlFor="user_role"
                className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
      peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
      ${
        errors.role
          ? "peer-focus:text-red-500"
          : "peer-focus:text-darkBg dark:peer-focus:text-white"
      } rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
              >
                Role
              </label>

              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <Input
              // id="user_dob"
              type="date"
              name="dob"
              value={formData.dob}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="DOB"
            />

            <SelectField
              // id="country"
              name="country"
              label="Country"
              value={formData.country}
              handleChange={handleChange}
              options={countries}
              loading={loadingCountries}
              error={errors.country}
            />

            <SelectField
              // id="user_state"
              name="state"
              label="State"
              value={formData.state}
              handleChange={handleChange}
              options={states}
              error={errors.state}
            />
            {/* Remaining Inputs */}
            <Input
              // id="user_address"
              type="text"
              name="address"
              value={formData.address}
              handleChange={handleChange}
              className=""
              errors={errors}
              labelName="Address"
            />
            <Input
              // id="user_zipcode"
              type="text"
              name="zipcode"
              value={formData.zipcode}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Zip Code"
            />

            <div className="col-span-2">
              <div className="relative w-full">
                <textarea
                  // id="user_about"
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder=" "
                  className="block p-[14px] w-full text-sm bg-transparent rounded-md border  appearance-none focus:outline-none peer transition
        
          border-gray-300 dark:border-gray-600 focus:border-black"
                />
                <label
                  htmlFor="about"
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500 duration-300 transform z-10 origin-[0] bg-white dark:bg-darkBg px-2
        ${
          formData.about
            ? "top-2 scale-75 -translate-y-4 text-darkBg dark:text-white"
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2"
        }
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
        peer-focus:text-darkBg dark:peer-focus:text-white
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
      `}
                >
                  About
                </label>
              </div>
            </div>
            {/* Checkbox */}
            <div className="col-span-2 flex items-start space-x-2 mt-2">
              <input
                // id="terms"
                type="checkbox"
                name="terms"
                checked={formData.sendWelcomeEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sendWelcomeEmail: e.target.checked,
                  })
                }
                className="mt-1 w-4 h-4 border rounded focus:ring-none  cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                Send Welcome Email
              </label>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit" text="Save" icon={<Save size={18} />} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
