import { Calendar, FileText, Mail, Pencil, Phone } from "lucide-react";

const EmployeeProfileCard = () => {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1f2429] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="profile"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg leading-tight">Anuj Yadav</h3>

            <p className="text-sm text-gray-300 flex items-center">
              Frontend Developer
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition">
          <Pencil size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-5">
        <Info
          label="Phone Number"
          value="+1 324 3453 545"
          icon={<Phone size={14} />}
        />
        <Info
          label="Email Address"
          value="Steperde124@example.com"
          icon={<Mail size={14} />}
        />
        <Info
          label="Report Office"
          value="Doglas Martini"
          icon={<FileText size={14} />}
        />
        <Info
          label="Joined on"
          value="15 Jan 2024"
          icon={<Calendar size={14} />}
        />
      </div>
    </div>
  );
};

const Info = ({ label, value, icon }) => (
  <div>
    <p className="flex gap-2 items-center text-sm text-gray-600 mb-0.5">
      {icon}
      {label}
    </p>
    <p className=" font-medium text-gray-900">{value}</p>
  </div>
);

export default EmployeeProfileCard;
