import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { Save, ArrowLeft } from "lucide-react";
import * as yup from "yup";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  addClientsRequirement,
  getActiveClients,
  getAllClients,
  getRequirementsOptions,
} from "../../services/clientServices";
import BasicDatePicker from "../ui/BasicDatePicker";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import Textareafield from "../ui/formFields/Textareafield";

const schema = yup.object().shape({
  client: yup.string().required("Client is required"),
  requirementPriority: yup
    .string()
    .required("Requirement priority is required"),
  positionStatus: yup.string().required("Position status is required"),
  techStack: yup.string().required("Tech stack is required"),
  experience: yup.string().required("Experience is required"),
  budgetType: yup.string().required("Budget type is required"),
  currency: yup.string().required("Currency is required"),
  budget: yup.string().required("Budget is required"),
  totalPositions: yup.string().required("Total positions required"),
  workRole: yup.string().required("Work role is required"),
  workMode: yup.string().required("Work mode is required"),
  workLocation: yup.string().required("Work location is required"),
  jobDescription: yup
    .string()
    .trim()
    .min(50, "Job description must be at least 50 characters")
    .required("Job description is required"),
});

const ClientRequirement = () => {
  PageTitle("Elevva | Add-Client Requirement");
  const { errorMsg, showSuccess, showError } = useMessage();
  const jobDescriptionRef = useRef("");
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client: "",
    requirementPriority: "",
    positionStatus: "",
    techStack: "",
    experience: "",
    budgetType: "",
    currency: "",
    budget: "",
    totalPositions: "",
    workRole: "",
    workMode: "",
    workLocation: "",
    otherInformation: "",
    expectedClosureDate: "",
  });
  const [activeClients, setActiveClients] = useState([]);
  const [options, setOptions] = useState({
    statuses: [],
    experiences: [],
    budgetTypes: [],
    currencies: [],
    workModes: [],
    workRole: [],
    priorities: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveClients();
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    try {
      const data = await getRequirementsOptions();
      if (!data || typeof data !== "object") {
        console.error("Invalid options response");
        return;
      }
      setOptions(data.options);
    } catch (error) {
      console.error("Error fetching options:", error);
      showError("Failed to load dropdown options");
    }
  };

  const fetchActiveClients = async () => {
    try {
      const res = await getAllClients(undefined, undefined, "active");
      setActiveClients(res.clients);
    } catch (error) {
      console.log(error);
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", base64);
      };
      reader.readAsDataURL(file);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: { matchVisual: true },
    }),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let errorMsg = "";
    if (["budget", "totalPositions"].includes(name)) {
      const cleanValue = ["budget"].includes(name)
        ? value.replace(/,/g, "")
        : value.replace(/\D/g, "");
      if (["totalPositions"].includes(name) && value !== cleanValue) {
        errorMsg = "Only numbers are allowed";
      }
      if (["budget"].includes(name)) {
        if (cleanValue && !isNaN(cleanValue)) {
          newValue = new Intl.NumberFormat("en-IN").format(Number(cleanValue));
        } else {
          newValue = "";
        }
      } else {
        newValue = cleanValue;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleQuillChange = (content, delta, source, editor) => {
    jobDescriptionRef.current = editor.getHTML();
    setErrors((prev) => ({ ...prev, jobDescription: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    showError("");
    showSuccess("");
    setLoading(true);
    const finalData = {
      ...formData,
      jobDescription: jobDescriptionRef.current,
    };
    try {
      await schema.validate(finalData, { abortEarly: false });
      const res = await addClientsRequirement(finalData);
      if (res?.success) {
        showSuccess(res.message);
        navigate("/admin/clientmanagement/clientrequirements");
      } else {
        showError(res?.message || "Failed to add client requirements");
      }
    } catch (err) {
      if (err?.inner && Array.isArray(err.inner)) {
        const newErrors = {};
        err.inner.forEach((e) => {
          const path = (e.path || "").replace(/\[(\w+)\]/g, ".$1");
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
      } else {
        showError("Validation error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Add New Requirement</h2>
        <BackButton
          onClick={() => navigate("/admin/clientManagement/clientRequirements")}
        />
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

      <form onSubmit={handleSubmit} className="space-y-6 ">
        <div className="section">
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600 ">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="client"
              label="Client"
              value={formData.client}
              options={activeClients.map((c) => ({
                label: c.clientName,
                value: c._id,
              }))}
              handleChange={handleChange}
              error={errors.client}
            />

            <SelectField
              name="requirementPriority"
              label="Requirement Priority"
              value={formData.requirementPriority}
              options={options.priorities}
              handleChange={handleChange}
              error={errors.requirementPriority}
            />
            <SelectField
              name="positionStatus"
              label="Position Status"
              value={formData.positionStatus}
              options={options.statuses}
              handleChange={handleChange}
              error={errors.positionStatus}
            />
            <SelectField
              name="experience"
              label="Experience"
              value={formData.experience}
              options={options.experiences}
              handleChange={handleChange}
              error={errors.experience}
            />
          </div>
        </div>

        <div className="section">
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600 ">
            Work Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="workRole"
              label="Work Role"
              value={formData.workRole}
              options={options.workRole}
              handleChange={handleChange}
              error={errors.workRole}
            />
            <SelectField
              name="workMode"
              label="Work Mode"
              value={formData.workMode}
              options={options.workModes}
              handleChange={handleChange}
              error={errors.workMode}
            />
            <Input
              name="workLocation"
              value={formData.workLocation}
              handleChange={handleChange}
              labelName="Work Location"
              errors={errors}
            />
            <Input
              name="totalPositions"
              value={formData.totalPositions}
              handleChange={handleChange}
              labelName="Total Positions"
              errors={errors}
            />
          </div>
        </div>

        <div className="section">
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Budget Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="budgetType"
              label="Budget Type"
              value={formData.budgetType}
              options={options.budgetTypes}
              handleChange={handleChange}
              error={errors.budgetType}
            />
            <SelectField
              name="currency"
              label="Currency"
              value={formData.currency}
              options={options.currencies}
              handleChange={handleChange}
              error={errors.currency}
            />
            <Input
              name="budget"
              value={formData.budget}
              handleChange={handleChange}
              labelName="Budget Amount"
              errors={errors}
            />

            <BasicDatePicker
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              handleChange={handleChange}
              labelName="Expected Closure Date"
            />
          </div>
        </div>
        <div className="col-span-2 section">
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Technical Info
          </h3>
          <Input
            name="techStack"
            value={formData.techStack}
            handleChange={handleChange}
            labelName="Tech Stack(Position)"
            errors={errors}
          />
        </div>

        <div className="section">
          <div className="col-span-2">
            <label className="font-medium block mb-1">Job Description</label>

            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={jobDescriptionRef.current}
              onChange={handleQuillChange}
              modules={modules}
              className=" bg-white dark:bg-darkBg dark:text-white "
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jobDescription}
              </p>
            )}
          </div>
        </div>

        <div className="section">
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Other Information
          </h3>

          <Textareafield
            name="otherInformation"
            label="Other Information"
            value={formData.otherInformation}
            handleChange={handleChange}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            text="Submit"
            icon={<Save size={18} />}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ClientRequirement;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup";

// import RequirementForm from "../requirementManagement/RequirementForm";
// import BackButton from "../ui/buttons/BackButton";
// import PageTitle from "../../hooks/PageTitle";
// import { useMessage } from "../../auth/MessageContext";

// import {
//   addClientsRequirement,
//   getActiveClients,
//   getRequirementsOptions,
// } from "../../services/clientServices";

// /* ---------------- Validation Schema ---------------- */
// const schema = yup.object().shape({
//   client: yup.string().required("Client is required"),
//   requirementPriority: yup
//     .string()
//     .required("Requirement priority is required"),
//   positionStatus: yup.string().required("Position status is required"),
//   techStack: yup.string().required("Tech stack is required"),
//   experience: yup.string().required("Experience is required"),
//   budgetType: yup.string().required("Budget type is required"),
//   currency: yup.string().required("Currency is required"),
//   budget: yup.string().required("Budget is required"),
//   totalPositions: yup.string().required("Total positions required"),
//   workRole: yup.string().required("Work role is required"),
//   workMode: yup.string().required("Work mode is required"),
//   workLocation: yup.string().required("Work location is required"),
//   jobDescription: yup
//     .string()
//     .trim()
//     .min(50, "Job description must be at least 50 characters")
//     .required("Job description is required"),
// });

// const ClientRequirement = () => {
//   PageTitle("Elevva | Add Client Requirement");

//   const navigate = useNavigate();
//   const { errorMsg, showError, showSuccess } = useMessage();

//   /* ---------------- State ---------------- */
//   const [formData, setFormData] = useState({
//     client: "",
//     requirementPriority: "",
//     positionStatus: "",
//     techStack: "",
//     experience: "",
//     budgetType: "",
//     currency: "",
//     budget: "",
//     totalPositions: "",
//     workRole: "",
//     workMode: "",
//     workLocation: "",
//     jobDescription: "",
//     otherInformation: "",
//     expectedClosureDate: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [activeClients, setActiveClients] = useState([]);
//   const [options, setOptions] = useState({
//     statuses: [],
//     experiences: [],
//     budgetTypes: [],
//     currencies: [],
//     workModes: [],
//     priorities: [],
//   });

//   /* ---------------- Effects ---------------- */
//   useEffect(() => {
//     fetchActiveClients();
//     fetchOptions();
//   }, []);

//   const fetchOptions = async () => {
//     try {
//       const res = await getRequirementsOptions();
//       if (res?.options) {
//         setOptions(res.options);
//       }
//     } catch (err) {
//       showError("Failed to load dropdown options");
//     }
//   };

//   const fetchActiveClients = async () => {
//     try {
//       const res = await getActiveClients();
//       const active = res.clients?.filter((c) => c.status === "active") || [];
//       setActiveClients(active);
//     } catch (err) {
//       showError("Failed to load clients");
//     }
//   };

//   /* ---------------- Submit ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     showError("");
//     showSuccess("");
//     setLoading(true);

//     try {
//       await schema.validate(formData, { abortEarly: false });

//       const res = await addClientsRequirement(formData);

//       if (res?.success) {
//         showSuccess(res.message || "Requirement added successfully");
//         navigate("/admin/clientmanagement/clientrequirements");
//       } else {
//         showError(res?.message || "Failed to add requirement");
//       }
//     } catch (err) {
//       if (err.inner) {
//         const validationErrors = {};
//         err.inner.forEach((e) => {
//           validationErrors[e.path] = e.message;
//         });
//         setErrors(validationErrors);
//       } else {
//         showError("Validation error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
//       <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
//         <h2 className="text-2xl font-semibold">Add New Requirement</h2>
//         <BackButton
//           onClick={() => navigate("/admin/clientmanagement/clientrequirements")}
//         />
//       </div>

//       {errorMsg && (
//         <div className="mb-4 p-3 rounded-xl border border-red-300 bg-[#d72b16] text-white">
//           ⚠ {errorMsg}
//         </div>
//       )}

//       <RequirementForm
//         formData={formData}
//         setFormData={setFormData}
//         errors={errors}
//         setErrors={setErrors}
//         activeClients={activeClients}
//         options={options}
//         loading={loading}
//         onSubmit={handleSubmit}
//         isEdit={false}
//       />
//     </div>
//   );
// };

// export default ClientRequirement;
