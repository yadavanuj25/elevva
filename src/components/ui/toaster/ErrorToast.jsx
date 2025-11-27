import { toast } from "react-toastify";
const ErrorToast = (msg) => {
  toast.error(msg, {
    style: {
      background: "#dc2626",
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#dc2626",
    },
    progressStyle: { background: "white" },
  });
};

export default ErrorToast;
