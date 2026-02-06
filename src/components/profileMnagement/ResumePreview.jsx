import { Eye, X } from "lucide-react";
import previewResumeImg from "../../assets/images/dummy-resume.jpg";

const ResumePreview = ({ previewUrl, fileName, show, onOpen, onClose }) => {
  // No resume available
  if (!previewUrl) {
    return (
      <div className="h-[250px] flex flex-col items-center justify-center text-gray-500 border rounded-xl">
        <Eye size={40} className="mb-2 opacity-50" />
        <p className="text-sm">No resume uploaded</p>
      </div>
    );
  }

  return (
    <>
      {/* Preview Card */}
      <div className="relative h-[250px] border rounded-xl overflow-hidden">
        <img
          src={previewResumeImg}
          alt="Resume Preview"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpen}
            className="px-4 py-2 bg-white text-black rounded-md flex items-center gap-2 shadow"
          >
            <Eye size={18} />
            View Resume
          </button>
        </div>
      </div>

      {/* Modal – ONLY when show === true */}
      {show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="relative bg-white w-full max-w-4xl rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 bg-red-500 text-white p-1 rounded"
            >
              <X size={18} />
            </button>

            {/* File Name */}
            <div className="text-center py-3 font-semibold border-b">
              {fileName || "Resume Preview"}
            </div>

            {/* PDF Preview */}
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="w-full h-[600px]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ResumePreview;
