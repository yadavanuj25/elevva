import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";
import Input from "../Input";

const LockScreen = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const userImage =
    user?.profileImage ||
    "https://staging.ecodedash.com/cias/assets/dist/img/userimg.png";

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow border border-gray-200">
        <h3 className="text-center text-gray-600 text-lg mb-4">
          Welcome back!
        </h3>

        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md bg-gray-200">
            <img
              src={userImage}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          {user?.fullName || "Name"}
        </h2>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            handleChange={handleChange}
            errors={errors}
            labelName="Password"
            className="mt-2"
            icon={
              showPassword ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            }
          />
        </div>

        {/* Login Button */}
        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold  transition">
          Login
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
