import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Mail, Eye, EyeOff } from "lucide-react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import { useMessage } from "../auth/MessageContext";
import loginbg from "../assets/login/login4.png";
import logo from "../assets/logo/logo.png";
import login3 from "../assets/login/login3.png";
import googleLogo from "../assets/images/google-logo.svg";
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   showError("");
  //   showSuccess("");
  //   setLoading(true);
  //   try {
  //     await schema.validate(formdata, { abortEarly: false });
  //     const response = await loginUser(formdata);
  //     console.log(response);
  //     const data = await response.json();
  //     if (!response.ok || !data.token || !data.user) {
  //       showError(data.message || "Invalid credentials");
  //       return;
  //     }
  //     await login(data);
  //     const userRole = data.user.role?.name?.toLowerCase() || "user";
  //     if (userRole === "admin") navigate("/admin/super-dashboard");
  //     else navigate("/dashboard");
  //   } catch (err) {
  //     if (err.name === "ValidationError") {
  //       const newErrors = {};
  //       err.inner.forEach((e) => (newErrors[e.path] = e.message));
  //       setErrors(newErrors);
  //     } else {
  //       showError("Something went wrong. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //     setTimeout(() => {
  //       showSuccess("");
  //       showError("");
  //     }, 4000);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    showError("");
    showSuccess("");
    setLoading(true);
    try {
      await schema.validate(formdata, { abortEarly: false });
      const response = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.token || !data.user) {
        showError(data.message || "Invalid credentials");
        return;
      }
      await login(data);
      const userRole = data.user.role?.name?.toLowerCase() || "user";
      if (userRole === "admin") navigate("/admin/super-dashboard");
      else navigate("/dashboard");
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
                className={`w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg  ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="flex items-center justify-center my-5 text-gray-500 text-sm">
                <span className="border-b w-1/3"></span>
                <span className="px-2 font-semibold">or login with</span>
                <span className="border-b w-1/3"></span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center p-3 bg-[#3282ff] rounded border hover:opacity-90">
                  <FaFacebookF className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
                </button>
                <button className="flex items-center justify-center p-3 border rounded hover:opacity-90">
                  <img src={googleLogo} alt="google" />
                </button>
                <button className="flex items-center justify-center p-3 bg-black border rounded hover:opacity-90">
                  <FaTwitter className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
                </button>
              </div>
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
