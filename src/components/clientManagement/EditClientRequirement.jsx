import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getRequirementsOptions,
  getRequirementById,
  updateClientsRequirement,
} from "../../services/clientServices";
import BasicDatePicker from "../ui/BasicDatePicker";
import FormSkeleton from "../loaders/FormSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import ReadOnlyInput from "../ui/formFields/ReadOnlyInput";
import Textareafield from "../ui/formFields/Textareafield";

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
  const [disable, setDisable] = useState(false);
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
        console.log(r.client.clientName);
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
      console.log(error);
      showError("Failed to load existing requirement");
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
      console.log(error);
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
    []
  );
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

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
  // const parseBackendFieldError = (message) => {
  //   if (!message) return null;

  //   const cleaned = message.replace("Validation failed:", "").trim();
  //   const [field, error] = cleaned.split(": ");

  //   if (!field || !error) return null;

  //   return { field: field.trim(), message: error.trim() };
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   setDisable(true);

  //   const finalData = {
  //     ...formData,
  //     jobDescription: jobDescriptionRef.current,
  //   };

  //   try {
  //     await schema.validate(finalData, { abortEarly: false });

  //     const res = await updateClientsRequirement(id, finalData);

  //     if (res?.success) {
  //       showSuccess(res.message || "Updated successfully");
  //       navigate("/admin/clientmanagement/clientrequirements");
  //     }
  //   } catch (err) {
  //     //  Extract backend message safely (Axios)
  //     const apiMessage = err?.response?.data?.message || err?.message || "";

  //     const parsed = parseBackendFieldError(apiMessage);

  //     if (parsed) {
  //       setErrors({
  //         [parsed.field]: parsed.message,
  //       });
  //       return;
  //     }

  //     showError(apiMessage || "Something went wrong");
  //   } finally {
  //     setDisable(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    setDisable(true);
    const finalData = {
      ...formData,
      jobDescription: jobDescriptionRef.current,
    };
    try {
      await schema.validate(finalData, { abortEarly: false });
      const res = await updateClientsRequirement(id, finalData);
      if (res?.success) {
        showSuccess(res.message || "Requirement updated successfully!");
        navigate("/admin/clientmanagement/clientrequirements");
      } else {
        showError(res?.message || "Failed to update requirement");
      }
    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      console.log(err);
      setErrors(validationErrors);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update Requirement</h2>
        <BackButton
          onClick={() => navigate("/admin/clientManagement/ClientRequirements")}
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

      <div>
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="section">
              <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyInput labelName="Client" value={formData.client} />
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
              <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
                Work Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  name="workRole"
                  label="Work Role"
                  value={formData.workRole}
                  options={[
                    "Developer",
                    "Manager",
                    "Project Manager",
                    "Data Analyst",
                  ]}
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
            <div className="col-span-2">
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
                <label className="font-medium block mb-1">
                  Job Description
                </label>

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
                text="Update"
                icon={<Save size={18} loading={disable} />}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditClientRequirement;
