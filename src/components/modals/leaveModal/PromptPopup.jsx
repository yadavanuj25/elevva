// import Swal from "sweetalert2";

// const getRejectionReason = async () => {
//   const { value: reason } = await Swal.fire({
//     title: "Reject Request",
//     html: `
//       <p class="text-sm text-gray-500">
//         Please provide a clear reason for rejection
//       </p>
//     `,
//     icon: "warning",
//     input: "textarea",
//     inputPlaceholder: "Type your rejection reason here...",
//     inputAttributes: {
//       "aria-label": "Rejection reason",
//       maxlength: 200,
//     },

//     showCancelButton: true,
//     confirmButtonText: "Reject",
//     cancelButtonText: "Cancel",

//     backdrop: `
//       rgba(10, 9, 0, 0.6)
//       backdrop-filter: blur(10px);
//       -webkit-backdrop-filter: blur(10px);
//     `,

//     buttonsStyling: false,
//     customClass: {
//       popup: "rounded-xl p-4",
//       title: "text-lg font-semibold",
//       input:
//         "border rounded-lg p-3 text-sm focus:outline-none focus:ring-0 focus:shadow-none",
//       confirmButton:
//         "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition",
//       cancelButton:
//         "bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition ml-3",
//     },

//     inputValidator: (value) => {
//       if (!value || value.trim().length < 5) {
//         return "Please enter at least 5 characters";
//       }
//     },
//   });

//   return reason;
// };

// export default getRejectionReason;

import React from "react";

const PromptPopup = () => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
    transition-opacity duration-300
    ${isVisible ? "opacity-100" : "opacity-0"}
    bg-black/90`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl
      bg-white dark:bg-darkBg
      transform transition-all duration-300
      ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <div className="flex justify-between items-center px-5 py-3 rounded-t-2xl  bg-accent-dark border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Assign Requirements
          </h2>

          <Close handleClose={handleClose} />
        </div>

        {/* CONTENT */}
        <div
          className="p-5 space-y-4 max-h-[70vh] overflow-y-auto
      bg-gray-50 dark:bg-darkGray
      text-gray-800 dark:text-gray-200"
        >
          <p className="font-semibold text-sm">Selected Requirements</p>
          {selectedRequirements.map((req) => (
            <div
              key={req._id}
              className="flex gap-2 px-3 py-2 text-sm rounded-lg
            bg-white dark:bg-darkBg
            border border-gray-200 dark:border-gray-700"
            >
              <Hash size={14} />
              {req.requirementCode} | {req.client.clientName} | {req.techStack}
            </div>
          ))}

          <div className="mt-4">
            <p className="font-semibold mb-2 text-sm">Assign To</p>

            <div
              className="max-h-48 overflow-y-auto rounded-lg
          bg-white dark:bg-darkBg
          border border-gray-200 dark:border-gray-700"
            >
              {options.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer
                hover:bg-gray-100 dark:hover:bg-darkGray"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(user._id)}
                    onChange={() => toggleUser(user._id)}
                  />
                  {user.fullName}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="flex justify-end gap-3 p-4 rounded-b-2xl
      bg-white dark:bg-darkBg
      border-t border-gray-200 dark:border-gray-700"
        >
          <CancelButton onClick={handleClose} />
          <Button
            text="Assign"
            icon={<Save size={16} />}
            handleClick={handleAssign}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptPopup;
