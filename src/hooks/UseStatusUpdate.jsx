import { useState } from "react";
import SuccessToast from "../ui/toaster/SuccessToast";
import ErrorToast from "../ui/toaster/ErrorToast";

const UseStatusUpdate = (updateFn, setData) => {
  const [loadingId, setLoadingId] = useState(null);

  const updateStatus = async (id, status) => {
    setLoadingId(id);
    try {
      const res = await updateFn(id, { status });
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      SuccessToast(res?.message || "Status updated");
    } catch (err) {
      ErrorToast(err.message || "Failed to update");
    } finally {
      setLoadingId(null);
    }
  };

  return { updateStatus, loadingId };
};

export default UseStatusUpdate;
