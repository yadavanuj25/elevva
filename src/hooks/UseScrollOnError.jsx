import { useEffect } from "react";

const UseScrollOnError = (errors) => {
  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return;

    const firstKey = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${firstKey}"]`);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errors]);
};

export default UseScrollOnError;
