import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import { useMessage } from "../auth/MessageContext";
import logo from "../assets/logo/logo.png";
import PageTitle from "../hooks/PageTitle";
import LoginCard from "../components/cards/LoginCard";
import { loginUser } from "../services/authServices";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  PageTitle("Elevva | Login");
  const { showSuccess, showError, errorMsg } = useMessage();
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    showError("");
    showSuccess("");
    setLoading(true);
    try {
      await schema.validate(formdata, { abortEarly: false });
      const data = await loginUser(formdata);
      if (!data.token || !data.user) {
        showError(data.message || "Invalid credentials");
        return;
      }
      await login(data);
      if (data.user.isLocked) {
        navigate("/lock-screen", { replace: true });
      } else {
        const userRole = data.user.role?.name?.toLowerCase() || "user";
        if (userRole === "admin")
          navigate("/admin/super-dashboard", { replace: true });
        else navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => (newErrors[e.path] = e.message));
        setErrors(newErrors);
      } else {
        showError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        showSuccess("");
        showError("");
      }, 4000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[45%_55%] min-h-screen bg-white dark:bg-gray-900">
      <div className="order-2 flex items-center justify-center">
        <div className="w-[80%] flex flex-col justify-center items-center px-6 sm:px-12">
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Elevva CRM Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-semibold">Elevva CRM</h1>
          </div>

          <div className="w-full rounded-xl p-3 sm:p-12 border border-gray-300">
            {errorMsg && (
              <div
                className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-[#d72b16] text-white shadow-sm animate-slideDown"
              >
                <span className=" font-semibold">⚠ {"  "}</span>
                <p className="text-sm"> {errorMsg}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Login
                </h2>
                <p className="text-gray-500">Login to access Elevva CRM</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  name="email"
                  value={formdata.email}
                  handleChange={handleChange}
                  errors={errors}
                  labelName="Email"
                  className="mt-2"
                  icon={<Mail size={18} />}
                />
              </div>

              <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formdata.password}
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formdata.rememberMe}
                    onChange={(e) =>
                      setFormdata({ ...formdata, rememberMe: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#3282ff]"
                  />
                  Remember me
                </label>

                <p
                  className="text-[#3282ff] font-medium hover:underline cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-8 bg-accent-dark hover:opacity-90 text-white font-semibold py-3 rounded-lg  ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right → Banner */}
      <LoginCard />
    </div>
  );
};

export default Login;
