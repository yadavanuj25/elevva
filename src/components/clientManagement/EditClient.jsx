// import React, { useEffect, useState } from "react";
// import * as yup from "yup";
// import { Save, ArrowLeft } from "lucide-react";
// import Input from "../ui/Input";
// import SelectField from "../ui/SelectField";
// import Button from "../ui/Button";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   updateClient,
//   getAllOptions,
//   getClientById,
// } from "../../services/clientServices";
// import BasicDatePicker from "../ui/BasicDatePicker";
// import FormSkeleton from "../loaders/FormSkeleton";
// import { useMessage } from "../../auth/MessageContext";
// import PageTitle from "../../hooks/PageTitle";
// import BackButton from "../ui/buttons/BackButton";
// import UseScrollOnError from "../../hooks/UseScrollOnError";
// const schema = yup.object().shape({
//   empanelmentDate: yup
//     .string()
//     .required("Empanelment date is required")
//     .test(
//       "valid-date",
//       "Invalid date format",
//       (val) => !!val && !isNaN(Date.parse(val))
//     ),

//   clientName: yup.string().required("Client name is required"),
//   clientCategory: yup.string().required("Category is required"),
//   clientSource: yup.string().required("Source is required"),
//   linkedin: yup.string().nullable(),
//   headquarterAddress: yup.string().required("Headquarter address required"),
//   branchAddress: yup.string().nullable(),
//   companySize: yup.string().required("Company size is required"),

//   aboutVendor: yup.string().nullable(),
//   instructions: yup.string().nullable(),
//   status: yup.string().required("Status is required"),

//   poc1: yup.object().shape({
//     name: yup.string().required("POC1 name is required"),
//     email: yup
//       .string()
//       .email("Invalid POC1 email")
//       .required("POC1 email is required"),
//     phone: yup
//       .string()
//       .required("POC1 phone is required")
//       .matches(/^\d{10,15}$/, "POC1 phone must be 10–15 digits"),
//     designation: yup.string().required("POC1 designation is required"),
//   }),

//   poc2: yup.object().shape({
//     name: yup.string().nullable(),
//     email: yup.string().nullable().email("Invalid POC2 email"),
//     phone: yup.string().nullable(),
//     designation: yup.string().nullable(),
//   }),
// });

// const EditClient = () => {
//   PageTitle("Elevva | Edit-Client");
//   const navigate = useNavigate();
//   const { errorMsg, showSuccess, showError } = useMessage();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     empanelmentDate: "",
//     clientName: "",
//     clientCategory: "",
//     clientSource: "",
//     website: "",
//     linkedin: "",
//     headquarterAddress: "",
//     branchAddress: "",
//     companySize: "",
//     aboutVendor: "",
//     instructions: "",
//     status: "active",

//     poc1: { name: "", email: "", phone: "", designation: "" },
//     poc2: { name: "", email: "", phone: "", designation: "" },
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [disable, setDisable] = useState(false);

//   UseScrollOnError(errors);

//   useEffect(() => {
//     fetchOptions();
//     fetchSingleClient();
//   }, []);

//   const fetchOptions = async () => {
//     try {
//       const res = await getAllOptions();
//       setOptions(res?.options || []);
//     } catch (error) {
//       showError(error || "Failed to load dropdown options");
//     }
//   };

//   const fetchSingleClient = async () => {
//     setLoading(true);
//     try {
//       const res = await getClientById(id);
//       if (res?.success) {
//         const c = res.client;
//         console.log(c);
//         setFormData({
//           empanelmentDate: c.empanelmentDate
//             ? c.empanelmentDate.split("T")[0]
//             : "",
//           clientName: c.clientName || "",
//           clientCategory: c.clientCategory || "",
//           clientSource: c.clientSource || "",
//           website: c.website || "",
//           linkedin: c.linkedin || "",
//           headquarterAddress: c.headquarterAddress || "",
//           branchAddress: c.branchAddress || "",
//           companySize: c.companySize || "",
//           aboutVendor: c.aboutVendor || "",
//           instructions: c.instructions || "",
//           status: c.status || "active",

//           poc1: {
//             name: c.poc1?.name || "",
//             email: c.poc1?.email || "",
//             phone: c.poc1?.phone || "",
//             designation: c.poc1?.designation || "",
//           },

//           poc2: {
//             name: c.poc2?.name || "",
//             email: c.poc2?.email || "",
//             phone: c.poc2?.phone || "",
//             designation: c.poc2?.designation || "",
//           },
//         });
//       }
//     } catch (error) {
//       showError(error || "Failed to fetch client");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setDisable(true);
//     try {
//       await schema.validate(formData, { abortEarly: false });
//       const res = await updateClient(id, formData);
//       if (res?.success) {
//         showSuccess(res.message || "Client updated successfully");
//         navigate("/admin/clientManagement/clients");
//         return;
//       }
//       if (res?.errors && typeof res.errors === "object") {
//         setErrors(res.errors);
//         return;
//       }

//       showError(res?.message || "Failed to update client");
//     } catch (err) {
//       if (err?.inner && Array.isArray(err.inner)) {
//         const formattedErrors = {};
//         err.inner.forEach((e) => {
//           const path = (e.path || "").replace(/\[(\w+)\]/g, ".$1");
//           formattedErrors[path] = e.message;
//         });
//         setErrors(formattedErrors);
//         return;
//       }
//       if (err?.errors && typeof err.errors === "object") {
//         setErrors(err.errors);
//         return;
//       }
//     } finally {
//       setDisable(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
//       <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
//         <h2 className="text-2xl font-semibold">Update Client</h2>

//         <BackButton
//           onClick={() => navigate("/admin/clientManagement/clients")}
//         />
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
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* MAIN FIELDS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <BasicDatePicker
//                 name="empanelmentDate"
//                 value={formData.empanelmentDate}
//                 labelName="Empanelment Date"
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Client Name"
//                 name="clientName"
//                 value={formData.clientName}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <SelectField
//                 label="Client Category"
//                 name="clientCategory"
//                 value={formData.clientCategory}
//                 handleChange={handleChange}
//                 options={options.clientCategories}
//                 error={errors.clientCategory}
//               />

//               <SelectField
//                 label="Client Source"
//                 name="clientSource"
//                 value={formData.clientSource}
//                 handleChange={handleChange}
//                 options={options.clientSources}
//                 error={errors.clientSource}
//               />

//               <Input
//                 labelName="Website"
//                 name="website"
//                 value={formData.website}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="LinkedIn"
//                 name="linkedin"
//                 value={formData.linkedin}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <SelectField
//                 label="Company Size"
//                 name="companySize"
//                 value={formData.companySize}
//                 handleChange={handleChange}
//                 options={options.companySizes}
//                 error={errors.companySize}
//               />

//               <Input
//                 labelName="Headquarter Address"
//                 name="headquarterAddress"
//                 value={formData.headquarterAddress}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Branch Address"
//                 name="branchAddress"
//                 value={formData.branchAddress}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <SelectField
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 handleChange={handleChange}
//                 options={options.statuses}
//                 error={errors.status}
//               />
//             </div>

//             {/* POC 1 */}
//             <h3 className="text-lg font-semibold mt-6">POC - 1</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 labelName="Name"
//                 name="poc1.name"
//                 value={formData.poc1.name}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Email"
//                 name="poc1.email"
//                 value={formData.poc1.email}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Phone"
//                 name="poc1.phone"
//                 value={formData.poc1.phone}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Designation"
//                 name="poc1.designation"
//                 value={formData.poc1.designation}
//                 handleChange={handleChange}
//                 errors={errors}
//               />
//             </div>

//             {/* POC 2 */}
//             <h3 className="text-lg font-semibold mt-6">POC - 2</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 labelName="Name"
//                 name="poc2.name"
//                 value={formData.poc2.name}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Email"
//                 name="poc2.email"
//                 value={formData.poc2.email}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Phone"
//                 name="poc2.phone"
//                 value={formData.poc2.phone}
//                 handleChange={handleChange}
//                 errors={errors}
//               />

//               <Input
//                 labelName="Designation"
//                 name="poc2.designation"
//                 value={formData.poc2.designation}
//                 handleChange={handleChange}
//                 errors={errors}
//               />
//             </div>

//             {/* SUBMIT BUTTON */}
//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 text="Update"
//                 icon={<Save size={18} />}
//                 loading={disable}
//               />
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditClient;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import ClientForm from "./ClientForm";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import FormSkeleton from "../loaders/FormSkeleton";
import UseScrollOnError from "../../hooks/UseScrollOnError";

import {
  updateClient,
  getAllOptions,
  getClientById,
} from "../../services/clientServices";

import { useMessage } from "../../auth/MessageContext";

const schema = yup.object().shape({
  empanelmentDate: yup
    .string()
    .required("Empanelment date is required")
    .test(
      "valid-date",
      "Invalid date format",
      (val) => !!val && !isNaN(Date.parse(val))
    ),

  clientName: yup.string().required("Client name is required"),
  clientCategory: yup.string().required("Category is required"),
  clientSource: yup.string().required("Source is required"),
  website: yup.string().url("Enter valid URL").nullable(),
  linkedin: yup.string().nullable(),

  headquarterAddress: yup.string().required("Headquarter address required"),
  branchAddress: yup.string().nullable(),
  companySize: yup.string().required("Company size is required"),

  aboutVendor: yup.string().nullable(),
  instructions: yup.string().nullable(),
  status: yup.string().required("Status is required"),

  poc1: yup.object().shape({
    name: yup.string().required("POC1 name is required"),
    email: yup
      .string()
      .email("Invalid POC1 email")
      .required("POC1 email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits")
      .required("POC1 is required"),
    designation: yup.string().required("POC1 designation is required"),
  }),

  poc2: yup.object().shape({
    name: yup.string().nullable(),
    email: yup.string().nullable().email("Invalid POC2 email"),
    phone: yup
      .string()
      .nullable()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits"),
    designation: yup.string().nullable(),
  }),
});

const EditClient = () => {
  PageTitle("Elevva | Edit-Client");
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError, errorMsg } = useMessage();

  const [formData, setFormData] = useState({
    empanelmentDate: "",
    clientName: "",
    clientCategory: "",
    clientSource: "",
    website: "",
    linkedin: "",
    headquarterAddress: "",
    branchAddress: "",
    companySize: "",
    aboutVendor: "",
    instructions: "",
    status: "active",
    poc1: { name: "", email: "", phone: "", designation: "" },
    poc2: { name: "", email: "", phone: "", designation: "" },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // UseScrollOnError(errors);

  useEffect(() => {
    fetchOptions();
    fetchClient();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAllOptions();
      setOptions(res?.options || {});
    } catch (err) {
      showError("Failed to load dropdown options");
    }
  };

  const fetchClient = async () => {
    setLoading(true);
    try {
      const res = await getClientById(id);
      if (res?.success) {
        const c = res.client;

        setFormData({
          empanelmentDate: c.empanelmentDate
            ? c.empanelmentDate.split("T")[0]
            : "",
          clientName: c.clientName || "",
          clientCategory: c.clientCategory || "",
          clientSource: c.clientSource || "",
          website: c.website || "",
          linkedin: c.linkedin || "",
          headquarterAddress: c.headquarterAddress || "",
          branchAddress: c.branchAddress || "",
          companySize: c.companySize || "",
          aboutVendor: c.aboutVendor || "",
          instructions: c.instructions || "",
          status: c.status || "active",

          poc1: {
            name: c.poc1?.name || "",
            email: c.poc1?.email || "",
            phone: c.poc1?.phone || "",
            designation: c.poc1?.designation || "",
          },

          poc2: {
            name: c.poc2?.name || "",
            email: c.poc2?.email || "",
            phone: c.poc2?.phone || "",
            designation: c.poc2?.designation || "",
          },
        });
      }
    } catch (err) {
      showError("Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      // Clean POC2 empty fields (same as AddClient)
      const cleanedPoc2 = Object.fromEntries(
        Object.entries(formData.poc2 || {}).map(([k, v]) => [
          k,
          v === "" ? undefined : v,
        ])
      );

      const cleanedData = {
        ...formData,
        poc2: Object.values(cleanedPoc2).some(Boolean)
          ? cleanedPoc2
          : undefined,
      };

      // Validate with Yup schema
      await schema.validate(cleanedData, { abortEarly: false });

      // Submit update
      const res = await updateClient(id, cleanedData);

      if (res?.success) {
        showSuccess(res.message || "Client updated successfully");
        navigate("/admin/clientManagement/clients");
        return;
      }

      showError(res?.message || "Failed to update client");
    } catch (err) {
      // Same Yup error handling as AddClient
      if (err?.inner && Array.isArray(err.inner)) {
        const newErrors = {};
        err.inner.forEach((e) => {
          const path = (e.path || "").replace(/\[(\w+)\]/g, ".$1");
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
        return;
      }

      if (err?.errors && typeof err.errors === "object") {
        setErrors(err.errors);
        return;
      }

      showError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update Client</h2>
        <BackButton
          onClick={() => navigate("/admin/clientManagement/clients")}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 bg-[#d72b16] text-white shadow-sm">
          ⚠ {errorMsg}
        </div>
      )}

      {loading ? (
        <FormSkeleton rows={6} />
      ) : (
        <ClientForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          handleSubmit={handleSubmit}
          loading={submitting}
          options={options}
        />
      )}
    </div>
  );
};

export default EditClient;
