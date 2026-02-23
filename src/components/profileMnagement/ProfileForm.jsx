import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import SkillsInput from "../ui/formFields/SkillsInput";
import Textareafield from "../ui/formFields/Textareafield";
import {
  totalExperienceOptions,
  workModeOptions,
  noticePeriodOptions,
  candidateSourceOptions,
  candidateStatusOptions,
} from "../../contstants/profile/profileFormOptions";

const ProfileForm = ({
  formData,
  errors,
  skillInput,
  setSkillInput,
  handleChange,
  handleSkillKeyDown,
  handleSkillBlur,
  handleRemoveSkill,
}) => {
  return (
    <>
      {/*Personal Information */}
      <section>
        <h3 className="form-section-subtitle border-b border-[#E8E8E9] dark:border-gray-600">
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
        <h3 className="form-section-subtitle border-b border-[#E8E8E9] dark:border-gray-600">
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
            options={totalExperienceOptions}
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
            options={workModeOptions}
            error={errors.workMode}
          />
          <SelectField
            name="noticePeriod"
            label="Notice Period"
            value={formData.noticePeriod}
            handleChange={handleChange}
            options={noticePeriodOptions}
            error={errors.noticePeriod}
          />
          <SelectField
            name="status"
            label="Candidate Status"
            value={formData.status}
            handleChange={handleChange}
            options={candidateStatusOptions}
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
        <h3 className="form-section-subtitle border-b border-[#E8E8E9] dark:border-gray-600">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            name="candidateSource"
            label="Candidate Source"
            value={formData.candidateSource}
            handleChange={handleChange}
            options={candidateSourceOptions}
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
    </>
  );
};

export default ProfileForm;
