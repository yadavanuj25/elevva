import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Save, ArrowLeft } from "lucide-react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateClient,
  getAllOptions,
  getClientById,
} from "../../services/clientServices";
import BasicDatePicker from "../ui/BasicDatePicker";
import FormSkeleton from "../loaders/FormSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
const schema = yup.object().shape({
  empanelmentDate: yup
    .string()
    .required("Empanelment date is required")
    .test(
      "valid-date",
      "Invalid date format",
      (val) => !!val && !isNaN(Date.parse(val))
    ),

  clientName: yup.string().required("Client name is required"),
  clientCategory: yup.string().required("Category is required"),
  clientSource: yup.string().required("Source is required"),
  // website: yup
  //   .string()
  //   .nullable()
  //   .matches(
  //     /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w .-]*)*\/?$/,
  //     "Enter valid URL"
  //   ),
  linkedin: yup.string().nullable(),
  headquarterAddress: yup.string().required("Headquarter address required"),
  branchAddress: yup.string().nullable(),
  companySize: yup.string().required("Company size is required"),

  aboutVendor: yup.string().nullable(),
  instructions: yup.string().nullable(),
  status: yup.string().required("Status is required"),

  poc1: yup.object().shape({
    name: yup.string().required("POC1 name is required"),
    email: yup
      .string()
      .email("Invalid POC1 email")
      .required("POC1 email is required"),
    phone: yup
      .string()
      .required("POC1 phone is required")
      .matches(/^\d{10,15}$/, "POC1 phone must be 10–15 digits"),
    designation: yup.string().required("POC1 designation is required"),
  }),

  poc2: yup.object().shape({
    name: yup.string().nullable(),
    email: yup.string().nullable().email("Invalid POC2 email"),
    phone: yup.string().nullable(),
    designation: yup.string().nullable(),
  }),
});

const EditClient = () => {
  PageTitle("Elevva | Edit-Client");
  const navigate = useNavigate();
  const { errorMsg, showSuccess, showError } = useMessage();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    empanelmentDate: "",
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
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    fetchOptions();
    fetchSingleClient();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAllOptions();
      setOptions(res?.options || []);
    } catch (error) {
      showError(error || "Failed to load dropdown options");
    }
  };

  const fetchSingleClient = async () => {
    setLoading(true);
    try {
      const res = await getClientById(id);
      if (res?.success) {
        const c = res.client;

        setFormData({
          empanelmentDate: c.empanelmentDate
            ? c.empanelmentDate.split("T")[0]
            : "",
          clientName: c.clientName || "",
          clientCategory: c.clientCategory || "",
          clientSource: c.clientSource || "",
          website: c.website || "",
          linkedin: c.linkedin || "",
          headquarterAddress: c.headquarterAddress || "",
          branchAddress: c.branchAddress || "",
          companySize: c.companySize || "",
          aboutVendor: c.aboutVendor || "",
          instructions: c.instructions || "",
          status: c.status || "active",

          poc1: {
            name: c.poc1?.name || "",
            email: c.poc1?.email || "",
            phone: c.poc1?.phone || "",
            designation: c.poc1?.designation || "",
          },

          poc2: {
            name: c.poc2?.name || "",
            email: c.poc2?.email || "",
            phone: c.poc2?.phone || "",
            designation: c.poc2?.designation || "",
          },
        });
      }
    } catch (error) {
      showError(error || "Failed to fetch client");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setDisable(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      const res = await updateClient(id, formData);
      if (res?.success) {
        showSuccess("Client updated successfully");
        navigate("/admin/clientManagement/clients");
      } else {
        showError(res?.message || "Failed to update client");
      }
    } catch (err) {
      if (err.inner) {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        showError("Something went wrong");
      }
    } finally {
      setDisable(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Edit Client</h2>

        <button
          onClick={() => navigate("/admin/clientManagement/clients")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-[#d72b16] text-white shadow-sm animate-slideDown"
        >
          <span className=" font-semibold">⚠ </span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="border p-6 rounded-lg bg-white dark:bg-gray-800">
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MAIN FIELDS */}
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
            </div>

            {/* POC 1 */}
            <h3 className="text-lg font-semibold mt-6">POC - 1</h3>
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

            {/* POC 2 */}
            <h3 className="text-lg font-semibold mt-6">POC - 2</h3>
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

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
              <Button
                type="submit"
                text="Save"
                icon={<Save size={18} />}
                loading={disable}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditClient;
