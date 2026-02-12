import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import ClientForm from "./ClientForm";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import { addClients, getAllOptions } from "../../services/clientServices";
import { useMessage } from "../../auth/MessageContext";
import ErrorMessage from "../modals/errors/ErrorMessage";

const schema = yup.object().shape({
  empanelmentDate: yup
    .string()
    .required("Empanelment date is required")
    .test(
      "is-valid-date",
      "Invalid date format",
      (val) => !!val && !isNaN(Date.parse(val)),
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
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits")
      .required("POC1 is required"),
    designation: yup.string().required("Designation is required"),
  }),
  poc2: yup.object().shape({
    name: yup.string().nullable(),
    email: yup.string().nullable().email("Invalid email"),
    phone: yup
      .string()
      .nullable()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits"),
    designation: yup.string().nullable(),
  }),
});

const AddClient = () => {
  PageTitle("Elevva | Add-Client");
  const navigate = useNavigate();
  const { showSuccess, showError, errorMsg } = useMessage();

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
  const [options, setOptions] = useState({});

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAllOptions();
      setOptions(res?.options || {});
    } catch (err) {
      console.log(err);
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
        ]),
      );
      const cleanedData = { ...formData, poc2: cleanedPoc2 };
      await schema.validate(cleanedData, { abortEarly: false });
      const res = await addClients(cleanedData);
      if (res?.success) {
        showSuccess(res.message || "Client added successfully");
        navigate("/clients");
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
        return;
      }
      if (err?.errors && typeof err.errors === "object") {
        setErrors(err.errors);
        return;
      }
      showError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-[#E8E8E9] dark:border-gray-600">
        <h2>Add New Client</h2>
        <BackButton onClick={() => navigate("/clients")} />
      </div>

      <ErrorMessage errorMsg={errorMsg} />

      <ClientForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        handleSubmit={handleSubmit}
        loading={loading}
        options={options}
      />
    </div>
  );
};

export default AddClient;
