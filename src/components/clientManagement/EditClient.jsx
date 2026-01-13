import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import ClientForm from "./ClientForm";
import PageTitle from "../../hooks/PageTitle";
import BackButton from "../ui/buttons/BackButton";
import FormSkeleton from "../loaders/FormSkeleton";
import UseScrollOnError from "../../hooks/UseScrollOnError";
import {
  updateClient,
  getAllOptions,
  getClientById,
} from "../../services/clientServices";

import { useMessage } from "../../auth/MessageContext";

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
  website: yup.string().url("Enter valid URL").nullable(),
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
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits")
      .required("POC1 is required"),
    designation: yup.string().required("POC1 designation is required"),
  }),

  poc2: yup.object().shape({
    name: yup.string().nullable(),
    email: yup.string().nullable().email("Invalid POC2 email"),
    phone: yup
      .string()
      .nullable()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone must be at most 15 digits"),
    designation: yup.string().nullable(),
  }),
});

const EditClient = () => {
  PageTitle("Elevva | Edit-Client");
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError, errorMsg } = useMessage();
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
  const [options, setOptions] = useState({});
  const [updating, setUpdating] = useState(false);
  // UseScrollOnError(errors);
  useEffect(() => {
    fetchOptions();
    fetchClient();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAllOptions();
      setOptions(res?.options || {});
    } catch (err) {
      showError("Failed to load dropdown options");
    }
  };

  const fetchClient = async () => {
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
    } catch (err) {
      showError("Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setUpdating(true);
    try {
      const cleanedPoc2 = Object.fromEntries(
        Object.entries(formData.poc2 || {}).map(([k, v]) => [
          k,
          v === "" ? undefined : v,
        ])
      );
      const cleanedData = {
        ...formData,
        poc2: Object.values(cleanedPoc2).some(Boolean)
          ? cleanedPoc2
          : undefined,
      };
      await schema.validate(cleanedData, { abortEarly: false });
      const res = await updateClient(id, cleanedData);
      if (res?.success) {
        showSuccess(res.message || "Client updated successfully");
        navigate("/admin/clientManagement/clients");
        return;
      }
      showError(res?.message || "Failed to update client");
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
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Update Client</h2>
        <BackButton
          onClick={() => navigate("/admin/clientManagement/clients")}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 bg-[#d72b16] text-white shadow-sm">
          ⚠ {errorMsg}
        </div>
      )}

      {loading ? (
        <FormSkeleton rows={6} />
      ) : (
        <ClientForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          handleSubmit={handleSubmit}
          loading={updating}
          options={options}
        />
      )}
    </div>
  );
};

export default EditClient;
