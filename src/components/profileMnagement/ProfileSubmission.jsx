import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FolderClosed, Save, X, ArrowLeft, Check } from "lucide-react";
import * as yup from "yup";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import { useAuth } from "../../auth/AuthContext";
import { addProfile } from "../../services/profileServices";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import SkillsInput from "../ui/formFields/SkillsInput";
import Textareafield from "../ui/formFields/Textareafield";

const phoneSchema = yup
  .string()
  .transform((value) => (value === "" ? null : value))
  .matches(/^[0-9]+$/, "Phone must contain only numbers")
  .min(10, "Phone must be at least 10 digits")
  .max(15, "Phone must be at most 15 digits");
const schema = yup.object().shape({
  resume: yup
    .mixed()
    .required("Resume is required")
    .test("fileType", "Only PDF files allowed", (value) => {
      return value && value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 20 MB", (value) => {
      return value && value.size <= 20 * 1024 * 1024;
    }),
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: phoneSchema.required("Phone is required"),
  alternatePhone: phoneSchema.notRequired(),
  preferredLocation: yup.string().required("Preferred location is required"),
  currentLocation: yup.string().required("Current location is required"),
  currentCompany: yup.string().required("Current company is required"),
  totalExp: yup.string().required("Total experience is required"),
  currentCTC: yup.string().required("Current CTC is required"),
  expectedCTC: yup.string().required("Expected CTC is required"),
  workMode: yup.string().required("Work mode is required"),
  noticePeriod: yup.string().required("Notice period is required"),
  status: yup.string().required("Candidate status is required"),
  techStack: yup.string().required("Tech stack is required"),
  candidateSource: yup.string().required("Candidate source is required"),
  skills: yup.array().min(8, "Add at least 8 skill"),
  description: yup.string().nullable(),
});

const ProfileSubmission = () => {
  PageTitle("Elevva | Add-Profile");
  const navigate = useNavigate();
  const { token } = useAuth();
  const { errorMsg, showSuccess, showError } = useMessage();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    resume: null,
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    preferredLocation: "",
    currentLocation: "",
    currentCompany: "",
    totalExp: "",
    currentCTC: "",
    expectedCTC: "",
    workMode: "",
    noticePeriod: "",
    status: "",
    skills: [],
    techStack: "",
    candidateSource: "",
    description: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const checkDuplicate = async (field, value) => {
    try {
      const res = await fetch(
        `https://crm-backend-qbz0.onrender.com/api/profiles/check-duplicate?${field}=${value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return await res.json();
    } catch (err) {
      return { success: false, message: "Server error" };
    }
  };
  const handleDuplicateCheck = (field, value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      if (!value) return;
      const response = await checkDuplicate(field, value);
      if (!response || response.success === false) {
        return;
      }
      if (response.exists) {
        setErrors((prev) => ({
          ...prev,
          [field]: response.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }, 600);
  };
  const normalizeSkill = (skill) => skill.trim().toLowerCase();

  const addSkills = (input) => {
    if (!input?.trim()) return;
    const parsedSkills = input
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    setFormData((prev) => {
      const existingNormalized = prev.skills.map(normalizeSkill);
      const seen = new Set(existingNormalized);
      const uniqueSkills = [];
      for (const skill of parsedSkills) {
        const normalized = normalizeSkill(skill);
        if (!seen.has(normalized)) {
          seen.add(normalized);
          uniqueSkills.push(skill);
        }
      }

      if (!uniqueSkills.length) return prev;

      return {
        ...prev,
        skills: [...prev.skills, ...uniqueSkills],
      };
    });

    setErrors((prev) => ({ ...prev, skills: "" }));
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkills(skillInput);
    }
  };

  const handleSkillBlur = () => {
    addSkills(skillInput);
  };

  const handleRemoveSkill = (skill) => {
    const normalized = normalizeSkill(skill);
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => normalizeSkill(s) !== normalized),
    }));
  };
  // Resume
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const validateAndSetFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only pdf allowed" }));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 20 MB!",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({
      ...prev,
      resume: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let errorMsg = "";
    if (name === "phone" || name === "alternatePhone") {
      const digits = value.replace(/\D/g, "");
      if (value !== digits) {
        errorMsg = "Only numbers are allowed";
      } else if (digits.length && digits.length < 10) {
        errorMsg = "Must be at least 10 digits";
      } else if (digits.length > 15) {
        errorMsg = "Must not exceed 15 digits";
      }
      newValue = digits;
    } else if (name === "currentCTC" || name === "expectedCTC") {
      const cleanValue = value.replace(/,/g, "");

      if (cleanValue && !/^\d+$/.test(cleanValue)) {
        errorMsg = "Only numbers are allowed";
        newValue = "";
      } else {
        newValue = cleanValue
          ? new Intl.NumberFormat("en-IN").format(Number(cleanValue))
          : "";
      }
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    if (name === "email" && newValue.length > 5) {
      handleDuplicateCheck("email", newValue);
    }

    if (name === "phone" && newValue.length === 10 && !errorMsg) {
      handleDuplicateCheck("phone", newValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showSuccess("");
    showError("");
    setLoading(true);
    const hasErrors = Object.values(errors).some(
      (err) => err && err.length > 0
    );
    if (hasErrors) {
      return;
    }
    try {
      await schema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "skills") {
          formDataToSend.append("skills", value.join(", "));
        } else {
          formDataToSend.append(key, value);
        }
      });
      const response = await addProfile(formDataToSend);
      if (!response.success) {
        showError(response.message || "Something went wrong");
        return;
      }
      showSuccess(response.message);
      setFormData({
        resume: null,
        fullName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        preferredLocation: "",
        currentLocation: "",
        currentCompany: "",
        totalExp: "",
        currentCTC: "",
        expectedCTC: "",
        workMode: "",
        noticePeriod: "",
        status: "",
        skills: [],
        techStack: "",
        candidateSource: "",
        description: "",
      });
      navigate("/admin/profilemanagement/profiles");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        showError(err.message || "Failed to submit profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600 ">
        <h2 className="text-2xl font-semibold">Add New Profile</h2>
        <BackButton
          onClick={() => navigate("/admin/profilemanagement/profiles")}
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
        {/* Resume Upload */}

        <div>
          <div
            onClick={handleBoxClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
      relative group
      border-2 border-dashed rounded-lg
      p-10 text-center cursor-pointer
      transition-all duration-300
      bg-white
      dark:from-gray-800 dark:to-gray-900
      ${
        isDragging
          ? "border-blue-500 scale-[1.02]"
          : errors.resume
          ? "border-red-500 hover:border-red-600 "
          : "border-dark"
      }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileSelect}
            />

            {formData.resume ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-200 text-green-600">
                  <Check size={26} />
                </div>
                <p className="text-green-600 font-semibold truncate max-w-xs">
                  {formData.resume.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(formData.resume.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-400">Click to replace file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="
            w-14 h-14 rounded-full
            flex items-center justify-center
            bg-gray-200 dark:bg-gray-700
            text-dark
            group-hover:scale-110 transition
          "
                >
                  <FolderClosed size={26} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  {isDragging ? "Drop your resume here" : "Upload your resume"}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop or{" "}
                  <span className="text-dark font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400">PDF only · Max 20 MB</p>
              </div>
            )}
          </div>

          {errors.resume && (
            <p className="text-red-500 text-sm mt-2">{errors.resume}</p>
          )}
        </div>

        {/*Personal Information */}
        <section>
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Input
              name="phone"
              labelName="Phone"
              value={formData.phone}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              name="alternatePhone"
              labelName="Alternate Phone (Optional)"
              value={formData.alternatePhone}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              name="currentLocation"
              labelName="Current Location"
              value={formData.currentLocation}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              name="preferredLocation"
              labelName="Preferred Location"
              value={formData.preferredLocation}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
        </section>

        {/* Professional Information */}
        <section>
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Professional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="currentCompany"
              labelName="Current Company"
              value={formData.currentCompany}
              handleChange={handleChange}
              errors={errors}
            />
            <SelectField
              name="totalExp"
              label="Total Experience"
              value={formData.totalExp}
              handleChange={handleChange}
              options={[
                "0-1 Year",
                "1-2 Years",
                "2-3 Years",
                "3-5 Years",
                "5-7 Years",
                "7-10 Years",
                "10+ Years",
              ]}
              error={errors.totalExp}
            />
            <Input
              name="currentCTC"
              labelName="Current CTC"
              value={formData.currentCTC}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              name="expectedCTC"
              labelName="Expected CTC"
              value={formData.expectedCTC}
              handleChange={handleChange}
              errors={errors}
            />
            <SelectField
              name="workMode"
              label="Work Mode"
              value={formData.workMode}
              handleChange={handleChange}
              options={[
                "Remote",
                "Hybrid",
                "On-site",
                "Permanent",
                "C2H",
                "Freelancer-8hrs",
                "Freelancer-4hrs",
              ]}
              error={errors.workMode}
            />
            <SelectField
              name="noticePeriod"
              label="Notice Period"
              value={formData.noticePeriod}
              handleChange={handleChange}
              options={[
                "Immediate",
                "15 Days",
                "30 Days",
                "60 Days",
                "90 Days",
              ]}
              error={errors.noticePeriod}
            />
            <SelectField
              name="status"
              label="Candidate Status"
              value={formData.status}
              handleChange={handleChange}
              options={["Active", "Inactive", "Banned"]}
              error={errors.status}
            />
            <Input
              name="techStack"
              labelName="Tech Stack"
              placeholder="MERN, MEAN, Java Full Stack..."
              value={formData.techStack}
              handleChange={handleChange}
              errors={errors}
            />

            <SkillsInput
              label="Skills"
              required
              skills={formData.skills}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={handleSkillBlur}
              onRemove={handleRemoveSkill}
              error={errors.skills}
            />
          </div>
        </section>

        {/* Additional Information */}
        <section>
          <h3 className="form-section-subtitle border-b border-gray-300 dark:border-gray-600">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="candidateSource"
              label="Candidate Source"
              value={formData.candidateSource}
              handleChange={handleChange}
              options={[
                "ECD-Career",
                "ECD-Naukri-Db",
                "Email-Marketing",
                "LinkedIn-Corporate",
                "LinkedIn-Free",
                "LinkedIn-Recruiter-Lite",
                "Naukri",
                "Reference",
                "WhatsApp",
                "Others",
              ]}
              error={errors.candidateSource}
            />
            <div className="col-span-2">
              <Textareafield
                name="description"
                label="Description"
                value={formData.description}
                handleChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Submit */}
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

export default ProfileSubmission;
