import { useEffect, useState } from "react";
import { FolderClosed, Check, CloudUpload } from "lucide-react";
import CircularProgressUpload from "./CircularProgressUpload";

const ResumeUpload = ({
  fileInputRef,
  resume,
  fallback,
  errors,
  isDragging,
  setIsDragging,
  onFileSelect,
  fullWidth = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const startUpload = (file) => {
    const isValid = onFileSelect(file);
    if (!isValid) return;
    setUploading(true);
    setProgress(0);
  };
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) startUpload(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startUpload(file);
  };

  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return Math.min(p + 8, 100);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [uploading]);

  const displayFile = resume || fallback;

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          h-[250px] border-2 border-dashed rounded-xl p-6
          cursor-pointer transition-all duration-300 group
          bg-white dark:bg-gray-800 flex items-center justify-center
          ${
            isDragging
              ? "border-accent-dark scale-[1.02]"
              : errors?.resume
              ? "border-red-500"
              : "border-accent-dark"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleChange}
        />

        {uploading ? (
          <CircularProgressUpload
            progress={progress}
            fileName={resume?.name}
            fileSize={resume ? (resume.size / (1024 * 1024)).toFixed(2) : null}
          />
        ) : displayFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-200 text-green-600 flex items-center justify-center">
              <Check size={26} />
            </div>
            <p className="text-green-600 font-semibold truncate max-w-xs">
              {displayFile.name}
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center gap-3 transition-colors ${
              errors.resume ? "text-red-600" : "text-gray-700"
            }`}
          >
            <div
              className={`
      w-14 h-14 rounded-full flex items-center justify-center
      transition-all duration-300 ease-out
      group-hover:animate-tada
      
      ${
        errors.resume
          ? "bg-red-100 text-red-600"
          : "bg-accent-light text-accent-dark"
      }
    `}
            >
              <CloudUpload size={30} />
            </div>
            <p
              className={`font-semibold transition-colors ${
                errors.resume ? "text-red-600" : "text-accent-dark"
              }`}
            >
              {isDragging ? "Drop your resume here" : "Upload Your Resume"}
            </p>
            <p className="text-sm text-gray-500">
              PDF format only • Maximum size 20 MB
            </p>
            {errors.resume ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.resume}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Click to browse or drag & drop your file
              </p>
            )}
          </div>
        )}
      </div>

      {/* Yup error only */}
      {errors?.resume && (
        <p className="text-red-500 text-sm mt-2">{errors.resume}</p>
      )}
    </div>
  );
};

export default ResumeUpload;
