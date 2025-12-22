import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import profileImg from "../../assets/userImage/profileImg.png";
import EditButton from "../ui/buttons/EditButton";
import BackButton from "../ui/buttons/BackButton";
import Section from "./Section";
import InfoGrid from "./InfoGrid";
import InfoItem from "./InfoItem";

const statusStyles = {
  active: "bg-green-100 text-green-700 border-b-2 border-green-500",
  inactive: "bg-red-100 text-red-700 border-b-2 border-red-500",
};

const ViewMyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

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

  const [firstName = "", lastName = ""] = fullName?.split(" ");

  return (
    <div className="space-y-6 bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold ">My Profile</h2>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600 p-6 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative z-10">
            <div className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-darkBg shadow-sm">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="relative z-10">
            <h3 className="text-xl mb-1 font-semibold text-gray-900 dark:text-white capitalize">
              {fullName}
            </h3>

            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold capitalize border
          ${
            statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-600"
          }`}
            >
              {status}
            </span>

            <p className="mt-2 text-sm text-gray-400 capitalize">
              {state}, {country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EditButton onClick={() => navigate("/edit-profile")} />
          <BackButton
            onClick={() =>
              navigate(`/admin/profilemanagement/edit-profile/${profile._id}`)
            }
          />
        </div>
      </div>


      {/* Personal Information */}
      <Section title="Personal Information">
        <InfoGrid>
          <InfoItem label="First Name" value={firstName} />
          <InfoItem label="Last Name" value={lastName} />
          <InfoItem
            label="Date of Birth"
            value={new Date(dob).toLocaleDateString()}
          />
          <InfoItem label="Email Address" value={email} />
          <InfoItem label="Phone Number" value={phone} />
          <InfoItem label="User Role" value={role?.name} />
        </InfoGrid>
      </Section>

      {/* Address */}
      <Section title="Address">
        <InfoGrid cols={3}>
          <InfoItem label="Country" value={country} />
          <InfoItem label="City" value={`${address}, ${state}`} />
          <InfoItem label="Postal Code" value={zipcode} />
        </InfoGrid>
      </Section>
    </div>
  );
};

export default ViewMyProfile;
