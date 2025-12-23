// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import FormSkeleton from "../loaders/FormSkeleton";
// import { getUserById, updateUser } from "../../services/userServices";
// import { useMessage } from "../../auth/MessageContext";
// import PageTitle from "../../hooks/PageTitle";
// import BackButton from "../ui/buttons/BackButton";
// import UserForm from "./UserForm";
// import UseScrollOnError from "../../hooks/UseScrollOnError";

// const schema = yup.object().shape({
//   fullName: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
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
// });

// export default function EditUser() {
//   PageTitle("Elevva | Edit-User");
//   const { id } = useParams();
//   const { errorMsg, showSuccess, showError } = useMessage();
//   const navigate = useNavigate();
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
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [profilePreview, setProfilePreview] = useState(null);
//   UseScrollOnError(errors);

//   useEffect(() => {
//     if (id) fetchUserById(id);
//   }, [id]);

//   const fetchUserById = async (userId) => {
//     setLoading(true);
//     try {
//       const data = await getUserById(userId);
//       console.log(data);
//       if (data?.user) {
//         const user = data.user;
//         const formattedDob = user.dob
//           ? new Date(user.dob).toISOString().split("T")[0]
//           : "";
//         setFormData({
//           fullName: user.fullName || "",
//           email: user.email || "",
//           password: "",
//           phone: user.phone || "",
//           dob: formattedDob || "",
//           address: user.address || "",
//           country: user.country || "",
//           state: user.state || "",
//           zipcode: user.zipcode || "",
//           role: user.role?._id || user.role || "",
//           about: user.about || "",
//           profileImage: null,
//           status: user.status || "active",
//           sendWelcomeEmail: true,
//         });
//         setLoading(false);
//       }
//     } catch (err) {
//       showError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     showError("");
//     showSuccess("");
//     setErrors({});
//     try {
//       await schema.validate(formData, { abortEarly: false });
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password || undefined,
//         phone: formData.phone,
//         dob: formData.dob,
//         address: formData.address,
//         country: formData.country,
//         state: formData.state,
//         zipcode: formData.zipcode,
//         role: formData.role,
//         about: formData.about,
//         status: formData.status,
//       };

//       const res = await updateUser(id, payload);

//       if (!res || res.error === true || res.success === false) {
//         throw new Error(res?.message || "Failed to update user");
//       }

//       navigate("/admin/usermanagement/users");
//       showSuccess(res.message || "User updated successfully");
//     } catch (err) {
//       if (err.name === "ValidationError" && err.inner) {
//         const validationErrors = {};
//         err.inner.forEach((e) => {
//           validationErrors[e.path] = e.message;
//         });
//         setErrors(validationErrors);
//         return;
//       }
//       showError(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
//       <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
//         <h2 className="text-2xl font-semibold">Update User</h2>
//         <div className="flex items-center gap-3 mt-3 sm:mt-0">
//           <BackButton onClick={() => navigate("/admin/usermanagement/users")} />
//         </div>
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
//       <div>
//         {loading ? (
//           <FormSkeleton rows={6} />
//         ) : (
//           <form
//             onSubmit={handleSubmit}
//             autoComplete="off"
//             className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
//           >
//             <UserForm
//               errors={errors}
//               setErrors={setErrors}
//               formData={formData}
//               setFormData={setFormData}
//               loading={loading}
//               profilePreview={profilePreview}
//               setProfilePreview={setProfilePreview}
//             />
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import FormSkeleton from "../loaders/FormSkeleton";
// import { getUserById, updateUser } from "../../services/userServices";
// import { useMessage } from "../../auth/MessageContext";
// import PageTitle from "../../hooks/PageTitle";
// import BackButton from "../ui/buttons/BackButton";
// import UserForm from "./UserForm";
// import UseScrollOnError from "../../hooks/UseScrollOnError";

// const schema = yup.object().shape({
//   fullName: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   role: yup.string().required("Role is required"),
//   phone: yup
//     .string()
//     .matches(/^\d+$/, "Only numbers are allowed")
//     .length(10, "Phone number must be exactly 10 digits")
//     .required("Phone number is required"),
//   zipcode: yup
//     .string()
//     .matches(/^\d+$/, "Zip Code must contain only numbers")
//     .length(6, "Zip code must be exactly 6 digits")
//     .required("Zip Code is required"),
//   country: yup.string().required("Country is required"),
//   state: yup.string().required("State is required"),
// });

// export default function EditUser() {
//   PageTitle("Elevva | Edit-User");

//   const { id } = useParams();
//   const { errorMsg, showSuccess, showError } = useMessage();
//   const navigate = useNavigate();

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

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   UseScrollOnError(errors);

//   useEffect(() => {
//     if (id) fetchUserById(id);
//   }, [id]);

//   const fetchUserById = async (userId) => {
//     setLoading(true);
//     try {
//       const data = await getUserById(userId);
//       if (data?.user) {
//         const user = data.user;
//         const formattedDob = user.dob
//           ? new Date(user.dob).toISOString().split("T")[0]
//           : "";
//         setFormData({
//           fullName: user.fullName || "",
//           email: user.email || "",
//           password: "",
//           phone: user.phone || "",
//           dob: formattedDob,
//           address: user.address || "",
//           country: user.country || "",
//           state: user.state || "",
//           zipcode: user.zipcode || "",
//           role: user.role?._id || user.role || "",
//           about: user.about || "",
//           profileImage: user.profileImage || null,
//           status: user.status || "active",
//           sendWelcomeEmail: true,
//         });
//       }
//     } catch (err) {
//       showError(err.message || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     showError("");
//     showSuccess("");
//     setErrors({});

//     try {
//       await schema.validate(formData, { abortEarly: false });

//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password || undefined,
//         phone: formData.phone,
//         dob: formData.dob,
//         address: formData.address,
//         country: formData.country,
//         state: formData.state,
//         zipcode: formData.zipcode,
//         role: formData.role,
//         about: formData.about,
//         status: formData.status,
//         sendWelcomeEmail: formData.sendWelcomeEmail,
//       };

//       const res = await updateUser(id, payload);

//       if (!res || res.error || res.success === false) {
//         throw new Error(res?.message || "Failed to update user");
//       }

//       showSuccess(res.message || "User updated successfully");
//       navigate("/admin/usermanagement/users");
//     } catch (err) {
//       if (err.name === "ValidationError" && err.inner) {
//         const validationErrors = {};
//         err.inner.forEach((e) => {
//           validationErrors[e.path] = e.message;
//         });
//         setErrors(validationErrors);
//         return;
//       }
//       showError(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
//       <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
//         <h2 className="text-2xl font-semibold">Update User</h2>
//         <BackButton onClick={() => navigate("/admin/usermanagement/users")} />
//       </div>

//       {errorMsg && (
//         <div className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 bg-[#d72b16] text-white shadow-sm animate-slideDown">
//           <span className="font-semibold">⚠{"  "}</span>
//           <p className="text-sm">{errorMsg}</p>
//         </div>
//       )}

//       {loading ? (
//         <FormSkeleton rows={6} />
//       ) : (
//         <form onSubmit={handleSubmit} autoComplete="off">
//           <UserForm
//             formData={formData}
//             setFormData={setFormData}
//             errors={errors}
//             setErrors={setErrors}
//             loading={loading}
//           />
//         </form>
//       )}
//     </div>
//   );
// }

// Latest working code

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import FormSkeleton from "../loaders/FormSkeleton";
import { getUserById, updateUser } from "../../services/userServices";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import UserForm from "./UserForm";
import UseScrollOnError from "../../hooks/UseScrollOnError";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone must contain only numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .required("Phone is required"),
  zipcode: yup
    .string()
    .matches(/^\d+$/, "Zip Code must contain only numbers")
    .length(6, "Zip code must be exactly 6 digits")
    .required("Zip Code is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
});

export default function EditUser() {
  PageTitle("Elevva | Edit-User");

  const { id } = useParams();
  const { errorMsg, showSuccess, showError } = useMessage();
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // UseScrollOnError(errors);

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  const fetchUserById = async (userId) => {
    setLoading(true);
    try {
      const data = await getUserById(userId);
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
          dob: formattedDob,
          address: user.address || "",
          country: user.country || "",
          state: user.state || "",
          zipcode: user.zipcode || "",
          role: user.role?._id || user.role || "",
          about: user.about || "",
          profileImage: user.profileImage || null,
          status: user.status || "active",
          sendWelcomeEmail: true,
        });
      }
    } catch (err) {
      showError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

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

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    setErrors({});

    try {
      await schema.validate(formData, { abortEarly: false });

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        zipcode: formData.zipcode,
        role: formData.role,
        about: formData.about,
        status: formData.status,
        sendWelcomeEmail: formData.sendWelcomeEmail,
      };

      const res = await updateUser(id, payload);

      if (!res || res.error || res.success === false) {
        throw new Error(res?.message || "Failed to update user");
      }

      showSuccess(res.message || "User updated successfully");
      navigate("/admin/usermanagement/users");
    } catch (err) {
      if (err.name === "ValidationError" && err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        return;
      }
      showError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update User</h2>
        <BackButton onClick={() => navigate("/admin/usermanagement/users")} />
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 bg-[#d72b16] text-white shadow-sm animate-slideDown">
          <span className="font-semibold">⚠{"  "}</span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <FormSkeleton rows={6} />
      ) : (
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
      )}
    </div>
  );
}
