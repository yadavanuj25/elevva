import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import roleBg from "../../assets/images/role.png";
import * as yup from "yup";
import Input from "../ui/Input";
import FormSkeleton from "../loaders/FormSkeleton";
import TableSkeleton from "../loaders/TableSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import Button from "../ui/Button";
import BackButton from "../ui/buttons/BackButton";

const schema = yup.object().shape({
  name: yup.string().trim().required("Role name is required"),
  description: yup
    .string()
    .trim()
    .min(5, "Description should have at least 5 characters")
    .required("Description is required"),
});

const EditRole = () => {
  PageTitle("Elevva | Edit-Role");
  const { id } = useParams();
  const { errorMsg, showSuccess, showError } = useMessage();
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");
    setLoading(true);
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
        name: role.name.trim(),
        description: role.description.trim(),
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
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error updating role:", error);
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  // if (!role) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800  border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold ">Update Role</h2>
        <BackButton onClick={() => navigate("/admin/rolemanagement/roles")} />
      </div>
      <div className="space-y-6">
        {errorMsg && (
          <div
            className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
          >
            <span className=" font-semibold">⚠ {"  "}</span>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {loading ? (
            <FormSkeleton rows={4} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 p-6 bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  {/* Role Name */}
                  <Input
                    type="text"
                    name="name"
                    value={role.name}
                    handleChange={handleChange}
                    className="col-span-2 md:col-span-1"
                    errors={errors}
                    labelName="Role name"
                  />

                  {/* Description */}
                  <div className="relative w-full">
                    <textarea
                      name="description"
                      rows={1}
                      value={role.description}
                      onChange={handleChange}
                      placeholder=" "
                      className={`block p-[14px] w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
        ${
          errors.description
            ? "border-red-500 focus:border-red-500 "
            : "border-gray-300 dark:border-gray-600 focus:border-dark dark:focus:border-white"
        }`}
                    />
                    <label
                      className={`absolute pointer-events-none   text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100  peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:font-[700]
            ${
              errors.description
                ? "peer-focus:text-red-500 peer-placeholder-shown:-translate-y-[100%]"
                : "peer-focus:text-dark dark:peer-focus:text-white peer-placeholder-shown:-translate-y-1/2"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                    >
                      Description
                    </label>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
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

              <div className="col-span-2 flex justify-end mt-2">
                <Button
                  type="submit"
                  text="Update"
                  icon={<Save size={18} />}
                  loading={loading}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditRole;
