import React from "react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import ReactQuill from "react-quill-new";
import BasicDatePicker from "../ui/BasicDatePicker";
import Textareafield from "../ui/formFields/Textareafield";
import ReadOnlyInput from "../ui/formFields/ReadOnlyInput";
import { Save } from "lucide-react";

const RequirementForm = ({
  isEdit = false,
  formData,
  setFormData,
  errors,
  options,
  activeClients,
  jobDescriptionRef,
  quillRef,
  modules,
  handleChange,
  handleQuillChange,
  handleSubmit,
  loading,
  submitText,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="section">
        <h3 className="form-section-subtitle border-b">Basic Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {isEdit ? (
            <ReadOnlyInput labelName="Client" value={formData.client} />
          ) : (
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
      <div className="section">
        <h3 className="form-section-subtitle border-b">Work Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField
            name="workRole"
            label="Work Role"
            value={formData.workRole}
            options={options.workRole}
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
        <h3 className="form-section-subtitle border-b">Budget Details</h3>
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

      <div className="section">
        <h3 className="form-section-subtitle border-b">Technical Info</h3>
        <Input
          name="techStack"
          value={formData.techStack}
          handleChange={handleChange}
          labelName="Tech Stack(Position)"
          errors={errors}
        />
      </div>
      <div className="section">
        <label className="font-medium block mb-1">Job Description</label>
        <ReactQuill
          ref={quillRef}
          value={jobDescriptionRef.current}
          onChange={handleQuillChange}
          modules={modules}
        />
        {errors.jobDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>
        )}
      </div>
      <div className="section">
        <h3 className="form-section-subtitle border-b">Other Information</h3>
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
          text={submitText}
          icon={<Save size={18} />}
          loading={loading}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default RequirementForm;
