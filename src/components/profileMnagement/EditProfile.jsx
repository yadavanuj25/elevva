import React, { useState, useRef, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "../ui/Button";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, updateProfile } from "../../services/profileServices";
import FormSkeleton from "../loaders/FormSkeleton";
import PageTitle from "../../hooks/PageTitle";
import { useMessage } from "../../auth/MessageContext";
import ProfileForm from "./ProfileForm";
import PageHeader from "./PageHeader";
import { EditSchema } from "./validation/EditSchema";
import useSkillHandlers from "../../hooks/profiles/useSkills";
import profileInitialForm from "../../contstants/profile/profileInitialForm";
import ResumePreview from "./ResumePreview";
import ResumeUpload from "./ResumeUpload";
import { swalError } from "../../utils/swalHelper";

/** Temporary – remove when backend starts sending resume */
const HARDCODED_RESUME = {
  url: "https://staging.ecodedash.com/cias/public/candidate_resume/1764306208-Vishal_Chauhan.pdf",
  name: "Vishal_Chauhan.pdf",
};

const EditProfile = () => {
  PageTitle("Elevva | Edit-Profile");

  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess, errorMsg } = useMessage();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(profileInitialForm);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [remoteResume, setRemoteResume] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { handleSkillKeyDown, handleSkillBlur, handleRemoveSkill } =
    useSkillHandlers({
      setFormData,
      setErrors,
      skillInput,
      setSkillInput,
    });

  useEffect(() => {
    if (id) fetchProfileById(id);
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [id]);

  const normalizeSkills = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .flatMap((s) => (typeof s === "string" ? s.split(",") : s))
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const fetchProfileById = async (userId) => {
    setLoading(true);
    try {
      const res = await getProfileById(userId);

      if (!res?.success || !res.profile) {
        showError("Profile not found");
        return;
      }
      const p = res.profile;
      setFormData({
        ...profileInitialForm,
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
        skills: normalizeSkills(p.skills),
        techStack: p.techStack || "",
        candidateSource: p.candidateSource || "",
        description: p.description || "",
        resume: null,
      });
      if (p.resume?.path) {
        // setRemoteResume({
        //   url: `${BASE_URL}${p.resume.path}`,
        //   name: p.resume.originalName || "Resume.pdf",
        // });
        setRemoteResume(HARDCODED_RESUME);
      } else {
        setRemoteResume(HARDCODED_RESUME);
      }
    } catch (err) {
      swalError(err.message);
      showError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };
  // Resume select
  const handleResumeSelect = (file) => {
    if (!file) return false;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF files allowed",
      }));
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 20 MB",
      }));
      return false;
    }
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const blobUrl = URL.createObjectURL(file);
    setSelectedResume(file);
    setPreviewUrl(blobUrl);
    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: "" }));
    return true;
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "alternatePhone") {
      const digits = value.replace(/\D/g, "");
      setFormData((p) => ({ ...p, [name]: digits }));
      setErrors((e) => ({
        ...e,
        [name]: value !== digits ? "Only numbers allowed" : "",
      }));
      return;
    }

    if (name === "currentCTC" || name === "expectedCTC") {
      const clean = value.replace(/,/g, "");
      setFormData((p) => ({
        ...p,
        [name]: clean ? new Intl.NumberFormat("en-IN").format(clean) : "",
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrors({});
    showSuccess("");
    showError("");
    try {
      await EditSchema.validate(
        { ...formData, skills: formData.skills || [] },
        { abortEarly: false },
      );
      // build payload  FormData WITHOUT resume
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "skills") {
          fd.append("skills", Array.isArray(v) ? v.join(",") : "");
        } else if (k !== "resume") {
          // skip resume entirely
          if (v !== null && v !== undefined) fd.append(k, v);
        }
      });
      const res = await updateProfile(id, fd);
      showSuccess(res.message || "Profile updated successfully");
      navigate("/profiles");
    } catch (err) {
      if (err.name === "ValidationError") {
        const ve = {};
        err.inner.forEach((e) => (ve[e.path] = e.message));
        setErrors(ve);
      } else {
        showError(err.message || "Update failed");
      }
    } finally {
      setUpdating(false);
    }
  };
  const effectivePreviewUrl = previewUrl || remoteResume?.url || null;
  const effectiveFileName =
    selectedResume?.name || remoteResume?.name || "Resume.pdf";

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border rounded-xl">
      <PageHeader title="Update Profile" onBack={() => navigate("/profiles")} />

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">
          ⚠ {errorMsg}
        </div>
      )}

      {loading ? (
        <FormSkeleton rows={6} />
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
            <ResumeUpload
              fileInputRef={fileInputRef}
              resume={selectedResume}
              fallback={remoteResume}
              errors={errors}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onFileSelect={handleResumeSelect}
              fullWidth={false}
            />

            <ResumePreview
              previewUrl={effectivePreviewUrl}
              fileName={effectiveFileName}
              show={showResumePopup}
              onOpen={() => effectivePreviewUrl && setShowResumePopup(true)}
              onClose={() => setShowResumePopup(false)}
            />
          </div>

          <ProfileForm
            formData={formData}
            errors={errors}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            handleChange={handleChange}
            handleSkillKeyDown={handleSkillKeyDown}
            handleSkillBlur={handleSkillBlur}
            handleRemoveSkill={handleRemoveSkill}
          />

          <div className="flex justify-end ">
            <Button
              type="submit"
              text="Update"
              icon={<Save size={18} />}
              loading={updating}
              disabled={updating}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
