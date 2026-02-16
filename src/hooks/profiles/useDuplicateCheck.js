import { useRef } from "react";
import { BASE_URL } from "../../config/api";

const useDuplicateCheck = ({ token, setErrors }) => {
  const debounceTimer = useRef(null);

  const checkDuplicate = async (field, value) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/profiles/check-duplicate?${field}=${value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleDuplicateCheck = (field, value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!value) return;

      const response = await checkDuplicate(field, value);
      if (!response) return;

      setErrors((prev) => ({
        ...prev,
        [field]: response.exists ? response.message : "",
      }));
    }, 600);
  };

  return { handleDuplicateCheck };
};

export default useDuplicateCheck;
