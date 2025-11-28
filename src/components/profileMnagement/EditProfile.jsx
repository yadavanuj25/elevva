import React, { useState, useRef, useEffect } from "react";
import { FolderClosed, Save, X, ArrowLeft } from "lucide-react";
import * as yup from "yup";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import { useAuth } from "../../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, updateProfile } from "../../services/profileServices";
import FormSkeleton from "../loaders/FormSkeleton";
import PageTitle from "../../hooks/PageTitle";

const schema = yup.object().shape({
  resume: yup
    .mixed()
    .nullable()
    .test("fileType", "Only PDF files allowed", (value) => {
      return !value || value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 50MB", (value) => {
      return !value || value.size <= 50 * 1024 * 1024;
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
  skills: yup.array().min(1, "Add at least 1 skill"),
  description: yup.string().nullable(),
});
const BASE_URL = "https://crm-backend-qbz0.onrender.com";
const EditProfile = () => {
  PageTitle("Elevva | Edit-Profile");
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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
  const [successMsg, showSuccess] = useState("");
  const [errorMsg, showError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumePreview, setResumePreview] = useState(null);
  const [remoteResumeInfo, setRemoteResumeInfo] = useState(null);
  const [removeExistingResume, setRemoveExistingResume] = useState(false);

  useEffect(() => {
    if (id) fetchProfileById(id);
    return () => {
      if (resumePreview && resumePreview.isBlob && resumePreview.url) {
        try {
          URL.revokeObjectURL(resumePreview.url);
        } catch (e) {
          showError(e);
        }
      }
    };
  }, [id]);

  const normalizeSkills = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      if (raw.length === 1 && typeof raw[0] === "string") {
        return raw[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return raw
        .map((s) => (typeof s === "string" ? s.trim() : s))
        .filter(Boolean);
    }
    if (typeof raw === "string") {
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  };

  const buildRemoteUrl = (path) => {
    if (!path) return null;
    const base = BASE_URL;
    const clean = path;
    return `https://crm-backend-qbz0.onrender.com/uploads/resumes/resume-1763379016787-221991535.pdf`;
  };

  const fetchProfileById = async (userId) => {
    setLoading(true);
    try {
      const res = await getProfileById(userId);
      if (res.success && res.profile) {
        const p = res.profile;
        const skills = normalizeSkills(p.skills);
        setFormData((prev) => ({
          ...prev,
          resume: null,
          fullName: p.fullName || "",
          email: p.email || "",
          phone: p.phone || "",
          alternatePhone: p.alternatePhone || "",
          preferredLocation: p.preferredLocation || "",
          currentLocation: p.currentLocation || "",
          currentCompany: p.currentCompany || "",
          totalExp: p.totalExp || "",
          currentCTC: p.currentCTC || "",
          expectedCTC: p.expectedCTC || "",
          workMode: p.workMode || "",
          noticePeriod: p.noticePeriod || "",
          status: p.status || "Active",
          skills,
          techStack: p.techStack || "",
          candidateSource: p.candidateSource || "",
          description: p.description || "",
        }));

        if (p.resume && p.resume.path) {
          const url = buildRemoteUrl(p.resume.path);
          const info = {
            url,
            name: p.resume.originalName || p.resume.filename || "Resume",
            type: p.resume.mimetype || "application/pdf",
          };
          setRemoteResumeInfo(info);
          setResumePreview({ ...info, isBlob: false });
          setRemoveExistingResume(false);
        } else {
          setRemoteResumeInfo(null);
          setResumePreview(null);
        }
        setLoading(false);
      } else {
        showError("Profile not found");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      showError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files allowed" }));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File must be under 50MB" }));
      return;
    }
    if (resumePreview && resumePreview.isBlob && resumePreview.url) {
      try {
        URL.revokeObjectURL(resumePreview.url);
      } catch (e) {}
    }

    const blobUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, resume: file }));
    setResumePreview({
      url: blobUrl,
      name: file.name,
      type: file.type,
      isBlob: true,
    });
    setRemoteResumeInfo(null);
    setRemoveExistingResume(false);
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const handleAddSkill = (raw) => {
    const v = (raw || "").toString().trim();
    if (!v) return;
    const parts = v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => {
      const next = [...prev.skills];
      parts.forEach((p) => {
        if (!next.includes(p)) next.push(p);
      });
      return { ...prev, skills: next };
    });
    setSkillInput("");
    setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && formData.skills.length) {
      setFormData((prev) => ({ ...prev, skills: prev.skills.slice(0, -1) }));
    }
  };

  const handleRemoveSkill = (skill) => {
    const clean = (skill || "").toString().trim();
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.trim() !== clean),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (["phone", "alternatePhone"].includes(name)) {
      newValue = value.replace(/\D/g, "");
    }
    if (["currentCTC", "expectedCTC"].includes(name)) {
      const cleanValue = value.replace(/,/g, "");
      newValue = cleanValue
        ? new Intl.NumberFormat("en-IN").format(Number(cleanValue))
        : "";
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleRemoveSelectedFile = (e) => {
    e?.stopPropagation();
    if (resumePreview && resumePreview.isBlob && resumePreview.url) {
      try {
        URL.revokeObjectURL(resumePreview.url);
      } catch (err) {}
    }
    setFormData((prev) => ({ ...prev, resume: null }));
    if (remoteResumeInfo) {
      setResumePreview({ ...remoteResumeInfo, isBlob: false });
      setRemoveExistingResume(false);
    } else {
      setResumePreview(null);
      setRemoteResumeInfo(null);
      setRemoveExistingResume(true);
    }
  };

  const handleMarkRemoveExisting = () => {
    setRemoveExistingResume(true);
    setResumePreview(null);
    setRemoteResumeInfo(null);
    setFormData((prev) => ({ ...prev, resume: null }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    showSuccess("");
    showError("");
    setLoading(true);
    try {
      const validated = {
        ...formData,
        skills: Array.isArray(formData.skills) ? formData.skills : [],
      };
      await schema.validate(validated, { abortEarly: false });
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formDataToSend.append("skills", value.join(","));
        } else if (key === "resume") {
          if (value instanceof File) {
            formDataToSend.append("resume", value);
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      if (removeExistingResume) {
        formDataToSend.append("removeResume", "true");
      }

      const result = await updateProfile(id, formDataToSend);
      showSuccess(result.message || "Profile updated successfully!");
      navigate("/admin/profilemanagement/profiles");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        showError(
          err.message || "Something went wrong while updating profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Edit Profile</h2>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <button
            onClick={() => navigate("/admin/profilemanagement/profiles")}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
            type="button"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
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
          <form onSubmit={handleUpdateProfile} className="space-y-6 ">
            {/* Resume Upload + Preview */}
            <div>
              <div
                onClick={handleBoxClick}
                className={`border rounded-md bg-gray-50 dark:bg-gray-800 p-4 text-center cursor-pointer ${
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
                {!formData.resume && !resumePreview && (
                  <>
                    <FolderClosed
                      className="mx-auto text-dark mb-2"
                      size={24}
                    />
                    <p className="text-gray-600 font-semibold">
                      Click to Upload Resume
                    </p>
                    <p className="text-sm text-gray-500">
                      Only PDF (max 50 MB)
                    </p>
                  </>
                )}

                {(formData.resume || resumePreview) && (
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {formData.resume
                            ? formData.resume.name
                            : resumePreview?.name || "Uploaded Resume"}
                        </p>
                        {formData.resume && (
                          <p className="text-sm text-gray-500">
                            {(formData.resume.size / (1024 * 1024)).toFixed(2)}{" "}
                            MB
                          </p>
                        )}
                        {!formData.resume && remoteResumeInfo && (
                          <p className="text-sm text-gray-500">
                            Previewing remote resume
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {formData.resume && (
                          <button
                            type="button"
                            className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded"
                            onClick={handleRemoveSelectedFile}
                          >
                            Remove
                          </button>
                        )}

                        {!formData.resume && remoteResumeInfo && (
                          <button
                            type="button"
                            className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRemoveExisting();
                            }}
                          >
                            Remove Remote
                          </button>
                        )}

                        {resumePreview && resumePreview.url && (
                          <a
                            href={resumePreview.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Embedded PDF preview (option 2) */}
                    {resumePreview &&
                      resumePreview.type === "application/pdf" &&
                      resumePreview.url && (
                        <div className="mt-3 h-64 border rounded overflow-hidden">
                          <iframe
                            src={resumePreview.url}
                            title="Resume Preview"
                            className="w-full h-full"
                          />
                        </div>
                      )}

                    {/* Non-PDF fallback */}
                    {resumePreview &&
                      resumePreview.type !== "application/pdf" &&
                      resumePreview.url && (
                        <div className="mt-3">
                          <a
                            href={resumePreview.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            {resumePreview.name || "Download file"}
                          </a>
                        </div>
                      )}
                  </div>
                )}
              </div>
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
              )}
            </div>

            {/* Personal Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3 border-b pb-1">
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
                  labelName="Alternate Phone"
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

            {/* Professional Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3 border-b pb-1">
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
                  name="candidateStatus"
                  label="Candidate Status"
                  value={formData.status}
                  handleChange={handleChange}
                  options={["Active", "In-active", "Banned", "Defaulter"]}
                  error={errors.status}
                />
                <Input
                  name="techStack"
                  labelName="Tech Stack"
                  placeholder="MERN, Java, etc."
                  value={formData.techStack}
                  handleChange={handleChange}
                  errors={errors}
                />

                {/* Skills */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Skills *</label>
                  <div
                    className={`flex flex-wrap gap-2 border rounded-md p-2 min-h-[48px] ${
                      errors.skills ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <X
                          size={14}
                          onClick={() => handleRemoveSkill(skill)}
                          className="cursor-pointer hover:text-red-500"
                        />
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder="Type a skill and press Enter or comma"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      onBlur={() => {
                        if (skillInput.trim()) handleAddSkill(skillInput);
                      }}
                      className="flex-grow bg-transparent outline-none text-sm min-w-[160px]"
                    />
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Additional Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3 border-b pb-1">
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
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800"
                    placeholder="Short description about this profile ..."
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                text={loading ? "Updating..." : "Update"}
                icon={<Save size={18} />}
                disabled={loading}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
