import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import * as yup from "yup";
import { Upload, Save, Eye, EyeOff, User } from "lucide-react";
import FormSkeleton from "../loaders/FormSkeleton";
import { getUserById } from "../../services/userServices";
import { useMessage } from "../../auth/MessageContext";
import BasicDatePicker from "../ui/BasicDatePicker";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
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
});

export default function EditUser() {
  PageTitle("Elevva | Edit-User");
  const { id } = useParams();
  const { errorMsg, showSuccess, showError } = useMessage();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    getAllRoles();
    getAllCountries();
  }, []);

  useEffect(() => {
    if (formData.country) getAllStates(formData.country);
  }, [formData.country]);

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  const getAllRoles = async () => {
    try {
      setLoadingRole(true);
      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/roles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data.roles)) {
        setAllRoles(data.roles);
        setRoles(data.roles.map((r) => r.name));
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoadingRole(false);
    }
  };

  const fetchUserById = async (userId) => {
    setLoading(true);
    try {
      const data = await getUserById(userId);
      console.log(data);
      if (data?.user) {
        const user = data.user;
        const formattedDob = user.dob
          ? new Date(user.dob).toISOString().split("T")[0]
          : "";
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          password: "",
          phone: user.phone || "",
          dob: formattedDob || "",
          address: user.address || "",
          country: user.country || "",
          state: user.state || "",
          zipcode: user.zipcode || "",
          role: user.role?._id || user.role || "",
          about: user.about || "",
          profileImage: null,
          status: user.status || "active",
          sendWelcomeEmail: true,
        });
        setLoading(false);
        if (user.profileImage) setProfilePreview(user.profileImage);
      }
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllCountries = async () => {
    try {
      setLoadingCountries(true);
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await res.json();
      if (data.data) {
        setCountries(data.data.map((c) => c.country));
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  const getAllStates = async (country) => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      const data = await res.json();
      if (data.data?.states?.length) {
        setStates(data.data.states.map((s) => s.name));
      } else {
        setStates([]);
      }
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "zipcode") {
      const digits = value.replace(/\D/g, "");
      if (value !== digits) {
        setErrors((prev) => ({ ...prev, [name]: "Only numbers allowed" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: digits }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((p) => ({ ...p, profileImage: "Invalid file type" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, profileImage: "Max size 2MB" }));
      return;
    }
    setFormData((p) => ({ ...p, profileImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStatusToggle = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    const pwd = Array.from({ length: 10 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
    setFormData((p) => ({ ...p, password: pwd }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    setDisable(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        zipcode: formData.zipcode,
        role: formData.role,
        about: formData.about,
        status: formData.status,
      };
      const res = await fetch(
        `https://crm-backend-qbz0.onrender.com/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      navigate("/admin/usermanagement/users");
      showSuccess(data.message || " User updated successfully!");
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        showError(err.message);
      }
    } finally {
      setDisable(false);
    }
  };
  const togglePassword = () => setShowPassword(!showPassword);
  const roleOptions = useMemo(() => {
    if (!Array.isArray(allRoles)) return [];

    return allRoles.map((role) => ({
      label: role.name,
      value: role._id,
    }));
  }, [allRoles]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update User</h2>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <BackButton onClick={() => navigate("/admin/usermanagement/users")} />
        </div>
      </div>
      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-[#d72b16] text-white shadow-sm animate-slideDown"
        >
          <span className=" font-semibold">⚠ {"  "}</span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}
      <div>
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
          >
            {/* User Profile */}
            <div className="p-6 flex flex-col items-center gap-4 border border-gray-300 dark:border-gray-600 rounded-md">
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
                        : "text-gray-600 hover:bg-[#28a745]"
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
            <div>
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                  value={formData.dob}
                  handleChange={handleChange}
                  errors={errors}
                  labelName="DOB"
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
                  type="text"
                  name="address"
                  value={formData.address}
                  handleChange={handleChange}
                  className=""
                  errors={errors}
                  labelName="Address"
                />
                <Input
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
                      name="about"
                      rows={4}
                      value={formData.about}
                      onChange={handleChange}
                      placeholder=" "
                      className="block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition border-gray-300 dark:border-gray-600 focus:border-dark focus:ring-1 focus:ring-dark/30"
                    />
                    <label
                      className={`absolute pointer-events-none   text-gray-500 duration-300 transform z-10 origin-[0] bg-white dark:bg-darkBg px-2
        ${
          formData.about
            ? "top-2 scale-75 -translate-y-4 text-darkBg dark:text-white"
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2"
        }
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
        peer-focus:text-darkBg dark:peer-focus:text-white
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
      `}
                    >
                      About
                    </label>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button
                    type="submit"
                    text="Update"
                    icon={<Save size={18} />}
                    loading={disable}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
