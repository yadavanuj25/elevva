import React, { useState, useRef } from "react";
import { X, Sparkles, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { BASE_URL } from "../../config/api";
import { swalError } from "../../utils/swalHelper";
import { useMessage } from "../../auth/MessageContext";

const UploadResumeModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useMessage();
    const fileInputRef = useRef(null);

    const [mode, setMode] = useState("choice"); // "choice" | "ai-form"
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const resetAndClose = () => {
        setMode("choice");
        setFile(null);
        setComment("");
        setLoading(false);
        onClose();
    };

    const handleManualUpload = () => {
        onClose();
        navigate("/profiles/new");
    };

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword"
        ];

        if (!validTypes.includes(selected.type) && !selected.name.endsWith(".docx") && !selected.name.endsWith(".doc")) {
            swalError("Only PDF and DOCX files are allowed");
            return;
        }

        if (selected.size > 20 * 1024 * 1024) {
            swalError("File must be less than 20MB");
            return;
        }

        setFile(selected);
    };

    const handleAIUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            swalError("Please select a resume file first");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (comment.trim()) {
            formData.append("comment", comment);
        }

        try {
            // Direct call to AI Server
            const res = await fetch("http://localhost:8000/upload-resume", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to parse resume with AI");
            }

            showSuccess("AI profile created successfully!");

            // Navigate to the newly created profile view if it was created in CRM (data from AI Server provides talent document ID or similar, but the CRM profile _id is inside crm_response)
            const profileId = data.crm_response?.data?.profile?._id || data.crm_response?.data?._id;

            if (profileId) {
                navigate(`/profiles/${profileId}`);
            } else {
                // Fallback to table if we don't know the exact ID
                navigate("/profiles");
            }
            resetAndClose();

        } catch (err) {
            swalError(err.message || "An error occurred during AI extraction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {mode === "choice" ? "Add New Candidate" : "AI Resume Extraction"}
                    </h2>
                    <button
                        onClick={resetAndClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 p-1.5 rounded-full"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === "choice" && (
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm text-center">
                            How would you like to add this candidate's profile?
                        </p>

                        <div className="space-y-4">
                            {/* Option 1: AI */}
                            <button
                                onClick={() => setMode("ai-form")}
                                className="w-full flex items-start gap-4 p-5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/40 transition text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-purple-900 dark:text-purple-300 text-lg mb-0.5">Automated with AI</h3>
                                    <p className="text-sm text-purple-700 dark:text-purple-400/80 leading-snug">
                                        Upload a resume and let AI instantly fill all details and assess skills.
                                    </p>
                                </div>
                            </button>

                            {/* Option 2: Manual */}
                            <button
                                onClick={handleManualUpload}
                                className="w-full flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750 transition text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-0.5">Manual Entry</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                                        Fill out the form manually and upload the resume document yourself.
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {mode === "ai-form" && (
                    <form onSubmit={handleAIUploadSubmit} className="p-6">
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Resume Document (PDF/DOCX) <span className="text-red-500">*</span>
                            </label>

                            <div
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                                onClick={() => document.getElementById("ai-resume-file")?.click()}
                            >
                                <input
                                    id="ai-resume-file"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileSelect}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText size={32} className="text-purple-500" />
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white px-2 truncate w-full">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Upload size={32} className="mb-1 opacity-60" />
                                        <span className="text-sm font-medium">Click to select resume</span>
                                        <span className="text-xs opacity-80">PDF or DOCX max 20MB</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Recruiter Comments (Optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="E.g., Candidate did exceptionally well in problem-solving during the technical screen. Strong React skills."
                                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none bg-white dark:bg-darkBg text-gray-800 dark:text-white text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                Adding comments will boost the AI's confidence levels for specific skills.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                onClick={() => setMode("choice")}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <Button
                                type="submit"
                                text="Process with AI ✨"
                                loading={loading}
                                disabled={!file || loading}
                                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md border-0"
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UploadResumeModal;
