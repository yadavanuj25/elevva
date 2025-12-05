import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { Mail } from "lucide-react";
import Input from "../components/ui/Input";
import { useMessage } from "../auth/MessageContext";
import loginbg from "../assets/login/login4.png";
import logo from "../assets/logo/logo.png";
import login3 from "../assets/login/login3.png";
import PageTitle from "../hooks/PageTitle";
import SuccessPage from "./SuccessPage";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  PageTitle("Elevva | Forgot Password");

  const { showError, showSuccess, errorMsg, successMsg } = useMessage();
  const navigate = useNavigate();

  const [tab, setTab] = useState("ForgotPassword");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_FORGOT_URL =
    "https://crm-backend-qbz0.onrender.com/api/auth/forgot-password";

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    showError("");
    showSuccess("");
    try {
      await schema.validate({ email }, { abortEarly: false });
    } catch (validationErr) {
      const formattedErrors = {};
      validationErr.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(API_FORGOT_URL, { email });

      if (res?.data?.success) {
        setTab("Reset");
      } else {
        const msg = res.data?.message || "Something went wrong";
        showError(msg);
        setErrors({ email: msg });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset link";
      showError(msg);
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[45%_55%] min-h-screen bg-white dark:bg-gray-900">
      {/* LEFT SECTION */}
      <div className="order-2 flex items-center justify-center">
        <div className="w-[80%] flex flex-col justify-center items-center px-6 sm:px-12">
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Elevva CRM Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-semibold">Elevva CRM</h1>
          </div>

          <div className="w-full rounded-xl p-3 sm:p-12 border border-gray-300">
            {tab === "ForgotPassword" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Forgot Password
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                  Enter your email to receive a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    type="text"
                    name="email"
                    value={email}
                    handleChange={handleChange}
                    errors={errors}
                    labelName="Email"
                    className="mt-2"
                    icon={<Mail size={18} />}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <p
                    className="text-sm text-[#3282ff] mt-4 cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    ← Back to Login
                  </p>
                </form>
              </div>
            )}

            {tab === "Reset" && <SuccessPage email={email} />}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative order-1 hidden md:flex justify-center items-center w-full backdrop-blur-xl bg-gradient-to-b from-[#0a60ee] to-[#203455] py-10">
        <img src={login3} alt="" className="absolute bottom-6 right-3" />
        <img
          src={login3}
          alt=""
          className="absolute top-[-64px] left-[-64px]"
        />

        <div className="relative w-[80%] rounded-3xl p-10 border border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1869e7cf] to-[#2c475aa6] backdrop-blur-md"></div>

          <div className="relative z-10">
            <h3 className="text-white font-bold text-4xl leading-snug mb-5 text-center">
              Supercharge Your Customer Relations With Elevva CRM.
            </h3>

            <div className="flex justify-center mb-5">
              <img src={loginbg} alt="" className="object-contain" />
            </div>

            <h4 className="text-white text-2xl font-semibold text-center">
              Everything You Need to Succeed.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
