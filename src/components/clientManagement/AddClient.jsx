import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Save, ArrowLeft } from "lucide-react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { addClients, getAllOptions } from "../../services/clientServices";
import BasicDatePicker from "../ui/BasicDatePicker";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";

const schema = yup.object().shape({
  empanelmentDate: yup
    .string()
    .required("Empanelment date is required")
    .test(
      "is-valid-date",
      "Invalid date format",
      (val) => !!val && !isNaN(Date.parse(val))
    )
    .test("is-recent", "Date must be within last 7 days", (val) => {
      const d = new Date(val);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d <= now && d >= weekAgo;
    }),
  clientName: yup.string().required("Client name is required"),
  clientCategory: yup.string().required("Category is required"),
  clientSource: yup.string().required("Source is required"),
  website: yup.string().url("Enter valid URL"),
  linkedin: yup.string().required("Linkedin is required"),
  headquarterAddress: yup.string().required("Headquarter address required"),
  branchAddress: yup.string().nullable(),
  companySize: yup.string().required("Company size is required"),
  aboutVendor: yup.string().nullable(),
  instructions: yup.string().nullable(),
  status: yup.string().required("Status is required"),
  poc1: yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .required("POC1 phone is required")
      .matches(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    designation: yup.string().required("Designation is required"),
  }),
  poc2: yup.object().shape({
    name: yup.string().nullable(),
    email: yup.string().nullable().email("Invalid email"),
    phone: yup
      .string()
      .nullable()
      .matches(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    designation: yup.string().nullable(),
  }),
});

const AddClient = () => {
  PageTitle("Elevva | Add-Client");
  const navigate = useNavigate();
  const { errorMsg, showSuccess, showError } = useMessage();
  const [formData, setFormData] = useState({
    empanelmentDate: new Date().toISOString().split("T")[0],
    clientName: "",
    clientCategory: "",
    clientSource: "",
    website: "",
    linkedin: "",
    headquarterAddress: "",
    branchAddress: "",
    companySize: "",
    aboutVendor: "",
    instructions: "",
    status: "active",
    poc1: { name: "", email: "", phone: "", designation: "" },
    poc2: { name: "", email: "", phone: "", designation: "" },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await getAllOptions();
      setOptions(res?.options || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const cleanedPoc2 = Object.fromEntries(
        Object.entries(formData.poc2).map(([k, v]) => [
          k,
          v === "" ? undefined : v,
        ])
      );
      const cleanedData = {
        ...formData,
        poc2: cleanedPoc2,
      };
      await schema.validate(cleanedData, { abortEarly: false });
      setLoading(true);
      const payload = {
        empanelmentDate: cleanedData.empanelmentDate,
        clientName: cleanedData.clientName,
        clientCategory: cleanedData.clientCategory,
        clientSource: cleanedData.clientSource,
        website: cleanedData.website,
        linkedin: cleanedData.linkedin,
        headquarterAddress: cleanedData.headquarterAddress,
        branchAddress: cleanedData.branchAddress,
        companySize: cleanedData.companySize,
        aboutVendor: cleanedData.aboutVendor,
        instructions: cleanedData.instructions,
        status: cleanedData.status,
        poc1: { ...cleanedData.poc1 },
        poc2: { ...cleanedData.poc2 },
      };

      const res = await addClients(payload);
      if (res?.success) {
        showSuccess(res.message || "Client added successfully");
        navigate("/admin/clientmanagement/clients");
      } else {
        showError(res?.message || "Failed to add client");
      }
    } catch (err) {
      if (err?.inner && Array.isArray(err.inner)) {
        const newErrors = {};
        err.inner.forEach((e) => {
          const path = (e.path || "").replace(/\[(\w+)\]/g, ".$1");
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
      } else {
        showError("Validation error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center ">
        <h2 className="text-2xl font-semibold">Add Client</h2>
        <button
          onClick={() => navigate("/admin/clientManagement/clients")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-800 "
      >
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

          <div className="relative w-full">
            <textarea
              name="aboutVendor"
              rows={2}
              value={formData.aboutVendor}
              onChange={handleChange}
              placeholder=" "
              className={`block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
                  border-gray-300 dark:border-gray-600 focus:border-black`}
            />
            <label
              className={`absolute pointer-events-none  text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
                      peer-placeholder-shown:scale-100  peer-placeholder-shown:top-1/2
                      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
                      peer-focus:text-[#181c1f] dark:peer-focus:text-white peer-placeholder-shown:-translate-y-1/2
                      rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
            >
              About Vendor
            </label>
          </div>
          <div className="relative w-full">
            <textarea
              name="instructions"
              rows={2}
              value={formData.instructions}
              onChange={handleChange}
              placeholder=" "
              className={`block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
                  border-gray-300 dark:border-gray-600 focus:border-black`}
            />
            <label
              className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
                      peer-placeholder-shown:scale-100  peer-placeholder-shown:top-1/2
                      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
                      peer-focus:text-[#181c1f] dark:peer-focus:text-white peer-placeholder-shown:-translate-y-1/2
                      rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
            >
              Instructions
            </label>
          </div>
        </div>

        {/* POC 1 */}
        <div className="md:col-span-2 mt-6">
          <div className="flex items-center gap-1 mb-3  pb-2">
            <h3 className="text-lg font-semibold ">POC-1</h3>
            <span className="text-sm text-gray-500 ">(Point of Contact-1)</span>
            <span className="text-red-700 text-xl"> *</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              labelName="Name"
              name="poc1.name"
              value={formData.poc1.name}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Email"
              name="poc1.email"
              value={formData.poc1.email}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Phone"
              name="poc1.phone"
              value={formData.poc1.phone}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Designation"
              name="poc1.designation"
              value={formData.poc1.designation}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
        </div>

        {/* POC 2 */}
        <div className="md:col-span-2 mt-6">
          <div className="flex items-center gap-1 mb-3  pb-2">
            <h3 className="text-lg font-semibold ">POC-2</h3>
            <span className="text-sm text-gray-500 ">(Point of Contact-2)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              labelName="Name"
              name="poc2.name"
              value={formData.poc2.name}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Email"
              name="poc2.email"
              value={formData.poc2.email}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Phone"
              name="poc2.phone"
              value={formData.poc2.phone}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              labelName="Designation"
              name="poc2.designation"
              value={formData.poc2.designation}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            text="Save"
            icon={<Save size={18} />}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddClient;
