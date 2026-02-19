import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

const LogoutModal = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const showLogoutModal = async () => {
    const result = await Swal.fire({
      title: "Log out of your account?",
      text: "You’ll be signed out and need to log in again to continue.",
      icon: "question",
      iconColor: "#dc2626",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Stay logged in",
      background: "#f9fafb",
      color: "#dc2626",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      backdrop: "rgba(0, 0, 0, 0.9)",
      customClass: {
        popup: "rounded-2xl shadow-xl p-6",
        title: "text-lg font-semibold text-[#dc2626]",
        htmlContainer: "text-sm text-gray-600",
        confirmButton:
          "px-5 py-2 rounded-lg font-medium bg-[#dc2626] hover:opacity-90 transition-all",
        cancelButton:
          "px-5 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all",
      },
    });

    if (!result.isConfirmed) return;

    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return showLogoutModal;
};

export default LogoutModal;
