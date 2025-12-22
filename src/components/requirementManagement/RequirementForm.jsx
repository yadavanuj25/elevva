import React, { useMemo, useRef } from "react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import BasicDatePicker from "../ui/BasicDatePicker";
import ReadOnlyInput from "../ui/formFields/ReadOnlyInput";
import Textareafield from "../ui/formFields/Textareafield";
import { Save } from "lucide-react";

const RequirementForm = ({
  mode = "add", // add | edit
  formData,
  setFormData,
  errors,
  setErrors,
  options,
  activeClients,
  loading,
  onSubmit,
}) => {
  const quillRef = useRef(null);
  const jobDescriptionRef = useRef(formData.jobDescription || "");

  /* ---------- Quill Image Handler ---------- */
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

  /* ---------- Common Change Handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let errorMsg = "";

    if (["budget", "totalPositions"].includes(name)) {
      const clean =
        name === "budget" ? value.replace(/,/g, "") : value.replace(/\D/g, "");

      if (value !== clean) errorMsg = "Only numbers allowed";

      newValue =
        name === "budget" && clean
          ? new Intl.NumberFormat("en-IN").format(clean)
          : clean;
    }

    setFormData((p) => ({ ...p, [name]: newValue }));
    setErrors((p) => ({ ...p, [name]: errorMsg }));
  };

  const handleQuillChange = (content, delta, source, editor) => {
    jobDescriptionRef.current = editor.getHTML();
    setFormData((p) => ({ ...p, jobDescription: jobDescriptionRef.current }));
    setErrors((p) => ({ ...p, jobDescription: "" }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ---------- Basic Details ---------- */}
      <div className="section">
        <h3 className="form-section-subtitle">Basic Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {mode === "add" ? (
            <SelectField
              name="client"
              label="Client"
              value={formData.client}
              options={activeClients.map((c) => ({
                label: c.clientName,
                value: c._id,
              }))}
              handleChange={handleChange}
              error={errors.client}
            />
          ) : (
            <ReadOnlyInput labelName="Client" value={formData.client} />
          )}

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

      {/* ---------- Work Details ---------- */}
      <div className="section">
        <h3 className="form-section-subtitle">Work Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            name="workRole"
            value={formData.workRole}
            handleChange={handleChange}
            labelName="Work Role"
            errors={errors}
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

      {/* ---------- Budget ---------- */}
      <div className="section">
        <h3 className="form-section-subtitle">Budget Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
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

      <Input
        name="techStack"
        value={formData.techStack}
        handleChange={handleChange}
        labelName="Tech Stack"
        errors={errors}
      />

      {/* ---------- Job Description ---------- */}
      <div>
        <label className="font-medium">Job Description</label>
        <ReactQuill
          ref={quillRef}
          value={jobDescriptionRef.current}
          onChange={handleQuillChange}
          modules={modules}
        />
        {errors.jobDescription && (
          <p className="text-red-500">{errors.jobDescription}</p>
        )}
      </div>

      {/* ---------- Other Info ---------- */}
      <Textareafield
        name="otherInformation"
        label="Other Information"
        value={formData.otherInformation}
        handleChange={handleChange}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          text={mode === "add" ? "Submit" : "Update"}
          icon={<Save size={18} />}
          loading={loading}
        />
      </div>
    </form>
  );
};

export default RequirementForm;
