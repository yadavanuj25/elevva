import Swal from "sweetalert2";
import "../styles/swal.css";

export const NotificationSwal = ({ title, message }) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: null,
    padding: "0",
    background: "#ffffff",
    customClass: {
      popup: "heads-up-popup",
      closeButton: "heads-up-close",
    },
    html: `
      <div class="heads-up-container">
        <div class="heads-up-icon">
          🔔
        </div>

        <div class="heads-up-content">
          <div class="heads-up-title">${title}</div>
          <div class="heads-up-message">${message}</div>
        </div>
      </div>
    `,
  });
};
