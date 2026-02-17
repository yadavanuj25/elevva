import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import "react-quill-new/dist/quill.snow.css";
import {
  getActiveClients,
  getRequirementsOptions,
  getRequirementById,
  updateClientsRequirement,
} from "../../services/clientServices.js";
import FormSkeleton from "../loaders/FormSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import RequirementForm from "../requirementManagement/RequirementForm";
import ErrorMessage from "../modals/errors/ErrorMessage";
import { swalError } from "../../utils/swalHelper";

const schema = yup.object().shape({
  client: yup.string().required("Client is required"),
  requirementPriority: yup
    .string()
    .required("Requirement priority is required"),
  positionStatus: yup.string().required("Position status is required"),
  experience: yup.string().required("Experience is required"),
  budgetType: yup.string().required("Budget type is required"),
  currency: yup.string().required("Currency is required"),
  budget: yup.string().required("Budget is required"),
  totalPositions: yup.string().required("Total positions required"),
  workRole: yup.string().required("Work role is required"),
  workMode: yup.string().required("Work mode is required"),
  workLocation: yup.string().required("Work location is required"),
  jobDescription: yup.string().required("Job description is required"),
});

const EditClientRequirement = () => {
  PageTitle("Elevva | Edit-Client Requirement");
  const { id } = useParams();
  const { errorMsg, showSuccess, showError } = useMessage();
  const jobDescriptionRef = useRef("");
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientId: "",
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
    priorities: [],
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchActiveClients();
    fetchAllOptions();
    fetchPrefill();
  }, []);

  const fetchPrefill = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getRequirementById(id);
      if (res?.success && res?.requirement) {
        const r = res.requirement;

        jobDescriptionRef.current = r.jobDescription;
        setFormData({
          clientId: r.client._id,
          client: r.client.clientName || "",
          requirementPriority: r.requirementPriority || "",
          positionStatus: r.positionStatus || "",
          techStack: r.techStack || "",
          experience: r.experience || "",
          budgetType: r.budgetType || "",
          currency: r.currency || "",
          budget: r.budget || "",
          totalPositions: r.totalPositions || "",
          workRole: r.workRole || "",
          workMode: r.workMode || "",
          workLocation: r.workLocation || "",
          otherInformation: r.otherInformation || "",
          expectedClosureDate: r.expectedClosureDate?.split("T")[0] || "",
        });
        setLoading(false);
      }
    } catch (error) {
      showError("Failed to load existing requirement", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOptions = async () => {
    try {
      const data = await getRequirementsOptions();
      if (!data?.options) return;
      setOptions(data.options);
    } catch (error) {
      showError(error);
    }
  };
  const fetchActiveClients = async () => {
    try {
      const res = await getActiveClients();
      const activeList =
        res.clients?.filter((c) => c.status === "active") || [];
      setActiveClients(activeList);
    } catch (error) {
      swalError(error.message);
    }
  };
  // Quill Image Handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
        handlers: { image: imageHandler },
      },
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
      if (["budget", "totalPositions"].includes(name) && value !== cleanValue) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    setUpdating(true);
    const finalData = {
      ...formData,
      jobDescription: jobDescriptionRef.current,
    };
    try {
      await schema.validate(finalData, { abortEarly: false });
      const res = await updateClientsRequirement(id, finalData);
      if (res?.success) {
        showSuccess(res.message || "Requirement updated successfully!");
        navigate("/clients/requirements");
      } else {
        showError(res?.message || "Failed to update requirement");
      }
    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach((e) => {
        validationErrors[e.path] = e.message;
      });

      setErrors(validationErrors);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-[#E8E8E9] dark:border-gray-600">
        <h2>Update Requirement</h2>
        <BackButton onClick={() => navigate("/clients/requirements")} />
      </div>

      <ErrorMessage errorMsg={errorMsg} />

      <div>
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <RequirementForm
            isEdit={true}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            options={options}
            jobDescriptionRef={jobDescriptionRef}
            quillRef={quillRef}
            modules={modules}
            handleChange={handleChange}
            handleQuillChange={handleQuillChange}
            handleSubmit={handleSubmit}
            loading={updating}
            submitText="Update"
          />
        )}
      </div>
    </div>
  );
};

export default EditClientRequirement;
