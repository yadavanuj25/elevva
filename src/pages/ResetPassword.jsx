import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import loginbg from "../assets/login/login4.png";
import logo from "../assets/logo/logo.png";
import login3 from "../assets/login/login3.png";
import PageTitle from "../hooks/PageTitle";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { resetPassword } from "../services/authServices";

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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Reset Password
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Enter your new password below.
            </p>

            {errors.general && (
              <p className="text-red-500 text-sm mb-3">{errors.general}</p>
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
                className={`w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative order-1 hidden md:flex justify-center items-center w-full backdrop-blur-xl bg-gradient-to-b from-[#0a60ee] to-[#203455] py-10">
        <img
          src={login3}
          alt="HR Illustration"
          className="absolute bottom-6 right-3  object-contain drop-shadow-xl"
        />
        <img
          src={login3}
          alt="HR Illustration"
          className="absolute top-[-64px] left-[-64px]  object-contain drop-shadow-xl"
        />
        <div className="relative w-[80%] rounded-3xl p-10 border border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1869e7cf] to-[#2c475aa6] backdrop-blur-md"></div>
          <div className="relative z-10">
            <h3 className="text-white font-bold text-4xl leading-snug mb-5 text-center">
              Supercharge Your Customer Relations With Elevva CRM.
            </h3>
            <div className="flex justify-center mb-5">
              <img
                src={loginbg}
                alt="HR Illustration"
                className="object-contain drop-shadow-xl"
              />
            </div>
            <h4 className="w-full text-white text-2xl font-semibold text-center px-6 py-3 rounded-md inline-block mx-auto">
              Everything You Need to Succeed.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
