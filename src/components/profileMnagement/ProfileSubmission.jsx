import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FolderClosed, Save, X, ArrowLeft } from "lucide-react";
import * as yup from "yup";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import { useAuth } from "../../auth/AuthContext";
import { addProfile } from "../../services/profileServices";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";

const schema = yup.object().shape({
  resume: yup
    .mixed()
    .required("Resume is required")
    .test("fileType", "Only PDF files allowed", (value) => {
      return value && value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 50MB", (value) => {
      return value && value.size <= 1 * 1024 * 1024;
    }),
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone is required"),
  alternatePhone: yup
    .string()
    .nullable()
    .test("is-valid", "Enter a valid 10-digit phone number", (value) => {
      if (!value) return true;
      return /^[0-9]\d{9}$/.test(value);
    }),
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
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const skill = skillInput.trim();
      setErrors((prev) => ({
        ...prev,
        skills: "",
      }));
      setFormData((prev) => {
        if (!prev.skills.includes(skill)) {
          return { ...prev, skills: [...prev.skills, skill] };
        }
        return prev;
      });

      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
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
    if (file.size > 1 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 1MB!",
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
    if (
      ["phone", "alternatePhone", "currentCTC", "expectedCTC"].includes(name)
    ) {
      const cleanValue = ["currentCTC", "expectedCTC"].includes(name)
        ? value.replace(/,/g, "")
        : value.replace(/\D/g, "");
      if (["phone", "alternatePhone"].includes(name) && value !== cleanValue) {
        errorMsg = "Only numbers are allowed";
      }
      if (["currentCTC", "expectedCTC"].includes(name)) {
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
    if (name === "email" && newValue.length > 5) {
      handleDuplicateCheck("email", newValue);
    }
    if (name === "phone" && newValue.length === 10) {
      handleDuplicateCheck("phone", newValue);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    showSuccess("");
    showError("");
    const hasErrors = Object.values(errors).some(
      (err) => err && err.length > 0
    );
    if (hasErrors) {
      return;
    }
    try {
      await schema.validate(formData, { abortEarly: false });
      setLoading(true);
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
        <h2 className="text-2xl font-semibold">Add New Profle</h2>
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
            className={`border rounded-md bg-gray-50 dark:bg-gray-800 p-12 text-center cursor-pointer ${
              errors.resume
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
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
              <div>
                <p className="text-green-600 font-medium">
                  {formData.resume.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(formData.resume.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <FolderClosed className="mx-auto text-dark mb-2" size={24} />
                <p className="text-gray-600 font-semibold">
                  {isDragging ? "Drop your Resume here" : "Upload your Resume"}
                </p>
                <p className="text-sm text-gray-500">Only PDF (max 50 MB)</p>
              </>
            )}
          </div>
          {errors.resume && (
            <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
          )}
        </div>

        {/*Personal Information */}
        <section>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
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
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
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

            {/* 🏷 Skills */}
            <div className="col-span-2">
              <label className="block font-medium mb-1">Skills *</label>
              <div
                className={`flex flex-wrap gap-2 border rounded-md p-2 min-h-[48px]  ${
                  errors.skills
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600 "
                }`}
              >
                {formData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <X
                      size={14}
                      onClick={() => handleRemoveSkill(skill)}
                      className="cursor-pointer hover:text-red-500"
                    />
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="flex-grow bg-transparent outline-none text-sm "
                />
              </div>
              {errors.skills && (
                <p className="text-red-500  mt-1">{errors.skills}</p>
              )}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
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
              <div className="relative w-full">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder=" "
                  className="block p-[14px] w-full text-sm bg-transparent rounded-md border  appearance-none focus:outline-none peer transition
        
          border-gray-300 dark:border-gray-600 focus:border-black"
                />
                <label
                  htmlFor="description"
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500 duration-300 transform z-10 origin-[0] bg-white dark:bg-darkBg px-2
        ${
          formData.description
            ? "top-2 scale-75 -translate-y-4 text-darkBg dark:text-white"
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2"
        }
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
        peer-focus:text-darkBg dark:peer-focus:text-white
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
      `}
                >
                  Description
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            text={loading ? "Submitting..." : "Submit"}
            icon={<Save size={18} />}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileSubmission;
