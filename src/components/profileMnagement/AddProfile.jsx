import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FolderClosed, Save, Check } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../auth/AuthContext";
import { addProfile } from "../../services/profileServices";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import ProfileForm from "./ProfileForm";
import PageHeader from "./PageHeader";
import { AddSchema } from "./validation/AddSchema";
import useSkillHandlers from "../../hooks/profiles/useSkills";
import useDuplicateCheck from "../../hooks/profiles/useDuplicateCheck";
import profileInitialForm from "../../contstants/profileInitialForm";
import ResumeUpload from "./ResumeUpload";
import ErrorMessage from "../modals/errors/ErrorMessage";

const AddProfile = () => {
  PageTitle("Elevva | Add-Profile");
  const navigate = useNavigate();
  const { token } = useAuth();
  const { errorMsg, showSuccess, showError } = useMessage();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState(profileInitialForm);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);
  const { handleSkillKeyDown, handleSkillBlur, handleRemoveSkill } =
    useSkillHandlers({
      setFormData,
      setErrors,
      skillInput,
      setSkillInput,
    });
  const { handleDuplicateCheck } = useDuplicateCheck({
    token,
    setErrors,
  });

  // const handleResumeSelect = (file) => {
  //   if (file.type !== "application/pdf") {
  //     setErrors((prev) => ({ ...prev, resume: "Only PDF allowed" }));
  //     return;
  //   }
  //   if (file.size > 20 * 1024 * 1024) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       resume: "File size must be less than 20 MB",
  //     }));
  //     return;
  //   }
  //   setFormData((prev) => ({ ...prev, resume: file }));
  //   setErrors((prev) => ({ ...prev, resume: "" }));
  // };

  const handleResumeSelect = (file) => {
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only PDF allowed" }));
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 20 MB",
      }));
      return false;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: "" }));
    return true;
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
    const hasErrors = Object.values(errors).some(
      (err) => err && err.length > 0,
    );
    if (hasErrors) {
      return;
    }
    setLoading(true);
    try {
      await AddSchema.validate(formData, { abortEarly: false });
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
      setFormData(profileInitialForm);
      navigate("/profiles");
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
    <div className="p-4 bg-white dark:bg-gray-800  border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <PageHeader
        title="Add New Profile"
        onBack={() => navigate("/profiles")}
      />
      <ErrorMessage errorMsg={errorMsg} />
      <form onSubmit={handleSubmit} className="space-y-6 ">
        <ResumeUpload
          fileInputRef={fileInputRef}
          resume={formData.resume}
          errors={errors}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onFileSelect={handleResumeSelect}
          fullWidth
        />

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
        <div className="flex justify-end">
          <Button
            type="submit"
            text="Submit"
            icon={<Save size={18} />}
            loading={loading}
            disabled={!!errors.resume}
          />
        </div>
      </form>
    </div>
  );
};
export default AddProfile;
