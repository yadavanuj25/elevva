// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getCountries,
//   getStatesByCountry,
// } from "../../services/commonServices";
// import { getRoles } from "../../services/roleServices";
// import UserProfileCard from "./UserProfileCard";
// import Input from "../ui/Input";
// import BasicDatePicker from "../ui/BasicDatePicker";
// import SelectField from "../ui/SelectField";
// import Textareafield from "../ui/formFields/Textareafield";
// import { Eye, EyeOff, Save } from "lucide-react";
// import Button from "../ui/Button";

// const UserForm = ({ errors, formData, setFormData, setErrors, loading }) => {
//   const { id } = useParams();
//   const [showPassword, setShowPassword] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [loadingRole, setLoadingRole] = useState(false);
//   const [loadingCountries, setLoadingCountries] = useState(false);
//   const [profilePreview, setProfilePreview] = useState(null);

//   useEffect(() => {
//     fetchRoles();
//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     if (!formData.country) return;
//     fetchStates();
//   }, [formData.country]);

//   const fetchRoles = async () => {
//     try {
//       setLoadingRole(true);
//       const res = await getRoles();
//       setRoles(res.roles || []);
//     } catch (err) {
//       console.error("Role fetch error", err);
//     } finally {
//       setLoadingRole(false);
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       setLoadingCountries(true);
//       const res = await getCountries();
//       setCountries(res?.data?.map((c) => c.country) || []);
//     } catch (err) {
//       console.error("Country fetch error", err);
//     } finally {
//       setLoadingCountries(false);
//     }
//   };

//   const fetchStates = async () => {
//     try {
//       const res = await getStatesByCountry(formData.country);
//       setStates(res?.data?.states?.map((s) => s.name) || []);
//     } catch (err) {
//       console.error("State fetch error", err);
//       setStates([]);
//     }
//   };

//   const roleOptions = useMemo(() => {
//     return roles.map((r) => ({
//       label: r.name,
//       value: r._id,
//     }));
//   }, [roles]);

//   const generatePassword = () => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
//     const pwd = Array.from({ length: 10 })
//       .map(() => chars[Math.floor(Math.random() * chars.length)])
//       .join("");
//     setFormData((p) => ({ ...p, password: pwd }));
//   };

//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleStatusToggle = (status) => {
//     setFormData((prev) => ({ ...prev, status }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value);

//     if (name === "phone" || name === "zipcode") {
//       const digits = value.replace(/\D/g, "");
//       if (value !== digits) {
//         setErrors((prev) => ({ ...prev, [name]: "Only numbers allowed" }));
//       } else {
//         setFormData((prev) => ({ ...prev, [name]: digits }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleProfileImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
//       setErrors((p) => ({ ...p, profileImage: "Invalid file type" }));
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       setErrors((p) => ({ ...p, profileImage: "Max size 2MB" }));
//       return;
//     }
//     setFormData((p) => ({ ...p, profileImage: file }));
//     const reader = new FileReader();
//     reader.onloadend = () => setProfilePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   return (
// <>
//   {/* User Profile */}
//   <UserProfileCard
//     profilePreview={profilePreview}
//     errors={errors}
//     status={formData.status}
//     onImageChange={handleProfileImageChange}
//     onStatusChange={handleStatusToggle}
//   />
//   {/* User Form */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     <Input
//       type="text"
//       name="fullName"
//       value={formData.fullName}
//       handleChange={handleChange}
//       className="col-span-2 md:col-span-1"
//       errors={errors}
//       labelName="Full Name"
//     />
//     <Input
//       type="text"
//       name="email"
//       value={formData.email}
//       handleChange={handleChange}
//       className="col-span-2 md:col-span-1"
//       errors={errors}
//       labelName="Email"
//     />

//     <div className="relative w-full">
//       <Input
//         type={showPassword ? "text" : "password"}
//         name="password"
//         value={formData.password}
//         handleChange={handleChange}
//         errors={errors}
//         labelName="Password"
//         icon={
//           <span
//             onClick={togglePassword}
//             className="cursor-pointer   z-20 relative"
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </span>
//         }
//       />
//       <button
//         type="button"
//         onClick={generatePassword}
//         className="absolute right-10 top-4 bg-accent-light text-xs font-medium text-accent-dark py-[2px] px-[6px] rounded whitespace-nowrap z-10"
//       >
//         Generate
//       </button>
//     </div>

//     <Input
//       type="tel"
//       name="phone"
//       value={formData.phone}
//       handleChange={handleChange}
//       className="col-span-2 md:col-span-1"
//       errors={errors}
//       labelName="Phone"
//     />

//     <SelectField
//       name="role"
//       label="Role"
//       value={formData.role}
//       options={roleOptions}
//       handleChange={handleChange}
//       loading={loadingRole}
//       error={errors.role}
//     />

//     <BasicDatePicker
//       name="dob"
//       value={formData.dob}
//       handleChange={handleChange}
//       errors={errors}
//       labelName="DOB"
//     />

//     <SelectField
//       name="country"
//       label="Country"
//       value={formData.country}
//       handleChange={handleChange}
//       options={countries}
//       loading={loadingCountries}
//       error={errors.country}
//     />

//     <SelectField
//       name="state"
//       label="State"
//       value={formData.state}
//       handleChange={handleChange}
//       options={states}
//       error={errors.state}
//     />

//     <Input
//       type="text"
//       name="address"
//       value={formData.address}
//       handleChange={handleChange}
//       className=""
//       errors={errors}
//       labelName="Address"
//     />
//     <Input
//       type="text"
//       name="zipcode"
//       value={formData.zipcode}
//       handleChange={handleChange}
//       className="col-span-2 md:col-span-1"
//       errors={errors}
//       labelName="Zip Code"
//     />

//     <div className="col-span-2">
//       <Textareafield
//         name="about"
//         label="About"
//         value={formData.about}
//         handleChange={handleChange}
//       />
//     </div>
// <div
//   className={`col-span-2 flex items-center ${
//     id ? "justify-end" : "justify-between"
//   } `}
// >
//   {!id && (
//     <div>
//       <input
//         type="checkbox"
//         name="sendWelcomeEmail"
//         checked={formData.sendWelcomeEmail}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             sendWelcomeEmail: e.target.checked,
//           })
//         }
//         className="mt-1 w-4 h-4 border rounded focus:ring-none  cursor-pointer"
//       />
//       <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
//         Send Welcome Email
//       </label>
//     </div>
//   )}
//   <Button
//     type="submit"
//     text="Submit"
//     icon={<Save size={18} />}
//     loading={loading}
//   />
// </div>
//   </div>
// </>
//   );
// };

// export default UserForm;

// Latest working code

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

const UserForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  handleChange,
}) => {
  const { id } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) fetchStates();
  }, [formData.country]);

  useEffect(() => {
    if (formData.profileImage && typeof formData.profileImage === "string") {
      setProfilePreview(formData.profileImage);
    }
  }, [formData.profileImage]);

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

  const roleOptions = useMemo(
    () => roles.map((r) => ({ label: r.name, value: r._id })),
    [roles]
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
  };

  return (
    <div
      div
      className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
    >
      <UserProfileCard
        profilePreview={profilePreview}
        errors={errors}
        status={formData.status}
        onImageChange={handleProfileImageChange}
        onStatusChange={handleStatusToggle}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
            className="absolute right-10 top-4 text-xs bg-accent-dark px-0.5 py-0.5 rounded"
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
        <div
          className={`col-span-2  flex ${
            id ? "justify-end" : "justify-between"
          }  items-center `}
        >
          {!id && (
            <div className="flex  items-center gap-2">
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
                className="mt-1 w-4 h-4 border rounded focus:ring-none  cursor-pointer"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                Send Welcome Email
              </label>
            </div>
          )}

          <Button
            type="submit"
            text="Submit"
            icon={<Save size={18} />}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
