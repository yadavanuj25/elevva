import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import roleBg from "../../assets/images/role.png";
import * as yup from "yup";
import Button from "../ui/Button";
import FormSkeleton from "../loaders/FormSkeleton";
import TableSkeleton from "../loaders/TableSkeleton";
import { useMessage } from "../../auth/MessageContext";

const schema = yup.object().shape({
  name: yup.string().trim().required("Role name is required"),
  description: yup
    .string()
    .trim()
    .min(5, "Description should have at least 5 characters")
    .required("Description is required"),
});

const EditRole = () => {
  const { id } = useParams();
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(
          `https://crm-backend-qbz0.onrender.com/api/roles/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (data?.role) {
          setRole(data.role);

          const selectedMap = {};
          data.role.permissions?.forEach((perm) => {
            if (!selectedMap[perm.resource]) {
              selectedMap[perm.resource] = {
                create: false,
                read: false,
                update: false,
                delete: false,
                manage: false,
              };
            }

            // ✅ Handle "manage" correctly — covers all
            if (perm.action === "manage") {
              selectedMap[perm.resource] = {
                create: true,
                read: true,
                update: true,
                delete: true,
                manage: true,
              };
            } else {
              selectedMap[perm.resource][perm.action] = true;
            }
          });

          setSelected(selectedMap);
        }
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    };
    fetchRole();
  }, [id, token]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(
          "https://crm-backend-qbz0.onrender.com/api/roles/permissions/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data?.permissions) setPermissions(data.permissions);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
    };
    fetchPermissions();
  }, [token]);

  const groupedModules = [...new Set(permissions.map((p) => p.resource))];

  const handleToggle = (module, action) => {
    setSelected((prev) => {
      const prevModule = prev[module] || {
        create: false,
        read: false,
        update: false,
        delete: false,
        manage: false,
      };

      const updated = {
        ...prevModule,
        [action]: !prevModule[action],
      };

      // ✅ If all CRUD are true, mark manage true
      updated.manage =
        updated.create && updated.read && updated.update && updated.delete;

      return { ...prev, [module]: updated };
    });
  };

  const handleAllowAll = (module) => {
    setSelected((prev) => {
      const prevModule = prev[module] || {
        create: false,
        read: false,
        update: false,
        delete: false,
        manage: false,
      };
      const allSelected =
        prevModule.create &&
        prevModule.read &&
        prevModule.update &&
        prevModule.delete &&
        prevModule.manage;

      const newVal = !allSelected;

      return {
        ...prev,
        [module]: {
          create: newVal,
          read: newVal,
          update: newVal,
          delete: newVal,
          manage: newVal,
        },
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRole((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    showError("");
    showSuccess("");

    try {
      await schema.validate(role, { abortEarly: false });
      const selectedPermissions = [];
      permissions.forEach((perm) => {
        const mod = selected[perm.resource];
        if (!mod) return;
        if (mod.manage && perm.action === "manage") {
          selectedPermissions.push(perm._id);
        } else if (!mod.manage && mod[perm.action]) {
          selectedPermissions.push(perm._id);
        }
      });

      const payload = {
        name: role.name,
        description: role.description,
        permissions: selectedPermissions,
        isActive: true,
      };

      const res = await fetch(
        `https://crm-backend-qbz0.onrender.com/api/roles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showError(data?.message || "Failed to update role.");
        return;
      }

      showSuccess("Role updated successfully!");
      navigate("/admin/rolemanagement/roles");
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach(
          (err) => (validationErrors[err.path] = err.message)
        );
        setErrors(validationErrors);
      } else {
        console.error("Error updating role:", error);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        showSuccess("");
        showError("");
      }, 6000);
    }
  };

  if (!role) return <p>Loading...</p>;

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">
          Role & Permission Management
        </h2>
        <button
          onClick={() => navigate("/admin/rolemanagement/roles")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div className="space-y-6">
        {errorMsg && (
          <div
            className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
          >
            <span className="text-red-600 font-semibold">⚠ </span>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-800">
          {/* Role Details */}

          {loading ? (
            <FormSkeleton rows={4} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 p-6 bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Edit Role</h2>

                <div className="grid grid-cols-1 gap-4">
                  {/* Role Name */}
                  <div>
                    <label className="block font-medium mb-1">Role Name</label>
                    <input
                      type="text"
                      name="name"
                      value={role.name || ""}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.name ? "border-red-500" : "border-lightGray"
                      } rounded-md focus:outline-none focus:border-gray-500 bg-transparent `}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={role.description || ""}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.description
                          ? "border-red-500"
                          : "border-lightGray"
                      } rounded-md focus:outline-none focus:border-gray-500 bg-transparent `}
                      rows="1"
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1 font-medium">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-2 bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg">
                <img
                  src={roleBg}
                  alt="image"
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Permissions Table */}

          {loading ? (
            <TableSkeleton rows={4} columns={12} />
          ) : (
            <>
              <div className="overflow-x-auto mt-6">
                <table className="w-full  text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr className="">
                      <th className="border rounded-tl-md p-3 text-left ">
                        Modules
                      </th>
                      <th className="border p-3 text-center">
                        Create <br />
                        <small>able to add new data</small>
                      </th>
                      <th className="border p-3 text-center">
                        Read <br />
                        <small>able to view data only</small>
                      </th>
                      <th className="border p-3 text-center">
                        Update
                        <br /> <small>able to modify existing data</small>
                      </th>
                      <th className="border p-3 text-center">
                        Delete <br /> <small>able to delete data</small>
                      </th>
                      <th className="border p-3 text-center">
                        Allow All <br /> <small>able to access all Crud</small>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {groupedModules.map((module) => (
                      <tr
                        key={module}
                        className="border-b hover:bg-gray-50  dark:hover:bg-gray-600"
                      >
                        <td className="border p-3 font-medium capitalize">
                          {module}
                        </td>
                        {["create", "read", "update", "delete"].map(
                          (action) => (
                            <td key={action} className="border text-center">
                              <input
                                type="checkbox"
                                checked={selected[module]?.[action] || false}
                                onChange={() => handleToggle(module, action)}
                              />
                            </td>
                          )
                        )}
                        <td className="border text-center">
                          <input
                            type="checkbox"
                            onChange={() => handleAllowAll(module)}
                            checked={selected[module]?.manage || false}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end  mt-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex items-center  bg-dark text-white font-medium px-4 py-2 rounded-md transition ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  <Save size={18} />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditRole;
