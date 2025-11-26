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

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    empanelmentDate: "",
    clientName: "",
    clientCategory: "",
    clientSource: "",
    website: "",
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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchOptions();
    fetchSingleClient();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAllOptions();
      setOptions(res?.options || []);
    } catch (error) {
      setErrorMsg("Failed to load dropdown options");
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
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("poc1.") || name.startsWith("poc2.")) {
      const [pocKey, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [pocKey]: { ...prev[pocKey], [field]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = { ...formData };
      payload.poc2 = Object.fromEntries(
        Object.entries(payload.poc2).map(([k, v]) => [k, v || undefined])
      );
      setLoading(true);
      const res = await updateClient(id, payload);
      if (res?.success) {
        setSuccessMsg("Client updated successfully");
        setTimeout(() => navigate("/admin/clientManagement/clients"), 1000);
      } else {
        setErrorMsg(res?.message || "Failed to update client");
      }
    } catch (err) {
      setErrorMsg("Validation or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Edit Client</h2>
        <button
          onClick={() => navigate("/admin/clientManagement/clients")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-2 bg-green-500 text-white rounded">
          {successMsg}
        </div>
      )}

      <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-800 ">
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 ">
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
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
                      peer-placeholder-shown:scale-100  peer-placeholder-shown:top-1/2
                      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
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
                      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                      peer-focus:text-[#181c1f] dark:peer-focus:text-white peer-placeholder-shown:-translate-y-1/2
                      rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                >
                  Instructions
                </label>
              </div>

              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                handleChange={handleChange}
                options={options.statuses}
                error={errors.status}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">POC - 1</h3>
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
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">POC - 2</h3>
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
            <div className="flex justify-end">
              <Button type="submit" text="Save" icon={<Save size={18} />} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditClient;
