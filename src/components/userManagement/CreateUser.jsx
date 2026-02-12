import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import UserForm from "./UserForm";
import BackButton from "../ui/buttons/BackButton";
import PageTitle from "../../hooks/PageTitle";
import { createUser } from "../../services/userServices";
import { useMessage } from "../../auth/MessageContext";
import UserTabs from "./UserTabs";

// Combined schema for all fields
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
    .matches(/^[0-9]+$/, "Phone must contain only numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .required("Phone is required"),
  zipcode: yup
    .string()
    .matches(/^\d+$/, "Only numbers allowed")
    .length(6, "Zipcode must be 6 digits")
    .required("Zipcode is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  shift: yup.string().required("Shift is required"),
  attendanceEnabled: yup.boolean().required("Attendance enabled is required"),
  joiningDate: yup
    .date()
    .typeError("Joining date is required")
    .required("Joining date is required")
    .max(new Date(), "Joining date cannot be in the future"),
  department: yup.string().required("Department is required"),
  designation: yup
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters")
    .required("Designation is required"),
  reportingManager: yup.string().required("Reporting manager is required"),
});

const UserManagement = () => {
  PageTitle("Add User");
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("Basic Information");
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
    shift: "",
    attendanceEnabled: true,
    joiningDate: null,
    department: "",
    designation: "",
    reportingManager: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
      setErrors((p) => ({ ...p, [name]: "" }));
      return;
    }
    if (name === "phone" || name === "zipcode") {
      const digits = value.replace(/\D/g, "");
      setFormData((p) => ({ ...p, [name]: digits }));
      setErrors((p) => ({
        ...p,
        [name]: value !== digits ? "Only numbers allowed" : "",
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      const payload = { ...formData };
      const res = await createUser(payload);
      if (res?.success) {
        showSuccess("User created successfully");
        navigate("/users");
      } else {
        showError(res?.message || "Something went wrong");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        const userTabFields = [
          "fullName",
          "email",
          "password",
          "role",
          "phone",
          "zipcode",
          "country",
          "state",
        ];
        let hasUserTabError = false;
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
          if (userTabFields.includes(e.path)) {
            hasUserTabError = true;
          }
        });
        setErrors(validationErrors);
        // Navigate to first tab with errors
        if (hasUserTabError) {
          setActiveTab("Basic Information");
        } else {
          setActiveTab("Employee & Work details");
        }
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2>Add New User</h2>
        <BackButton onClick={() => navigate(-1)} />
      </div>
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <form onSubmit={handleSubmit} autoComplete="off">
        <UserForm
          title="Add"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          handleChange={handleChange}
          loading={loading}
          activeTab={activeTab}
        />
      </form>
    </div>
  );
};

export default UserManagement;
