import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import * as yup from "yup";

const schema = yup.object().shape({
  password: yup.string().required("Password is required"),
});

const LockScreen = () => {
  const navigate = useNavigate();
  const { user, unlockScreen, setUser } = useAuth();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ password }, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await unlockScreen(password);

      if (res.success) {
        const updatedUser = { ...user, isLocked: false };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate("/dashboard", { replace: true });
        // Redirect based on user role
        // const role = user?.role?.name?.toLowerCase();
        // if (role === "admin") {
        //   navigate("/admin/super-dashboard", { replace: true });
        // } else {
        //   navigate("/dashboard", { replace: true });
        // }
      } else {
        setErrors({ password: "Incorrect password" });
      }
    } catch (err) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center  px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow border border-gray-200">
        <h3 className="text-center text-gray-600 text-lg mb-4">
          Welcome back!
        </h3>

        {/* User Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md bg-gray-200">
            <img
              src={
                user?.profileImage ||
                "https://staging.ecodedash.com/cias/assets/dist/img/userimg.png"
              }
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center  text-gray-800 mb-6">
          {user?.fullName || "User"}
        </h2>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock}>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            labelName="Password"
            value={password}
            errors={errors}
            handleChange={(e) => {
              setPassword(e.target.value);
              setErrors({});
            }}
            icon={
              showPassword ? (
                <EyeOff size={18} onClick={() => setShowPassword(false)} />
              ) : (
                <Eye size={18} onClick={() => setShowPassword(true)} />
              )
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-accent-dark hover:opacity-90"
          >
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
