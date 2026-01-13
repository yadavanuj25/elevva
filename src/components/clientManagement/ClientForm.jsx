import React from "react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import BasicDatePicker from "../ui/BasicDatePicker";
import Textareafield from "../ui/formFields/Textareafield";
import Button from "../ui/Button";
import { Save } from "lucide-react";

const ClientForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  handleSubmit,
  loading,
  options,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("poc1.") || name.startsWith("poc2.")) {
      const [pocKey, field] = name.split(".");
      if (field === "phone") {
        const digits = value.replace(/\D/g, "");
        if (value !== digits) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only numbers are allowed",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [pocKey]: { ...prev[pocKey], [field]: digits },
          }));
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [pocKey]: { ...prev[pocKey], [field]: value },
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      return;
    }

    if (name === "phone" || name === "zipcode") {
      const digits = value.replace(/\D/g, "");
      if (value !== digits) {
        setErrors((prev) => ({ ...prev, [name]: "Only numbers are allowed" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: digits }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BasicDatePicker
          name="empanelmentDate"
          value={formData.empanelmentDate}
          labelName="Empanelment Date"
          handleChange={handleChange}
          errors={errors}
        />
        <Input
          labelName="Client Name"
          name="clientName"
          value={formData.clientName}
          handleChange={handleChange}
          errors={errors}
        />
        <SelectField
          label="Client Category"
          name="clientCategory"
          value={formData.clientCategory}
          handleChange={handleChange}
          options={options.clientCategories}
          error={errors.clientCategory}
        />
        <SelectField
          label="Client Source"
          name="clientSource"
          value={formData.clientSource}
          handleChange={handleChange}
          options={options.clientSources}
          error={errors.clientSource}
        />
        <Input
          labelName="Website"
          name="website"
          value={formData.website}
          handleChange={handleChange}
          errors={errors}
        />
        <Input
          labelName="LinkedIn"
          name="linkedin"
          value={formData.linkedin}
          handleChange={handleChange}
          errors={errors}
        />
        <SelectField
          label="Company Size"
          name="companySize"
          value={formData.companySize}
          handleChange={handleChange}
          options={options.companySizes}
          error={errors.companySize}
        />
        <Input
          labelName="Headquarter Address"
          name="headquarterAddress"
          value={formData.headquarterAddress}
          handleChange={handleChange}
          errors={errors}
        />
        <Input
          labelName="Branch Address"
          name="branchAddress"
          value={formData.branchAddress}
          handleChange={handleChange}
          errors={errors}
        />
        <SelectField
          label="Status"
          name="status"
          value={formData.status}
          handleChange={handleChange}
          options={options.statuses}
          error={errors.status}
        />
        <Textareafield
          name="aboutVendor"
          label="About Vendor"
          value={formData.aboutVendor}
          handleChange={handleChange}
        />
        <Textareafield
          name="instructions"
          label="Instructions"
          value={formData.instructions}
          handleChange={handleChange}
        />
      </div>

      {/* POCs */}
      {["poc1", "poc2"].map((poc, idx) => (
        <div key={poc} className="md:col-span-2 ">
          <div className="flex items-center gap-1 mb-1  ">
            <h3 className="text-lg font-semibold ">{`POC-${idx + 1}`}</h3>
            <span className="text-sm text-gray-500 ">{`(Point of Contact-${
              idx + 1
            })`}</span>
            {idx === 0 && <span className="text-red-700 text-xl"> *</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              labelName="Name"
              name={`${poc}.name`}
              value={formData[poc].name}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Email"
              name={`${poc}.email`}
              value={formData[poc].email}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Phone"
              name={`${poc}.phone`}
              value={formData[poc].phone}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Designation"
              name={`${poc}.designation`}
              value={formData[poc].designation}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
        </div>
      ))}

      <div className="col-span-2 flex justify-end">
        <Button
          type="submit"
          text="Submit"
          icon={<Save size={18} />}
          loading={loading}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default ClientForm;
