import React, { useState, useRef, useEffect } from "react";
import { FolderClosed, Trash2, Eye } from "lucide-react";
import { Save, X, ArrowLeft } from "lucide-react";
import * as yup from "yup";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, updateProfile } from "../../services/profileServices";
import FormSkeleton from "../loaders/FormSkeleton";
import PageTitle from "../../hooks/PageTitle";
import previewResumeImg from "../../assets/images/dummy-resume.jpg";
import { useMessage } from "../../auth/MessageContext";
import BackButton from "../ui/buttons/BackButton";

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
  const { showError, showSuccess, errorMsg } = useMessage();
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
  const [loading, setLoading] = useState(false);
  const [profileCode, setProfileCode] = useState("");
  const [resumePreview, setResumePreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://staging.ecodedash.com/cias/public/candidate_resume/1764306208-Vishal_Chauhan.pdf"
  );
  const [remoteResume, setRemoteResume] = useState(null);
  const [removeExistingResume, setRemoveExistingResume] = useState(false);
  const [showResumePopup, setShowResumePopup] = useState(false);

  const [selectedResume, setSelectedResume] = useState(null);

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
        setProfileCode(p.profileCode);
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
          const url = `https://crm-backend-qbz0.onrender.com${p.resume.path}`;
          setRemoteResume({
            url,
            name: p.resume.originalName || "Resume.pdf",
          });
          // setPreviewUrl(url);
        } else {
          setRemoteResume(null);
          // setPreviewUrl(null);
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      return;
    }
    if (selectedResume && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const blobUrl = URL.createObjectURL(file);
    setSelectedResume(file);
    setPreviewUrl(blobUrl);
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
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update Profile</h2>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <BackButton
            onClick={() => navigate("/admin/profilemanagement/profiles")}
          />
        </div>
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
          <form onSubmit={handleUpdateProfile}>
            {/* Resume Upload + Preview */}
            <div className=" bg-white dark:bg-gray-800 mb-4">
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Resume (PDF Only)
                <span className="text-red-600"> *</span>
              </label>
              <div className="grid grid-cols-[3fr,2fr] gap-8 ">
                {/* UPLOAD CARD */}
                <div
                  className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700
    rounded-2xl p-8 flex flex-col items-center justify-center text-center
    hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700/40 
    transition-all group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeSelect}
                  />

                  {/* Icon Wrapper */}
                  <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FolderClosed
                      size={42}
                      className="text-blue-500 dark:text-gray-300"
                    />
                  </div>

                  {/* If no file */}
                  {!previewUrl && !remoteResume && (
                    <>
                      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Upload your Resume
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        PDF • Max 50 MB
                      </p>
                    </>
                  )}

                  {/* When file uploaded */}
                  {(previewUrl || remoteResume) && (
                    <div className="w-full flex flex-col items-center">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate max-w-[90%]">
                        {selectedResume?.name ||
                          remoteResume?.name ||
                          "Resume.pdf"}
                      </p>

                      {selectedResume && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {(selectedResume.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}

                      <p
                        className="mt-3 px-3 py-1 rounded-full bg-green-500 dark:bg-green-700/40 
                        text-white dark:text-green-300 text-xs font-medium"
                      >
                        Uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* PREVIEW BOX */}
                <div
                  className="relative w-full h-[250px] border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-200/40 dark:bg-gray-800/40 
backdrop-blur-md overflow-hidden shadow-md"
                >
                  {!previewUrl && !remoteResume ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Eye size={42} className="opacity-50 mb-2" />
                      <p className="text-sm">No resume uploaded</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={previewResumeImg}
                        alt="Resume Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/70"></div>
                      <button
                        type="button"
                        onClick={() => setShowResumePopup(true)}
                        className="absolute inset-0 flex items-center justify-center  transition-opacity"
                      >
                        <div className="px-4 py-2 bg-white text-black rounded-md shadow-lg  flex items-center gap-2 hover:bg-gray-500 hover:text-white transition">
                          <Eye size={26} />
                          <span className="font-semibold">View Resume</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {errors.resume && (
                <p className="text-red-500 text-sm mt-2">{errors.resume}</p>
              )}
            </div>
            {showResumePopup && (
              <div className="fixed  inset-0 bg-black/80  flex items-center justify-center z-[9999] p-2 animate-fadeIn">
                <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Close button */}
                  <button
                    className="absolute top-1 right-4 p-1 rounded-full bg-red-500 dark:bg-gray-800 
                 text-white dark:text-gray-300 hover:bg-red-700 hover:text-white 
                 transition-all shadow-md"
                    onClick={() => setShowResumePopup(false)}
                  >
                    <X size={20} />
                  </button>

                  {/* Header */}
                  <div className="flex items-center justify-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedResume?.name ||
                        remoteResume?.name ||
                        "Resume.pdf"}
                    </h2>
                    <p className="px-2"> - ({profileCode})</p>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <iframe
                      src={previewUrl || remoteResume?.url}
                      className="w-full h-[600px] rounded-lg border border-gray-200 dark:border-gray-700"
                      title="Full Resume Preview"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Personal Info */}
            <section className="my-3">
              <h3 className="text-lg font-semibold mb-4 border-b pb-1">
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
            <section className="my-3">
              <h3 className="text-lg font-semibold mb-4 border-b pb-1">
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
                  options={["Active", "In-active", "Banned"]}
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
                  <label className="block font-semibold mb-1">
                    Skills
                    <span className="text-red-600"> *</span>
                  </label>
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
            <section className="my-3">
              <h3 className="text-lg font-semibold mb-4 border-b pb-1">
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
