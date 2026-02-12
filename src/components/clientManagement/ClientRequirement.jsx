import React, { useState, useMemo, useRef, useEffect } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { Save } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  addClientsRequirement,
  getAllClients,
  getRequirementsOptions,
} from "../../services/clientServices";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import RequirementForm from "../requirementManagement/RequirementForm";
import ErrorMessage from "../modals/errors/ErrorMessage";

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
  // workLocation: yup.string().required("Work location is required"),
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
      showError("Error fetching options:", error);
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
    [],
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
        errorMsg = "please enter number only";
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
        navigate("/clients/requirements");
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
    <div className="p-4 bg-white dark:bg-gray-800  border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-[#E8E8E9] dark:border-gray-600">
        <h2>Add New Requirement</h2>
        <BackButton onClick={() => navigate("/clients/requirements")} />
      </div>

      <ErrorMessage errorMsg={errorMsg} />

      <RequirementForm
        isEdit={false}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        options={options}
        activeClients={activeClients}
        jobDescriptionRef={jobDescriptionRef}
        quillRef={quillRef}
        modules={modules}
        handleChange={handleChange}
        handleQuillChange={handleQuillChange}
        handleSubmit={handleSubmit}
        loading={loading}
        submitText="Submit"
      />
    </div>
  );
};
export default ClientRequirement;
