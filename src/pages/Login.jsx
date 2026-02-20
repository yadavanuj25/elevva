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
import ErrorMessage from "../components/modals/errors/ErrorMessage";

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
      const res = await loginUser(formdata);
      if (!res.success) {
        showError(res.message);
        return;
      }

      // Pass rememberMe to login function
      await login({ ...res, rememberMe: formdata.rememberMe });

      if (res.user?.isLocked) {
        navigate("/lock-screen", { replace: true });
        return;
      }
      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      if (err.message) {
        showError(err?.message || "Login failed");
        return;
      }
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          <div className="w-full rounded-xl p-3 sm:p-8 border border-[#E8E8E9]">
            <ErrorMessage errorMsg={errorMsg} />
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div>
                <h2 className=" text-gray-800 dark:text-white mb-2">Login</h2>
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
                disabled={loading || errorMsg}
                className={`w-full mt-8 bg-accent-dark hover:opacity-90 text-white font-semibold py-3 rounded-lg ${
                  loading || errorMsg ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <LoginCard />
    </div>
  );
};

export default Login;
