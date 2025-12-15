import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Vite-compatible PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ProfileSubmission = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    currentLocation: "",
    workMode: "",
    noticePeriod: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Extract data from PDF text
  const extractData = (text) => {
    text = text.replace(/\s+/g, " ").trim();

    // 1️⃣ Name → first line
    const lines = text.split("\n");
    const name = lines[0]?.trim() || "";

    // 2️⃣ Email
    const emailMatch = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    const email = emailMatch ? emailMatch[0] : "";

    // 3️⃣ Phone
    const phoneMatch = text.match(/(\+91[-\s]?)?\d{10}/);
    const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, "") : "";

    // 4️⃣ Current Company → first company under Experience
    let company = "";
    const expIndex = text.toLowerCase().indexOf("experience");
    if (expIndex !== -1) {
      const expText = text.slice(expIndex);
      const companyMatch = expText.match(/([A-Z][A-Za-z &().,]+?)\s+\(/);
      company = companyMatch ? companyMatch[1].trim() : "";
    }
    return { name, email, phone, company };
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join("\n") + "\n";
    }

    const extracted = extractData(text);

    // Set extracted data to correct form fields
    setFormData((prev) => ({
      ...prev,
      name: extracted.name || prev.name,
      email: extracted.email || prev.email,
      phone: extracted.phone || prev.phone,
      company: extracted.company || prev.company,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Submitted:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Profile Submission
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resume Upload */}
        <div>
          <label className="block font-medium mb-1">
            Upload Resume (PDF only)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="block w-full border rounded-md p-2"
          />
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="company"
            placeholder="Current Company"
            value={formData.company}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="currentLocation"
            placeholder="Current Location"
            value={formData.currentLocation}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Work Mode</option>
            <option value="Office">Office</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          <input
            type="text"
            name="noticePeriod"
            placeholder="Notice Period"
            value={formData.noticePeriod}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSubmission;
