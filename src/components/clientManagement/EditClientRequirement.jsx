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
} from "../../services/clientServices";
import BasicDatePicker from "../ui/BasicDatePicker";
import FormSkeleton from "../loaders/FormSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";

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
          client: r.client || "",
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
      console.error("Error fetching options:", error);
      showError("Failed to load dropdown options");
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleQuillChange = (content, delta, source, editor) => {
    jobDescriptionRef.current = editor.getHTML();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    const finalData = {
      ...formData,
      jobDescription: jobDescriptionRef.current,
    };

    try {
      await schema.validate(finalData, { abortEarly: false });

      const res = await addClientsRequirement(finalData);

      if (res?.success) {
        showSuccess("Requirement updated successfully!");
        navigate("/admin/clientmanagement/clientrequirements");
      } else {
        showError(res?.message || "Failed to update requirement");
      }
    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Clients Requirement</h2>
        <button
          onClick={() => navigate("/admin/clientManagement/ClientRequirements")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
        >
          <span className="text-red-600 font-semibold">⚠ </span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-800 ">
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="section">
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <SelectField
              name="client"
              label="Client"
              value={formData.client}
              options={activeClients}
              // options={["691c640497c1e09c60e33c9d", "sdsdh45"]}
              handleChange={handleChange}
              error={errors.client}
            /> */}
                <div className="relative w-full">
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition 
            ${
              errors.client
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-black"
            } dark:text-white`}
                  >
                    <option value="" disabled hidden>
                      --- Select ---
                    </option>
                    <>
                      {activeClients.map((client, i) => (
                        <option
                          key={i}
                          value={client._id}
                          className="text-darkBg"
                        >
                          {client.clientName}
                        </option>
                      ))}
                    </>
                  </select>
                  <label
                    className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              errors.client
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                  >
                    Client
                  </label>

                  {errors.client && (
                    <p className="text-red-500 text-sm mt-1">{errors.client}</p>
                  )}
                </div>
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
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
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
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
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
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                Other Information
              </h3>
              <div className="relative w-full">
                <textarea
                  name="otherInformation"
                  rows={4}
                  value={formData.otherInformation}
                  onChange={handleChange}
                  placeholder=" "
                  className="block p-[14px] w-full text-sm bg-transparent rounded-md border  appearance-none focus:outline-none peer transition

          border-gray-300 dark:border-gray-600 focus:border-black"
                />
                <label
                  htmlFor="description"
                  className={`absolute pointer-events-none  text-gray-500 duration-300 transform z-10 origin-[0] bg-white dark:bg-darkBg px-2
        ${
          formData.otherInformation
            ? "top-2 scale-75 -translate-y-4 text-darkBg dark:text-white"
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2"
        }
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
        peer-focus:text-darkBg dark:peer-focus:text-white
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
      `}
                >
                  Other Information
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" text="Save" icon={<Save size={18} />} />
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditClientRequirement;
