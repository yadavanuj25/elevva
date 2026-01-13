export const handleFormChange = (
  e,
  formData,
  setFormData,
  errors,
  setErrors,
  handleDuplicateCheck
) => {
  const { name, value } = e.target;
  let newValue = value;
  let errorMsg = "";

  if (name === "phone" || name === "alternatePhone") {
    const digits = value.replace(/\D/g, "");
    newValue = digits;
    if (value !== digits) errorMsg = "Only numbers are allowed";
    else if (digits.length && digits.length < 10)
      errorMsg = "Must be at least 10 digits";
    else if (digits.length > 15) errorMsg = "Must not exceed 15 digits";
  } else if (name === "currentCTC" || name === "expectedCTC") {
    const cleanValue = value.replace(/,/g, "");
    if (cleanValue && !/^\d+$/.test(cleanValue)) {
      errorMsg = "Only numbers are allowed";
      newValue = "";
    } else {
      newValue = cleanValue
        ? new Intl.NumberFormat("en-IN").format(Number(cleanValue))
        : "";
    }
  } else {
    newValue = value;
  }

  setFormData({ ...formData, [name]: newValue });
  setErrors({ ...errors, [name]: errorMsg });

  if (
    (name === "email" && newValue.length > 5) ||
    (name === "phone" && newValue.length === 10 && !errorMsg)
  ) {
    handleDuplicateCheck?.(name, newValue);
  }
};
