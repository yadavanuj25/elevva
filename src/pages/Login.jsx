// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import { FaFacebookF, FaTwitter } from "react-icons/fa";
// import { Mail, Eye, EyeOff } from "lucide-react";
// import { useAuth } from "../auth/AuthContext";
// import Input from "../components/ui/Input";
// import loginbg from "../assets/login/login4.png";
// import logo from "../assets/logo/logo.png";
// import login1 from "../assets/login/login1.png";
// import login2 from "../assets/login/login2.png";
// import login3 from "../assets/login/login3.png";
// import googleLogo from "../assets/images/google-logo.svg";
// import PageTitle from "../hooks/PageTitle";

// const schema = yup.object().shape({
//   email: yup
//     .string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   password: yup.string().required("Password is required"),
// });

// const Login = () => {
//   PageTitle("Elevva | Login");
//   const [formdata, setFormdata] = useState({ email: "", password: "" });
//   const [tab, setTab] = useState("Login");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMsg, showError] = useState("");
//   const [successMsg, showSuccess] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormdata({ ...formdata, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     showError("");
//     showSuccess("");
//     setLoading(true);
//     try {
//       await schema.validate(formdata, { abortEarly: false });
//       const response = await fetch(
//         "https://crm-backend-qbz0.onrender.com/api/auth/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formdata),
//         }
//       );
//       const data = await response.json();
//       if (!response.ok || !data.token || !data.user) {
//         showError(data.message || "Invalid credentials");
//         return;
//       }
//       await login(data);
//       showSuccess("Login successful!");
//       const userRole = data.user.role?.name?.toLowerCase() || "user";
//       if (userRole === "admin") navigate("/admin/super-dashboard");
//       else navigate("/dashboard");
//     } catch (err) {
//       if (err.name === "ValidationError") {
//         const newErrors = {};
//         err.inner.forEach((e) => {
//           newErrors[e.path] = e.message;
//         });
//         setErrors(newErrors);
//       } else {
//         console.error("Login error:", err);
//         showError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//       setTimeout(() => {
//         showSuccess("");
//         showError("");
//       }, 4000);
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[45%_55%] min-h-screen bg-white dark:bg-gray-900 ">
//       <div className="order-2 flex items-center justify-center">
//         <div className="w-[80%]  flex flex-col justify-center items-center px-6 sm:px-12">
//           <div className="flex items-center gap-2 mb-6">
//             <img src={logo} alt="Elevva CRM Logo" className="w-10 h-10" />
//             <h1 className="text-3xl font-semibold ">Elevva CRM</h1>
//           </div>

//           {/* Login  */}
//           <div className="w-full rounded-xl p-3 sm:p-12 border border-gary-300 ">
//             {successMsg && (
//               <p className="mb-3 p-3 rounded-md bg-green-100 text-white border border-green-300 text-sm text-center">
//                 {successMsg}
//               </p>
//             )}
//             {errorMsg && (
//               <p className="mb-3 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm text-center">
//                 {errorMsg}
//               </p>
//             )}
//             {tab === "Login" && (
//               <>
//                 <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
//                       Login
//                     </h2>
//                     <p className="text-gray-500 text-md mt-2">
//                       Login to access the Elevva CRM
//                     </p>
//                   </div>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   <div className="relative">
//                     <label htmlFor="email" className=" font-medium">
//                       Email Address
//                     </label>
//                     <Input
//                       // id="login_email"
//                       type="text"
//                       name="email"
//                       value={formdata.email}
//                       handleChange={handleChange}
//                       errors={errors}
//                       labelName="Email"
//                       className="mt-2"
//                       icon={<Mail size={18} />}
//                     />
//                   </div>

//                   <div className="relative">
//                     <label className=" font-medium">Password</label>
//                     <Input
//                       // id="password"
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formdata.password}
//                       handleChange={handleChange}
//                       errors={errors}
//                       labelName="Password"
//                       className="mt-2"
//                       icon={
//                         showPassword ? (
//                           <EyeOff
//                             size={18}
//                             className="cursor-pointer"
//                             onClick={() => setShowPassword(false)}
//                           />
//                         ) : (
//                           <Eye
//                             size={18}
//                             className="cursor-pointer"
//                             onClick={() => setShowPassword(true)}
//                           />
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <label className="flex items-center gap-2 cursor-pointer ">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4  accent-[#3282ff]  border-gray-300 rounded "
//                       />
//                       Remember me
//                     </label>
//                     <Link
//                       to="/forgot-password"
//                       className="text-[#3282ff]  font-medium hover:underline"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full bg-[#3282ff] text-white font-semibold py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90 ${
//                       loading ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Signing in..." : "Sign in"}
//                   </button>

//                   <div className="flex items-center justify-center my-5 text-gray-500 dark:text-gray-300 text-sm">
//                     <span className="border-b w-1/3"></span>
//                     <span className="px-2 font-semibold">or login with</span>
//                     <span className="border-b w-1/3"></span>
//                   </div>
//                   {/* Social Login */}
//                   <div className="grid grid-cols-3 gap-3">
//                     <button
//                       type="button"
//                       className="flex items-center justify-center p-3 bg-[#3282ff]  rounded border border-gray-300  hover:opacity-90  transition"
//                     >
//                       <FaFacebookF className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
//                     </button>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center p-3 rounded border border-gray-300 hover:opacity-90 transition"
//                     >
//                       <img src={googleLogo} alt="google" />
//                     </button>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center p-3  rounded bg-black border border-gray-300 hover:opacity-90 transition"
//                     >
//                       <FaTwitter className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
//                     </button>
//                   </div>
//                 </form>
//               </>
//             )}
//             {tab === "Forgot Password" && (
//               <div className="w-full">
//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//                   Forgot Password
//                 </h2>

//                 <p className="text-gray-500 text-sm mb-6">
//                   Enter your email and we’ll send you a reset link.
//                 </p>

//                 <form className="space-y-5">
//                   <div className="relative">
//                     <label htmlFor="email" className="font-medium">
//                       Email Address
//                     </label>
//                     <Input
//                       type="text"
//                       name="email"
//                       value={formdata.email}
//                       handleChange={handleChange}
//                       labelName="Email"
//                       className="mt-2"
//                       icon={<Mail size={18} />}
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full bg-[#3282ff] text-white font-semibold py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                   >
//                     Send Reset Link
//                   </button>

//                   <p
//                     className="text-sm text-[#3282ff] mt-4 cursor-pointer hover:underline"
//                     onClick={() => setTab("Login")}
//                   >
//                     ← Back to Login
//                   </p>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

{
  /* <div className="relative order-1 hidden md:flex justify-center items-center w-full backdrop-blur-xl bg-gradient-to-b from-[#0a60ee] to-[#203455] py-10">
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
</div>; */
}
//     </div>
//   );
// };
// export default Login;

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

  const API_FORGOT_URL =
    "https://crm-backend-qbz0.onrender.com/api/auth/forgot-password";

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

export default Login;
