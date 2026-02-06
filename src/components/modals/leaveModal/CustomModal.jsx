import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Button from "../../ui/Button";
import CancelButton from "../../ui/buttons/Cancel";
import Close from "../../ui/buttons/Close";
import Textareafield from "../../ui/formFields/Textareafield";

const CustomModal = ({
  open,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  initialValue = "",
  loading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setValue("");
      onClose();
    }, 300);
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
    transition-opacity duration-300
    ${isVisible ? "opacity-100" : "opacity-0"}
    bg-black/80`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl
      bg-white dark:bg-darkBg
      transform transition-all duration-300
      ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <div className="flex justify-between items-center px-5 py-3 rounded-t-2xl bg-accent-dark border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <Close handleClose={handleClose} />
        </div>

        {/* CONTENT */}
        <div
          className="p-5 space-y-4
      bg-gray-50 dark:bg-darkGray
      text-gray-800 dark:text-gray-200"
        >
          <Textareafield
            name="modalInput"
            label={label}
            placeholder={placeholder}
            value={value}
            handleChange={handleChange}
            rows={4}
          />
        </div>

        {/* FOOTER */}
        <div
          className="flex justify-end gap-3 p-4 rounded-b-2xl
      bg-white dark:bg-darkBg
      border-t border-gray-200 dark:border-gray-700"
        >
          <CancelButton onClick={handleClose} />
          <Button
            text="Submit"
            icon={<Save size={16} />}
            handleClick={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
