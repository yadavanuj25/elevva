// hooks/useFileUpload.js
import { useState, useRef } from "react";

export const useFileUpload = (maxSizeMB = 20) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Only pdf allowed");
      return;
    }
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB} MB!`);
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  const handleFileSelect = (e) => validateAndSetFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleBoxClick = () => fileInputRef.current.click();

  return {
    file,
    setFile,
    error,
    isDragging,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleBoxClick,
    validateAndSetFile,
    setError,
  };
};
