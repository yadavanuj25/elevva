import { Calendar, FileText, Gift, Mail, Pencil, Phone } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import FormatDate from "../ui/dateFormat.jsx/FormatDate";

const EmployeeProfileCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  return (
    <div className="h-full bg-white dark:bg-gray-800  rounded-lg border border-[#E8E8E9] dark:border-gray-600 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1f2429] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            {user?.profileImage ? (
              <img
                src={user?.profileImage}
                alt="profile"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="profile"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg leading-tight">
              {user?.fullName}
            </h3>
            <p className="text-sm text-gray-300 flex items-center">
              {user?.role?.name}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => navigate("/my-profile")}
          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-5">
        <Info
          label="Phone Number"
          value={user?.phone}
          icon={<Phone size={14} />}
        />
        <Info
          label="Email Address"
          value={user?.email}
          icon={<Mail size={14} />}
        />
        <Info
          label="BirthDay"
          value={<FormatDate date={user?.dob} />}
          icon={<Gift size={14} />}
        />
        <Info
          label="Joined on"
          value={<FormatDate date={user?.createdAt} />}
          icon={<Calendar size={14} />}
        />
      </div>
    </div>
  );
};

const Info = ({ label, value, icon }) => (
  <div>
    <p className="flex gap-2 items-center text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">
      {icon}
      {label}
    </p>
    <p className="  text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default EmployeeProfileCard;
