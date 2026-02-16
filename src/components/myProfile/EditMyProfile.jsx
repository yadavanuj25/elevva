import React, { useState, useEffect, useRef } from "react";
import * as yup from "yup";
import { Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useMessage } from "../../auth/MessageContext";
import Input from "../../components/ui/Input";
import ReadOnlyInput from "../ui/formFields/ReadOnlyInput";
import Button from "../ui/Button";
import BasicDatePicker from "../ui/BasicDatePicker";
import SelectField from "../ui/SelectField";
import {
  getCountries,
  getStatesByCountry,
} from "../../services/commonServices";
import CancelButton from "../ui/buttons/Cancel";
import { updateProfile } from "../../services/myProfileServices";
import { swalError } from "../../utils/swalHelper";

const statusStyles = {
  active: "bg-green-600 text-white ",
  inactive: "bg-red-600 text-white ",
};

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const profileSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  dob: yup
    .date()
    .nullable()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  country: yup.string().trim().required("Country is required"),
  state: yup.string().trim().required("State is required"),
  address: yup
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  zipcode: yup
    .string()
    .matches(/^[0-9]{5,6}$/, "Invalid zip code")
    .required("Zip code is required"),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useMessage();
  const isInitialLoad = useRef(true);
  const {
    fullName,
    email,
    phone,
    role,
    status,
    dob,
    country,
    state,
    address,
    zipcode,
    profileImage,
  } = user;
  const [profilePreview, setProfilePreview] = useState(profileImage);
  const [profileFile, setProfileFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [fullCountryData, setFullCountryData] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    dob: formatDateForInput(dob) || "",
    country: country || "",
    state: state || "",
    address: address || "",
    zipcode: zipcode || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {
      getAllStates(isInitialLoad.current);
      isInitialLoad.current = false;
    }
  }, [formData.country]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const res = await getCountries();
      if (res?.data?.length) {
        setFullCountryData(res.data);
        setCountries(res.data.map((c) => c.country));
      }
    } catch (err) {
      swalError("Error fetching countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  const getAllStates = async (isInitial = false) => {
    if (!formData.country) {
      setStates([]);
      return;
    }
    setLoadingStates(true);
    try {
      const res = await getStatesByCountry(formData.country);
      if (res?.data?.states?.length) {
        const stateList = res.data.states.map((s) => s.name);
        setStates(stateList);
        if (!isInitial && !stateList.includes(formData.state)) {
          setFormData((prev) => ({ ...prev, state: "" }));
        }
      } else {
        setStates([]);
      }
    } catch (err) {
      swalError("Error fetching states:", err);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await profileSchema.validate(formData, { abortEarly: false });
      const payload = {
        fullName: formData.fullName,
        dob: formData.dob,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        zipcode: formData.zipcode,
      };
      const res = await updateProfile(user?._id, payload);
      if (!res.success) showError(res.message || "Update failed");
      navigate(-1);
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        swalError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: fullName || "",
      dob: formatDateForInput(dob) || "",
      country: country || "",
      state: state || "",
      address: address || "",
      zipcode: zipcode || "",
    });
    setErrors({});
  };

  if (!user) return null;

  return (
    <>
      <h2 className=" text-gray-900 dark:text-white mb-4">My Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-darkBg border border-[#E8E8E9] dark:border-gray-600 p-6 rounded-xl"
      >
        <div className="relative overflow-hidden rounded-xl border border-[#E8E8E9] dark:border-gray-600 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://staging.ecodedash.com/cias/assets/dist/img/userimg.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <label className="absolute inset-0 flex items-center justify-center rounded-xl cursor-pointer bg-black/80 opacity-0 hover:opacity-100 transition">
                  <User size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {fullName}
                </h3>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-md text-xs font-semibold capitalize 
                 ${
                   statusStyles[status?.toLowerCase()] ||
                   "bg-gray-100 text-gray-600"
                 }`}
                >
                  {status}
                </span>

                <p className="mt-2 text-sm text-gray-400 capitalize">
                  {state}, {country}
                </p>
              </div>
            </div>

            <div className="space-y-3 md:border-l md:border-[#E8E8E9] md:dark:border-gray-600 md:pl-8">
              <InfoRow label="Email" value={email} />
              <InfoRow label="Phone" value={phone} />
              <InfoRow label="Role" value={role?.name} />
              <InfoRow label="Status" value={status} />
            </div>
            <div className="space-y-3 md:border-l md:border-[#E8E8E9] md:dark:border-gray-600 md:pl-8">
              <InfoRow label="Country" value={country} />
              <InfoRow label="State" value={state} />
              <InfoRow label="Zip Code" value={zipcode} />
              <InfoRow label="Address" value={address} />
            </div>
          </div>
        </div>

        {/* Editable Information */}
        <Section title="Account Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="fullName"
              labelName="Full Name"
              value={formData.fullName}
              handleChange={handleChange}
              errors={errors}
            />

            <BasicDatePicker
              name="dob"
              labelName="Date of Birth"
              value={formData.dob}
              handleChange={handleChange}
              errors={errors}
            />

            <ReadOnlyInput labelName="Email Address" value={email} />
            <ReadOnlyInput labelName="Phone Number" value={phone} />
            <ReadOnlyInput labelName="User Role" value={role?.name} />
            <ReadOnlyInput labelName="Status" value={status} />
          </div>
        </Section>

        {/* Address */}
        <Section title="Address Details">
          <InfoGrid>
            <SelectField
              name="country"
              label="Country"
              value={formData.country}
              options={countries}
              handleChange={handleChange}
              loading={loadingCountries}
              error={errors.country}
            />
            <SelectField
              name="state"
              label="State"
              value={formData.state}
              options={states}
              handleChange={handleChange}
              loading={loadingStates}
              error={errors.state}
            />
            <Input
              name="zipcode"
              labelName="Zip Code"
              value={formData.zipcode}
              handleChange={handleChange}
              errors={errors}
            />
            <Input
              name="address"
              labelName="Address"
              value={formData.address}
              handleChange={handleChange}
              errors={errors}
            />
          </InfoGrid>
        </Section>
        <div className="flex items-center justify-end">
          <div className="flex gap-2  items-stretch">
            <CancelButton onClick={handleCancel} />
            <Button
              type="submit"
              text="Update"
              icon={<Save size={18} loading={loading} disabled={loading} />}
            />
          </div>
        </div>
      </form>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-darkBg rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-sm">
    <div className="px-6 py-4 border-b border-[#E8E8E9] dark:border-gray-600">
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);
const InfoRow = ({ label, value }) => {
  const isEmail = label?.toLowerCase() === "email";
  const formattedValue =
    value && !isEmail ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  return (
    <div className="grid grid-cols-[80px_1fr] items-center text-sm">
      <span className="text-gray-900 dark:text-white font-medium">
        {label} :
      </span>
      <span className="text-gray-500 dark:text-gray-400">
        {formattedValue || "-"}
      </span>
    </div>
  );
};

export default EditProfile;
