// export const useProfileHandlers = (setFormData, setErrors) => {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "phone" || name === "alternatePhone") {
//       const digits = value.replace(/\D/g, "");
//       setFormData((p) => ({ ...p, [name]: digits }));
//       if (!digits) {
//         setErrors((p) => ({ ...p, [name]: "" }));
//         return;
//       }
//       if (digits.length < 10 || digits.length > 15) {
//         setErrors((p) => ({
//           ...p,
//           [name]: "Phone must be 10–15 digits",
//         }));
//       } else {
//         setErrors((p) => ({ ...p, [name]: "" }));
//       }
//       return;
//     }
//     // CTC
//     if (name === "currentCTC" || name === "expectedCTC") {
//       const clean = value.replace(/,/g, "");
//       if (!/^\d*$/.test(clean)) return;
//       const formatted = clean
//         ? new Intl.NumberFormat("en-IN").format(Number(clean))
//         : "";
//       setFormData((p) => ({ ...p, [name]: formatted }));
//       return;
//     }
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   return { handleChange };
// };

export const useProfileHandlers = (setFormData, setErrors) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "alternatePhone") {
      const digits = value.replace(/\D/g, "");
      setFormData((p) => ({ ...p, [name]: digits }));
      setErrors((p) => ({ ...p, [name]: "" }));

      if (!digits) return;
      if (digits.length < 10 || digits.length > 15) {
        setErrors((p) => ({ ...p, [name]: "Phone must be 10–15 digits" }));
      }
      return;
    }

    if (name === "currentCTC" || name === "expectedCTC") {
      const clean = value.replace(/,/g, "");
      if (!/^\d*$/.test(clean)) return;
      const formatted = clean
        ? new Intl.NumberFormat("en-IN").format(Number(clean))
        : "";
      setFormData((p) => ({ ...p, [name]: formatted }));
      setErrors((p) => ({ ...p, [name]: "" }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" })); // clear error on typing
  };

  return { handleChange };
};
