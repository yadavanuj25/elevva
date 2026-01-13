import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import * as yup from "yup";
import Input from "../ui/Input";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import Button from "../ui/Button";
import BackButton from "../ui/buttons/BackButton";
import Textareafield from "../ui/formFields/Textareafield";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Role name is required"),
  description: yup
    .string()
    .min(10, "Description should be at least 10 characters")
    .required("Description is required"),
});

const CreateRole = () => {
  PageTitle("Elevva | Add-Role");
  const { token } = useAuth();
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      if (!token) {
        showError("No token found. Please log in again.");
        return;
      }
      const payload = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions || [],
      };
      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/roles",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        showError("Error response:", errorData);
        return;
      }
      const data = await res.json();
      navigate(`/admin/rolemanagement/edit-roles/${data.role._id}`);
      showSuccess(data.message);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        showError(error || "Error while creating role");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Add New Role</h2>
        <BackButton onClick={() => navigate("/admin/rolemanagement/roles")} />
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Role Name */}
          <div>
            <Input
              type="text"
              name="name"
              value={formData.name}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Role name"
            />
          </div>

          {/* Description */}
          {/* <div className="col-span-1">
            <Textareafield
              name="description"
              label="Description"
              rows={1}
              value={formData.description}
              handleChange={handleChange}
            />
          </div> */}
          <div className="relative w-full">
            <textarea
              name="description"
              rows={1}
              value={formData.description}
              onChange={handleChange}
              placeholder=" "
              className={`block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
        ${
          errors.description
            ? "border-red-500 focus:border-red-500 "
            : "border-gray-300 dark:border-gray-600 focus:border-accent-dark dark:focus:border-white"
        }`}
            />
            <label
              className={`absolute pointer-events-none   text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100  peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
            ${
              errors.description
                ? "peer-focus:text-red-500 peer-placeholder-shown:-translate-y-[100%]"
                : "peer-focus:text-accent-dark dark:peer-focus:text-white peer-placeholder-shown:-translate-y-1/2"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
            >
              Description
            </label>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

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
    </div>
  );
};

export default CreateRole;
