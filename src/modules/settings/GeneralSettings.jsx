import React, { useState } from "react";
import * as yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Save, Upload, User } from "lucide-react";
import PageTitle from "../../hooks/PageTitle";
// Yup validation schema
const schema = yup.object().shape({
  company_logo: yup
    .mixed()
    .required("Image is required")
    .test(
      "fileType",
      "Allowed formats: jpeg, jpg, png",
      (value) =>
        value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type),
    )
    .test(
      "fileSize",
      "Max file size is 2 MB",
      (value) => value && value.size <= 2 * 1024 * 1024,
    ),
  company_name: yup.string().required("Company name is required"),
  company_email: yup
    .string()
    .email("Invalid email format")
    .required("Company email is required"),
  company_phone: yup
    .string()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .required("Phone number is required"),
  company_state: yup.string().required("State is required"),
  company_city: yup.string().required("City is required"),
  company_address: yup.string().required("Address is required"),
  company_gst: yup.string().required("GST number is required"),
});
const GeneralSettings = () => {
  PageTitle("Elevva | Settings-General");
  const [formData, setFormData] = useState({
    company_logo: null,
    company_name: "",
    company_email: "",
    company_phone: "",
    company_state: "",
    company_city: "",
    company_address: "",
    company_gst: "",
  });
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_phone") {
      const digits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          company_logo: "Allowed formats: jpeg, jpg, png",
        }));
        return;
      } else if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          company_logo: "Max file size is 2 MB",
        }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, company_logo: "" }));
      }
      setFormData((prev) => ({ ...prev, company_logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      console.log("Form Data:", formData);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div className="flex flex-col items-center p-5 rounded-md space-y-3">
          <div
            className={`border  rounded-full p-1 ${
              errors.company_logo
                ? "border-red-500"
                : "border-[#E8E8E9] dark:border-gray-600"
            }`}
          >
            <div
              className={`w-28 h-28 bg-gray-100 rounded-full overflow-hidden border border-[#E8E8E9] dark:border-gray-600 flex items-center justify-center text-gray-400 `}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <User size={40} />
              )}
            </div>
          </div>
          <label
            htmlFor="company_logo"
            className="flex gap-2 items-center cursor-pointer bg-accent-dark text-white px-3 py-2 rounded text-sm"
          >
            <Upload size={18} />
            Upload Logo
          </label>
          <input
            id="company_logo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {errors.company_logo && (
            <p className="text-red-500 text-sm">{errors.company_logo}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            // id="company_name"
            type="text"
            name="company_name"
            value={formData.company_name}
            handleChange={handleChange}
            labelName="Company Name"
            errors={errors}
          />
          <Input
            // id="company_email"
            type="text"
            name="company_email"
            value={formData.company_email}
            handleChange={handleChange}
            labelName="Company Email"
            errors={errors}
          />
          <Input
            // id="company_phone"
            type="tel"
            name="company_phone"
            value={formData.company_phone}
            handleChange={handleChange}
            labelName="Phone Number"
            errors={errors}
          />
          <Input
            // id="company_state"
            type="text"
            name="company_state"
            value={formData.company_state}
            handleChange={handleChange}
            labelName="State"
            errors={errors}
          />
          <Input
            // id="company_city"
            type="text"
            name="company_city"
            value={formData.company_city}
            handleChange={handleChange}
            labelName="City"
            errors={errors}
          />
          <Input
            // id="company_gst"
            type="text"
            name="company_gst"
            value={formData.company_gst}
            handleChange={handleChange}
            labelName="GST Number"
            errors={errors}
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <div className="relative w-full">
            <textarea
              // id="company_address"
              name="company_address"
              rows={4}
              value={formData.company_address}
              onChange={handleChange}
              placeholder=" "
              className={`block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
        ${
          errors.company_address
            ? "border-red-500"
            : "border-[#E8E8E9] dark:border-gray-600 focus:border-black"
        }`}
            />
            <label
              // htmlFor="company_address"
              className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              errors.company_address
                ? "peer-focus:text-red-500"
                : "peer-focus:text-[#181c1f] dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
            >
              Address
            </label>
            {errors.company_address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company_address}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button text="Submit" type="submit" icon={<Save size={18} />} />
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
