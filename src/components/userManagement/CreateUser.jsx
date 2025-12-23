// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import { createUser } from "../../services/userServices";
// import { useMessage } from "../../auth/MessageContext";
// import PageTitle from "../../hooks/PageTitle";
// import BackButton from "../ui/buttons/BackButton";
// import UserForm from "./UserForm";
// import UseScrollOnError from "../../hooks/UseScrollOnError";

// const schema = yup.object().shape({
//   fullName: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   role: yup.string().required("Role is required"),
//   phone: yup
//     .string()
//     .matches(/^\d+$/, "Only numbers are allowed")
//     .length(10, "Phone number must be exactly 10 digits")
//     .required("Phone number is required"),
//   zipcode: yup
//     .string()
//     .matches(/^\d+$/, "Zip Code must contain only numbers")
//     .length(6, "Zip code must must be exactly 6 digits")
//     .required("Zip Code is required"),
//   country: yup.string().required("Country is required"),
//   state: yup.string().required("State is required"),
//   profileImage: yup
//     .mixed()
//     .nullable()
//     .test("fileType", "Allowed formats: jpeg, jpg, png", (value) => {
//       if (!value) return true;
//       return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
//     })
//     .test("fileSize", "Max size is 2 MB", (value) => {
//       if (!value) return true;
//       return value.size <= 2 * 1024 * 1024;
//     }),
//   // address: yup.string().required("Address is required"),
// });

// export default function UserManagement() {
//   PageTitle("Elevva | Add-User");
//   const { errorMsg, showSuccess, showError } = useMessage();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     dob: "",
//     address: "",
//     country: "India",
//     state: "",
//     zipcode: "",
//     role: "",
//     about: "",
//     profileImage: null,
//     status: "active",
//     sendWelcomeEmail: true,
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [profilePreview, setProfilePreview] = useState(null);

//   UseScrollOnError(errors);

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     showError("");
//     showSuccess("");
//     setLoading(true);
//     try {
//       await schema.validate(formData, { abortEarly: false });
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//         role: formData.role,
//         dob: formData.dob,
//         country: formData.country,
//         state: formData.state,
//         address: formData.address,
//         zipcode: formData.zipcode,
//         status: formData.status,
//         about: formData.about,
//         sendWelcomeEmail: formData.sendWelcomeEmail,
//       };
//       const res = await createUser(payload);
//       if (res?.success) {
//         showSuccess("User registered successfully!");
//       } else {
//         showError(res.message);
//       }
//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         phone: "",
//         dob: "",
//         address: "",
//         country: "",
//         state: "",
//         zipcode: "",
//         role: "",
//         about: "",
//         profileImage: null,
//         status: "active",
//         sendWelcomeEmail: true,
//       });
//       setProfilePreview(null);

//       navigate("/admin/usermanagement/users");
//     } catch (err) {
//       if (err.inner) {
//         const validationErrors = {};
//         err.inner.forEach((e) => (validationErrors[e.path] = e.message));
//         setErrors(validationErrors);
//       } else {
//         showError(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
//       <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
//         <h2 className="text-2xl font-semibold">Add New User</h2>
//         <BackButton onClick={() => navigate("/admin/usermanagement/users")} />
//       </div>

//       {errorMsg && (
//         <div
//           className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300
//                bg-[#d72b16] text-white shadow-sm animate-slideDown"
//         >
//           <span className=" font-semibold">⚠ {"  "}</span>
//           <p className="text-sm">{errorMsg}</p>
//         </div>
//       )}

//       <form
//         onSubmit={handleCreateUser}
//         autoComplete="off"
//         className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
//       >
//         <UserForm
//           errors={errors}
//           setErrors={setErrors}
//           formData={formData}
//           setFormData={setFormData}
//           loading={loading}
//           profilePreview={profilePreview}
//           setProfilePreview={setProfilePreview}
//         />
//       </form>
//     </div>
//   );
// }

// Create user Old code (20/12/2025)

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import { Save } from "lucide-react";

// import UserForm from "./UserForm";
// import Button from "../ui/Button";
// import BackButton from "../ui/buttons/BackButton";
// import PageTitle from "../../hooks/PageTitle";

// import { createUser } from "../../services/userServices";
// import { useMessage } from "../../auth/MessageContext";

// const schema = yup.object().shape({
//   fullName: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().min(6).required("Password is required"),
//   role: yup.string().required("Role is required"),
//   phone: yup
//     .string()
//     .matches(/^\d+$/, "Only numbers allowed")
//     .length(10, "Phone must be 10 digits")
//     .required("Phone is required"),
//   zipcode: yup
//     .string()
//     .matches(/^\d+$/, "Only numbers allowed")
//     .length(6, "Zipcode must be 6 digits")
//     .required("Zipcode is required"),
//   country: yup.string().required("Country is required"),
//   state: yup.string().required("State is required"),
// });

// const UserManagement = () => {
//   PageTitle("Add User");

//   const navigate = useNavigate();
//   const { showSuccess, showError } = useMessage();

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     dob: "",
//     address: "",
//     country: "",
//     state: "",
//     zipcode: "",
//     role: "",
//     about: "",
//     profileImage: null,
//     status: "active",
//     sendWelcomeEmail: true,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setLoading(true);

//     try {
//       await schema.validate(formData, { abortEarly: false });

//       const payload = {
//         ...formData,
//       };

//       const res = await createUser(payload);

//       if (res?.success) {
//         showSuccess("User created successfully");
//         navigate("/admin/usermanagement/users");
//       } else {
//         showError(res?.message || "Something went wrong");
//       }
//     } catch (err) {
//       if (err.inner) {
//         const validationErrors = {};
//         err.inner.forEach((e) => {
//           validationErrors[e.path] = e.message;
//         });
//         setErrors(validationErrors);
//       } else {
//         showError(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 border rounded-xl">
//       <div className="flex justify-between items-center mb-4 border-b pb-2">
//         <h2 className="text-2xl font-semibold">Add New User</h2>
//         <BackButton onClick={() => navigate(-1)} />
//       </div>

//       <form onSubmit={handleSubmit}>
//         <UserForm
//           formData={formData}
//           setFormData={setFormData}
//           errors={errors}
//           setErrors={setErrors}
//           loading={loading}
//         />
//       </form>
//     </div>
//   );
// };

// export default UserManagement;

// Latest working code

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import UserForm from "./UserForm";
import BackButton from "../ui/buttons/BackButton";
import PageTitle from "../../hooks/PageTitle";
import { createUser } from "../../services/userServices";
import { useMessage } from "../../auth/MessageContext";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
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
});

const UserManagement = () => {
  PageTitle("Add User");
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
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
        navigate("/admin/usermanagement/users");
      } else {
        showError(res?.message || "Something went wrong");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border rounded-xl">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-semibold">Add New User</h2>
        <BackButton onClick={() => navigate(-1)} />
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <UserForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          handleChange={handleChange}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default UserManagement;
