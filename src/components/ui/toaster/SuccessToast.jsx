import { toast } from "react-toastify";

const SuccessToast = (msg) => {
  toast.success(msg, {
    style: {
      background: "#16a34a",
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#16a34a",
    },
    progressStyle: { background: "white" },
  });
};

export default SuccessToast;
