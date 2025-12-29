import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import loginbg from "../assets/login/login4.png";
import logo from "../assets/logo/logo.png";
import login3 from "../assets/login/login3.png";
import PageTitle from "../hooks/PageTitle";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { resetPassword } from "../services/authServices";
import LoginCard from "../components/cards/LoginCard";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = () => {
  PageTitle("Elevva" | "Reset Password");
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    pass: false,
    confirm: false,
  });

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: "",
    }));
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await resetPassword(token, password, confirmPassword);
      if (res.success) {
        navigate("/login");
      } else {
        setErrors({ general: res.message || "Something went wrong" });
      }
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Failed to reset password",
      });
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

          <div className="w-full rounded-xl p-3 sm:p-12 border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Set New Password
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choosing strong password keeps hacker's at bay !
            </p>
            {errors.general && (
              <div
                className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-[#d72b16] text-white shadow-sm animate-slideDown"
              >
                <span className=" font-semibold">⚠ {"  "}</span>
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type={showPassword.pass ? "text" : "password"}
                name="password"
                value={password}
                handleChange={handlePasswordChange}
                errors={errors}
                labelName="Password"
                className="mt-2"
                icon={
                  showPassword.pass ? (
                    <EyeOff
                      size={18}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          pass: !prev.pass,
                        }))
                      }
                    />
                  ) : (
                    <Eye
                      size={18}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          pass: !prev.pass,
                        }))
                      }
                    />
                  )
                }
              />

              <Input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                handleChange={handleConfirmPasswordChange}
                errors={errors}
                labelName="Confirm Password"
                className="mt-2"
                icon={
                  showPassword.confirm ? (
                    <EyeOff
                      size={18}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    />
                  ) : (
                    <Eye
                      size={18}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    />
                  )
                }
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-8 bg-accent-dark hover:opacity-90 text-white font-semibold py-3 rounded-lg transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <Link
              to="/login"
              className="w-full flex justify-center items-center font-semibold text-accent-dark mt-4"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <LoginCard />
    </div>
  );
};

export default ResetPassword;
