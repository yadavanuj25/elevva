import Swal from "sweetalert2";
import "../styles/swal.css";

const CustomSwal = Swal.mixin({
  customClass: {
    popup: "swal-popup",
    title: "swal-title",
    htmlContainer: "swal-text",
    confirmButton: "swal-confirm",
    cancelButton: "swal-cancel",
    icon: "swal-icon",
  },
  buttonsStyling: false,
  background: "#ffffff",
  backdrop: "rgba(0,0,0,0.9)",
});

export default CustomSwal;
